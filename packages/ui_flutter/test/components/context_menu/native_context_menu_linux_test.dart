import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Linux releases the GTK popup before replying to Dart', () {
    final source = File('linux/tinyrack_ui_plugin.cc').readAsStringSync();
    final start = source.indexOf('gboolean finish_cb(gpointer user_data)');
    final end = source.indexOf('\n}\n', start);
    final finishCallback = source.substring(start, end);

    expect(start, isNonNegative);
    final reply = finishCallback.indexOf('fl_method_call_respond(');
    for (final release in <String>[
      'gtk_menu_popdown(GTK_MENU(request->menu));',
      'gtk_widget_destroy(request->menu);',
      'g_object_unref(request->menu);',
    ]) {
      expect(
        finishCallback.indexOf(release),
        inInclusiveRange(0, reply - 1),
        reason:
            'Dart restores terminal focus when the method reply arrives, so '
            'the native popup and its GTK grab must already be gone.',
      );
    }
    expect('fl_method_call_respond('.allMatches(finishCallback), hasLength(1));
  });

  test('Linux supersedes a wedged popup before showing the next one', () {
    final source = File('linux/tinyrack_ui_plugin.cc').readAsStringSync();
    final show = source.indexOf('void show_context_menu(');
    final popup = source.indexOf('gtk_menu_popup_at_rect(', show);
    final supersede = source.indexOf('self->active_request', show);

    expect(show, isNonNegative);
    expect(
      supersede,
      inInclusiveRange(0, popup - 1),
      reason:
          'A previous request that never replied still holds its GTK grab. '
          'It must be finished — releasing that grab and answering Dart — '
          'before the next popup takes the seat.',
    );
  });

  test('Linux finishes the request when the popup leaves the screen', () {
    final source = File('linux/tinyrack_ui_plugin.cc').readAsStringSync();
    expect(
      source,
      contains('g_signal_connect(menu, "unmap"'),
      reason:
          'A compositor can dismiss a popup without GTK ever emitting '
          '`deactivate`; the unmap is the one signal every teardown shares.',
    );
    expect(
      source,
      contains('gtk_widget_get_mapped'),
      reason:
          'Visibility only proves show() ran. A popup that never mapped '
          'draws nothing while its grab freezes the window, so the request '
          'must fail over to the Flutter menu instead.',
    );
  });

  test('Linux never borrows a press time older than this menu request', () {
    final source = File('linux/tinyrack_ui_plugin.cc').readAsStringSync();
    expect(
      source,
      contains('press_seen'),
      reason:
          'Flutter can consume a press before its widget signal is emitted, '
          'leaving last_press_time describing an ancient press. A popup '
          'opened at that time keeps its grab while dismissing on the next '
          'event — the frozen-until-second-right-click window.',
    );
  });
}
