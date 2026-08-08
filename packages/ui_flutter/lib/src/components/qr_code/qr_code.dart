import 'package:flutter/material.dart';
import 'package:qr/qr.dart';

import '../../generated/tokens.g.dart';
import '../../theme.dart';
import '../../types.dart';

// @tinyrack-preview qr-code
/// Accessible, token-styled QR image for short-lived links and identifiers.
class TRQrCode extends StatelessWidget {
  /// Creates a QR image whose contents are also described by [semanticLabel].
  const TRQrCode({
    required this.data,
    required this.semanticLabel,
    this.uiSize = TRUiSize.md,
    super.key,
  }) : assert(data.length > 0, 'data must not be empty'),
       assert(semanticLabel.length > 0, 'semanticLabel must not be empty');

  /// Value encoded in the QR modules.
  final String data;

  /// Localized assistive description; secret data is never read aloud.
  final String semanticLabel;

  /// Token-backed physical size variant.
  final TRUiSize uiSize;

  @override
  Widget build(BuildContext context) {
    final colors = context.tinyrackTheme;
    final highContrast = MediaQuery.highContrastOf(context);
    final size = switch (uiSize) {
      TRUiSize.sm => TRGeneratedMeasurements.measureSm,
      TRUiSize.md => TRGeneratedMeasurements.measureMd,
      TRUiSize.lg => TRGeneratedMeasurements.measureLg,
    };
    final image = QrImage(
      QrCode.fromData(data: data, errorCorrectLevel: QrErrorCorrectLevel.M),
    );
    return Semantics(
      image: true,
      label: semanticLabel,
      child: ExcludeSemantics(
        child: SizedBox.square(
          dimension: size,
          child: CustomPaint(
            painter: _TRQrPainter(
              image: image,
              foreground: colors.text,
              background: colors.surface,
              border: highContrast ? colors.borderStrong : colors.border,
              borderWidth: highContrast
                  ? TRGeneratedBorders.strongWidth
                  : TRGeneratedBorders.defaultWidth,
            ),
          ),
        ),
      ),
    );
  }
}

final class _TRQrPainter extends CustomPainter {
  const _TRQrPainter({
    required this.image,
    required this.foreground,
    required this.background,
    required this.border,
    required this.borderWidth,
  });

  static const int _quietModules = 4;

  final QrImage image;
  final Color foreground;
  final Color background;
  final Color border;
  final double borderWidth;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..color = background);
    final totalModules = image.moduleCount + _quietModules * 2;
    final moduleExtent = size.shortestSide / totalModules;
    final origin = Offset(
      (size.width - moduleExtent * totalModules) / 2,
      (size.height - moduleExtent * totalModules) / 2,
    );
    final modules = Paint()
      ..color = foreground
      ..isAntiAlias = false;
    for (var row = 0; row < image.moduleCount; row += 1) {
      for (var column = 0; column < image.moduleCount; column += 1) {
        if (!image.isDark(row, column)) continue;
        final left = origin.dx + (column + _quietModules) * moduleExtent;
        final top = origin.dy + (row + _quietModules) * moduleExtent;
        canvas.drawRect(
          Rect.fromLTWH(left, top, moduleExtent, moduleExtent),
          modules,
        );
      }
    }
    final inset = borderWidth / 2;
    canvas.drawRect(
      Rect.fromLTWH(
        inset,
        inset,
        size.width - borderWidth,
        size.height - borderWidth,
      ),
      Paint()
        ..color = border
        ..style = PaintingStyle.stroke
        ..strokeWidth = borderWidth,
    );
  }

  @override
  bool shouldRepaint(_TRQrPainter oldDelegate) =>
      oldDelegate.image != image ||
      oldDelegate.foreground != foreground ||
      oldDelegate.background != background ||
      oldDelegate.border != border ||
      oldDelegate.borderWidth != borderWidth;
}
