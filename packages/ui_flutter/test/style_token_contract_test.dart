import 'dart:io';

import 'package:analyzer/dart/analysis/utilities.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';
import 'package:analyzer/source/line_info.dart';
import 'package:flutter_test/flutter_test.dart';

final class StyleTokenViolation {
  const StyleTokenViolation(this.path, this.line, this.source);

  final int line;
  final String path;
  final String source;

  @override
  String toString() => '$path:$line: literal design value: $source';
}

const _styleConstructors = <String>{
  'AnimatedOpacity',
  'BorderRadius',
  'BorderSide',
  'BoxConstraints',
  'BoxShadow',
  'Color',
  'Duration',
  'EdgeInsets',
  'Offset',
  'Opacity',
  'Padding',
  'Radius',
  'ShapeDecoration',
  'Size',
  'SizedBox',
  'TextStyle',
};

const _styleArgumentNames = <String>{
  'blurRadius',
  'borderRadius',
  'borderWidth',
  'bottom',
  'closeDelay',
  'color',
  'dimension',
  'duration',
  'elevation',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'height',
  'horizontal',
  'left',
  'letterSpacing',
  'margin',
  'maxHeight',
  'maxWidth',
  'milliseconds',
  'minHeight',
  'minWidth',
  'offset',
  'opacity',
  'openDelay',
  'padding',
  'right',
  'seconds',
  'spreadRadius',
  'strokeWidth',
  'thickness',
  'top',
  'turns',
  'vertical',
  'width',
};

final _numberPattern = RegExp(
  r'(?<![A-Za-z0-9_])(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?)(?![A-Za-z0-9_])',
);
final _packagedFontPattern = RegExp("['\\\"]packages/tinyrack_ui/");

bool _isTokenBacked(String source) =>
    source.contains('TRGenerated') ||
    source.contains('TRControlMetrics') ||
    source.contains('TRLayerStyles') ||
    source.contains('TRTheme');

bool _isLiteralDesignExpression(String source) {
  if (_isTokenBacked(source)) return false;
  // Day-scale durations are lifecycle sentinels, never visual motion timing.
  if (RegExp(r'Duration\s*\(\s*days\s*:').hasMatch(source)) return false;
  if (_packagedFontPattern.hasMatch(source)) return true;
  final numbers = _numberPattern.allMatches(source).toList();
  if (numbers.isEmpty) return false;
  return numbers.any((match) {
    final literal = match.group(0)!;
    if (literal.startsWith('0x')) return true;
    final value = double.parse(literal);
    if (value <= 1) return false;
    final before = source.substring(0, match.start).trimRight();
    final after = source.substring(match.end).trimLeft();
    final adjacentOperator =
        '${before.isEmpty ? '' : before[before.length - 1]}'
        '${after.isEmpty ? '' : after[0]}';
    return !adjacentOperator.contains('*') && !adjacentOperator.contains('/');
  });
}

final class _StyleVisitor extends RecursiveAstVisitor<void> {
  _StyleVisitor(this.path, this.lineInfo);

  final LineInfo lineInfo;
  final String path;
  final violations = <StyleTokenViolation>[];
  final _seenOffsets = <int>{};

  void _check(Expression expression) {
    if (!_isLiteralDesignExpression(expression.toSource())) return;
    if (!_seenOffsets.add(expression.offset)) return;
    violations.add(
      StyleTokenViolation(
        path,
        lineInfo.getLocation(expression.offset).lineNumber,
        expression.toSource(),
      ),
    );
  }

  @override
  void visitIntegerLiteral(IntegerLiteral node) {
    final source = node.toSource();
    if (source.startsWith('0x') && _seenOffsets.add(node.offset)) {
      violations.add(
        StyleTokenViolation(
          path,
          lineInfo.getLocation(node.offset).lineNumber,
          source,
        ),
      );
    }
    super.visitIntegerLiteral(node);
  }

  @override
  void visitInstanceCreationExpression(InstanceCreationExpression node) {
    final constructor = node.constructorName.type.toSource();
    if (_styleConstructors.any(
      (name) => constructor == name || constructor.endsWith('.$name'),
    )) {
      for (final argument in node.argumentList.arguments) {
        if (constructor.endsWith('Duration') &&
            argument is NamedArgument &&
            argument.name.lexeme == 'days') {
          continue;
        }
        _check(
          argument is NamedArgument
              ? argument.argumentExpression
              : argument as Expression,
        );
      }
    }
    super.visitInstanceCreationExpression(node);
  }

  @override
  void visitMethodInvocation(MethodInvocation node) {
    final constructor = node.target?.toSource() ?? node.methodName.name;
    if (_styleConstructors.contains(constructor)) {
      for (final argument in node.argumentList.arguments) {
        _check(
          argument is NamedArgument
              ? argument.argumentExpression
              : argument as Expression,
        );
      }
    }
    super.visitMethodInvocation(node);
  }

  @override
  void visitNamedArgument(NamedArgument node) {
    if (_styleArgumentNames.contains(node.name.lexeme)) {
      _check(node.argumentExpression);
    }
    super.visitNamedArgument(node);
  }
}

List<StyleTokenViolation> auditDartStyleSource(
  String source, {
  String path = '<dart>',
}) {
  final parsed = parseString(content: source, path: path);
  final visitor = _StyleVisitor(path, LineInfo.fromContent(source));
  parsed.unit.accept(visitor);
  return visitor.violations;
}

Iterable<File> _dartFiles(Directory directory) sync* {
  for (final entity in directory.listSync()) {
    if (entity is Directory) {
      if (entity.path.endsWith('${Platform.pathSeparator}generated')) continue;
      yield* _dartFiles(entity);
    } else if (entity is File && entity.path.endsWith('.dart')) {
      yield entity;
    }
  }
}

List<StyleTokenViolation> auditFlutterProductSources() {
  final root = Directory('lib/src');
  return [
    ..._dartFiles(Directory('${root.path}/components')),
    ..._dartFiles(Directory('${root.path}/internal')),
    File('${root.path}/theme.dart'),
  ].expand((file) {
    final source = file.readAsStringSync();
    return auditDartStyleSource(source, path: file.path);
  }).toList();
}

void main() {
  test('rejects literal Flutter design values', () {
    for (final expression in [
      'EdgeInsets.all(8)',
      'const SizedBox(width: 16)',
      'const TextStyle(fontSize: 18)',
      'const Duration(milliseconds: 300)',
      'const Color(0xff123456)',
    ]) {
      expect(
        auditDartStyleSource('final value = $expression;'),
        isNotEmpty,
        reason: expression,
      );
    }
  });

  test('accepts tokens and structural Flutter values', () {
    expect(
      auditDartStyleSource('''
        final inset = EdgeInsets.all(TRGeneratedSpacing.md);
        final origin = Offset.zero;
        final direction = const Offset(-1, 0);
        final opacity = Opacity(opacity: 1, child: child);
        final radius = Radius.circular(size.height / 2);
      '''),
      isEmpty,
    );
  });

  test('keeps all shipped Flutter product styling token-backed', () {
    expect(auditFlutterProductSources(), isEmpty);
  });
}
