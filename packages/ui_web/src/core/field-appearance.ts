/**
 * The visual chrome drawn around an input control.
 *
 * `ghost` drops the resting fill and border so an enclosing surface can own the
 * frame, while the control still paints hover, focus, and invalid emphasis
 * itself. Metrics are identical to `solid`, so switching appearance never
 * shifts layout.
 *
 * This is deliberately narrower than the action appearance a button takes: a
 * field's solid form is already outlined, so an `outline` step would be
 * indistinguishable from the default.
 */
export type TRFieldAppearance = 'solid' | 'ghost';
