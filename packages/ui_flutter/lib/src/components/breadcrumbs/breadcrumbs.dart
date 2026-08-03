import 'package:flutter/material.dart';

import '../../generated/tokens.g.dart';
import '../../normal_line.dart';
import '../../theme.dart';
import '../../types.dart';
import '../link/link.dart';

/// A single entry rendered within [TRBreadcrumbs].
class TRBreadcrumbsItem {
  const TRBreadcrumbsItem({required this.label, this.onTap});

  final String label;
  final VoidCallback? onTap;
}

// @tinyrack-preview breadcrumbs
/// A trail of ancestor pages leading to the current page.
class TRBreadcrumbs extends StatelessWidget {
  const TRBreadcrumbs({
    required this.items,
    this.label = 'Breadcrumb',
    this.separator,
    super.key,
  });

  final List<TRBreadcrumbsItem> items;
  final String label;
  final Widget? separator;

  @override
  Widget build(BuildContext context) {
    if (items.isEmpty) return const SizedBox.shrink();
    final colors = context.tinyrackTheme;
    final lastIndex = items.length - 1;
    // The web trail inherits `line-height: normal`, which Chromium snaps to
    // whole pixels per font size. Item labels are text-sm; the separator
    // keeps the surrounding text-md size.
    final textStyle = TextStyle(
      fontFamily: TRGeneratedFontFamilies.body,
      fontSize: TRGeneratedTypographySizes.md,
      height:
          TRGeneratedFlutterRendering.normalLineMd /
          TRGeneratedTypographySizes.md,
    );
    final cjk = RegExp(r'[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]');
    final japanese = Localizations.localeOf(context).languageCode == 'ja';
    TextStyle itemStyle(String label) => TextStyle(
      fontSize: TRGeneratedTypographySizes.sm,
      letterSpacing: cjk.hasMatch(label)
          ? japanese
                ? null
                : -TRGeneratedBorders.defaultWidth /
                      (TRGeneratedSpacing.size3xs +
                          TRGeneratedBorders.defaultWidth)
          : -TRGeneratedBorders.defaultWidth / TRGeneratedSpacing.md,
      height: normalLineHeightFor(
        label,
        TRGeneratedTypographySizes.sm,
        TRGeneratedFlutterRendering.normalLineSm,
      ),
    );

    return Semantics(
      container: true,
      label: label,
      child: DefaultTextStyle.merge(
        style: textStyle,
        child: Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          runSpacing: TRGeneratedSpacing.xs,
          spacing: TRGeneratedSpacing.xs,
          children: [
            for (var index = 0; index < items.length; index += 1) ...[
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                spacing: TRGeneratedSpacing.xs,
                children: [
                  items[index].onTap == null
                      ? Semantics(
                          child: Text(
                            items[index].label,
                            style: itemStyle(items[index].label).copyWith(
                              color: colors.textMuted,
                              fontWeight: TRGeneratedFontWeights.medium,
                            ),
                          ),
                        )
                      : TRLink(
                          onTap: items[index].onTap,
                          underline: TRLinkUnderline.hover,
                          child: Text(
                            items[index].label,
                            style: itemStyle(items[index].label),
                          ),
                        ),
                  if (index != lastIndex)
                    Text(
                      '/',
                      semanticsLabel: '',
                      style: TextStyle(color: colors.textMuted),
                    ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
