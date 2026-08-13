import 'package:material_ui/material_ui.dart';

import '../../theme.dart';
import '../../tokens.dart';
import '../../types.dart';
import '../../ui_density.dart';
import '../separator/separator.dart';

/// Shared title, description, and action chrome for one application pane.
class TRPaneHeader extends StatelessWidget {
  const TRPaneHeader({
    required this.title,
    this.description,
    this.leading,
    this.actions = const <Widget>[],
    this.divider = true,
    super.key,
  });

  /// The pane's primary heading.
  final Widget title;

  /// Optional supporting text rendered below [title].
  final Widget? description;

  /// Optional content before the title group, such as a Back action.
  final Widget? leading;

  /// Actions associated with the entire pane.
  ///
  /// Actions wrap onto additional rows when they do not fit the pane width.
  final List<Widget> actions;

  /// Whether to separate the header from the pane body.
  final bool divider;

  @override
  Widget build(BuildContext context) {
    final comfortable = TRUiDensityScope.of(context) == TRUiDensity.comfortable;
    final verticalInset = comfortable ? TRSpacing.extraLarge : TRSpacing.large;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(
            TRSpacing.extraLarge,
            verticalInset,
            TRSpacing.extraLarge,
            verticalInset,
          ),
          child: Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: TRSpacing.extraLarge,
            runSpacing: TRSpacing.medium,
            children: <Widget>[
              _TRPaneHeaderIdentity(
                title: title,
                description: description,
                leading: leading,
              ),
              if (actions.isNotEmpty)
                Wrap(
                  spacing: TRSpacing.small,
                  runSpacing: TRSpacing.small,
                  children: actions,
                ),
            ],
          ),
        ),
        if (divider)
          const TRSeparator(
            orientation: TRSeparatorOrientation.horizontal,
            variant: TRSeparatorVariant.muted,
          ),
      ],
    );
  }
}

class _TRPaneHeaderIdentity extends StatelessWidget {
  const _TRPaneHeaderIdentity({
    required this.title,
    required this.description,
    required this.leading,
  });

  final Widget title;
  final Widget? description;
  final Widget? leading;

  @override
  Widget build(BuildContext context) {
    final content = Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Semantics(
          header: true,
          child: DefaultTextStyle.merge(
            style: TRTypography.resolve(context, TRTextVariant.headingSm),
            child: title,
          ),
        ),
        if (description case final description?) ...<Widget>[
          const SizedBox(height: TRSpacing.extraSmall),
          DefaultTextStyle.merge(
            style: TRTypography.resolve(
              context,
              TRTextVariant.bodySm,
            ).copyWith(color: context.tinyrackTheme.textMuted),
            child: description,
          ),
        ],
      ],
    );
    final leading = this.leading;
    if (leading == null) return content;
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        leading,
        const SizedBox(width: TRSpacing.medium),
        Flexible(child: content),
      ],
    );
  }
}
