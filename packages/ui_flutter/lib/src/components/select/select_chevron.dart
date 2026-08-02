part of 'select_widget.dart';

class _TRSelectChevron extends StatelessWidget {
  const _TRSelectChevron({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) => SizedBox.square(
    dimension: TRGeneratedSpacing.lg,
    child: CustomPaint(painter: _TRSelectChevronPainter(color)),
  );
}

class _TRSelectChevronPainter extends CustomPainter {
  const _TRSelectChevronPainter(this.color);

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..strokeWidth = 4 / 3
      ..style = PaintingStyle.stroke;
    final path = Path()
      ..moveTo(4, 6)
      ..lineTo(8, 10)
      ..lineTo(12, 6);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_TRSelectChevronPainter oldDelegate) =>
      oldDelegate.color != color;
}
