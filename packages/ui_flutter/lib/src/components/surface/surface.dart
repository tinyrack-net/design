import 'package:material_ui/material_ui.dart';

import '../../theme.dart';

/// An opaque themed background for a page or a routed content region.
///
/// Layout widgets such as panes and navigators are transparent, so a route that
/// is transformed independently of its parent — an Android predictive Back
/// gesture scaling the outgoing page, for example — composites over whatever
/// sits beneath it. Wrapping the region in [TRSurface] gives it a background of
/// its own that travels with the transform.
///
/// The fill takes the size of [child]; place it around a child that already
/// expands to the region it should cover.
class TRSurface extends StatelessWidget {
  const TRSurface({required this.child, super.key});

  /// Content painted over the surface.
  final Widget child;

  @override
  Widget build(BuildContext context) =>
      ColoredBox(color: context.tinyrackTheme.surface, child: child);
}
