/// The semantic purpose of a Tinyrack control or status.
enum TRIntent { neutral, primary, info, success, warning, danger }

/// The visual emphasis of an action.
enum TRAppearance { solid, outline, ghost }

/// The shared control size scale.
enum TRUiSize { sm, md, lg }

/// The semantic variants supported by alerts and badges.
enum TRStatusVariant { neutral, info, success, warning, danger }

/// The visual treatment of a card surface.
enum TRCardVariant { defaultVariant, outlined, elevated }

/// The inset spacing of a card surface.
enum TRCardPadding { none, sm, md, lg }

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
