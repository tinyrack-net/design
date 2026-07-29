import 'package:flutter/material.dart';

import '../types.dart';

// @tinyrack-preview text
/// Text rendered with a named Tinyrack typography role.
class TRText extends StatelessWidget {
  const TRText(
    this.data, {
    this.role = TRTextStyle.body,
    this.color,
    this.maxLines,
    this.overflow,
    this.textAlign,
    super.key,
  });

  final String data;
  final TRTextStyle role;
  final Color? color;
  final int? maxLines;
  final TextOverflow? overflow;
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).textTheme;
    final style = switch (role) {
      TRTextStyle.caption => theme.bodySmall,
      TRTextStyle.label => theme.labelSmall,
      TRTextStyle.body => theme.bodyMedium,
      TRTextStyle.bodySm => theme.bodySmall,
      TRTextStyle.code => theme.bodySmall?.copyWith(
        fontFamily: 'packages/tinyrack_ui/IBMPlexMono',
      ),
      TRTextStyle.headingSm => theme.titleSmall,
      TRTextStyle.headingMd => theme.titleMedium,
      TRTextStyle.headingLg => theme.titleLarge,
      TRTextStyle.display => theme.displayMedium,
      TRTextStyle.displayLg => theme.displayLarge,
    };
    return Text(
      data,
      maxLines: maxLines,
      overflow: overflow,
      style: style?.copyWith(color: color),
      textAlign: textAlign,
    );
  }
}
