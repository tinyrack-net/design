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
}
