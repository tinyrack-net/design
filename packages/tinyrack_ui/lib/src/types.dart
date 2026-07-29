/// The semantic purpose of a Tinyrack control or status.
enum TRIntent { neutral, primary, info, success, warning, danger }

/// The visual emphasis of an action.
enum TRAppearance { solid, outline, ghost }

/// The shared control size scale.
enum TRUiSize { sm, md, lg }

/// Named typography roles shared with Tinyrack web components.
enum TRTextStyle {
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
