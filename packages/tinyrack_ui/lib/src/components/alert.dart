import 'package:flutter/material.dart';

import '../theme.dart';
import '../types.dart';

// @tinyrack-preview alert
/// A persistent semantic status message.
class TRAlert extends StatelessWidget {
  const TRAlert({
    required this.title,
    this.actions = const [],
    this.description,
    this.icon,
    this.intent = TRIntent.neutral,
    super.key,
  });

  final List<Widget> actions;
  final Widget? description;
  final Widget? icon;
  final TRIntent intent;
  final Widget title;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final foreground = colors.foregroundFor(intent);
    final content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        DefaultTextStyle.merge(
          style: TextStyle(color: foreground, fontWeight: FontWeight.w600),
          child: title,
        ),
        if (description case final description?)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: DefaultTextStyle.merge(
              style: TextStyle(color: colors.text),
              child: description,
            ),
          ),
        if (actions.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Wrap(spacing: 8, runSpacing: 8, children: actions),
          ),
      ],
    );
    return Semantics(
      container: true,
      liveRegion: intent != TRIntent.neutral,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.surfaceFor(intent),
          border: Border.all(color: foreground),
          borderRadius: const BorderRadius.all(Radius.circular(6)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon case final icon?) ...[
                IconTheme(
                  data: IconThemeData(color: foreground),
                  child: icon,
                ),
                const SizedBox(width: 12),
              ],
              Expanded(child: content),
            ],
          ),
        ),
      ),
    );
  }
}
