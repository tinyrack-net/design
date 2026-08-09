/// The semantic purpose of a Tinyrack control or status.
enum TRIntent { neutral, primary, info, success, warning, danger }

/// The visual emphasis of an action.
enum TRAppearance { solid, outline, ghost }

/// The shared control size scale.
enum TRUiSize { sm, md, lg }

/// Controls how [TRTabs] distributes the width of its tab items.
enum TRTabsWidth { fill, fixed }

/// Logical placement of an anchored Tinyrack layer.
///
/// `start` and `end` follow the ambient [TextDirection] when they describe the
/// horizontal edge of a top or bottom placement.
enum TRLayerPlacement {
  topStart,
  topCenter,
  topEnd,
  rightStart,
  rightCenter,
  rightEnd,
  bottomStart,
  bottomCenter,
  bottomEnd,
  leftStart,
  leftCenter,
  leftEnd,
}

/// The semantic variants supported by alerts and badges.
enum TRStatusVariant { neutral, info, success, warning, danger }

/// The visual treatment of a card surface.
enum TRCardVariant { defaultVariant, outlined, elevated }

/// The inset spacing of a card surface.
enum TRCardPadding { none, sm, md, lg }

/// The visual chrome drawn around an input control.
///
/// [ghost] drops the resting fill and border so an enclosing surface can own
/// the frame, while the control still paints hover, focus, and invalid
/// emphasis itself. [plain] goes further and paints nothing but invalid
/// emphasis, for a field placed inside a surface that frames the whole group
/// and shows the group's focus itself; a plain field ringed by its own focus
/// as well would show two rings for one caret. Metrics are identical to
/// [solid], so switching appearance never shifts layout.
enum TRFieldAppearance { solid, ghost, plain }

/// The semantic color of a progress spinner.
enum TRSpinnerVariant { current, muted, primary, danger }

/// Named typography variants shared with Tinyrack web components.
enum TRTextVariant {
  caption,
  label,
  body,
  bodySm,
  code,
  headingSm,
  headingMd,
  headingLg,
  display,
  displayLg,
}

/// Semantic text colors shared with Tinyrack web components.
enum TRTextColor {
  defaultColor,
  muted,
  placeholder,
  inverse,
  primary,
  info,
  success,
  warning,
  danger,
}

/// Logical text alignment shared with Tinyrack web components.
enum TRTextAlign { start, center, end }

/// Named typography weights shared with Tinyrack web components.
enum TRTextWeight { regular, medium, heading, bold, strong }

/// The axis a separator divides content along.
enum TRSeparatorOrientation { horizontal, vertical }

/// The visual emphasis of a separator line.
enum TRSeparatorVariant { defaultVariant, muted }

/// The placeholder shape a skeleton renders.
enum TRSkeletonShape { text, rectangle, circle }

/// The semantic emphasis of a link's foreground color.
enum TRLinkVariant { defaultVariant, muted, danger }

/// When a link's underline is visible.
enum TRLinkUnderline { always, hover, none }
