import 'dart:convert';
import 'dart:io';

import 'package:analyzer/dart/analysis/analysis_context_collection.dart';
import 'package:analyzer/dart/analysis/results.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';
import 'package:analyzer/error/error.dart';
import 'package:analyzer/source/line_info.dart';

enum TinyrackCheckFormat { github, json, pretty }

final class TinyrackCheckViolation {
  const TinyrackCheckViolation({
    required this.column,
    required this.line,
    required this.message,
    required this.path,
    required this.ruleId,
    this.replacement,
  });

  final int column;
  final int line;
  final String message;
  final String path;
  final String? replacement;
  final String ruleId;

  Map<String, Object?> toJson() => <String, Object?>{
    'column': column,
    'line': line,
    'message': message,
    'path': path,
    'replacement': ?replacement,
    'ruleId': ruleId,
  };

  @override
  String toString() =>
      '$path:$line:$column $ruleId $message'
      '${replacement == null ? '' : ' $replacement'}';
}

final class TinyrackCheckResult {
  const TinyrackCheckResult({
    required this.checkedFiles,
    required this.violations,
  });

  static const packageVersion = '0.52.0';

  final int checkedFiles;
  final List<TinyrackCheckViolation> violations;

  Map<String, Object> toJson() => <String, Object>{
    'checkedFiles': checkedFiles,
    'packageVersion': packageVersion,
    'platform': 'flutter',
    'schemaVersion': 1,
    'violations': violations.map((violation) => violation.toJson()).toList(),
  };
}

final class TinyrackCheckConfig {
  const TinyrackCheckConfig({this.exclude, this.include});

  factory TinyrackCheckConfig.fromJson(Map<String, Object?> json) {
    List<String>? strings(String key) {
      final value = json[key];
      if (value == null) return null;
      if (value is! List<Object?> || value.any((item) => item is! String)) {
        throw FormatException(
          'tinyrack.check.json $key must be an array of paths.',
        );
      }
      return value.cast<String>();
    }

    return TinyrackCheckConfig(
      exclude: strings('exclude'),
      include: strings('include'),
    );
  }

  final List<String>? exclude;
  final List<String>? include;
}

final class TinyrackCheckOptions {
  const TinyrackCheckOptions({this.configPath, this.root = '.'});

  final String? configPath;
  final String root;
}

const _defaultExcludes = <String>[
  '**/*.g.dart',
  '**/*.freezed.dart',
  '**/*.mocks.dart',
  '**/gen/**',
  '**/generated/**',
  '**/build/**',
  '**/.dart_tool/**',
];
const _styleConstructors = <String>{
  'AnimatedOpacity',
  'BorderRadius',
  'BorderSide',
  'BoxConstraints',
  'BoxShadow',
  'Color',
  'EdgeInsets',
  'Opacity',
  'Padding',
  'Radius',
  'ShapeDecoration',
  'SizedBox',
  'TextStyle',
};
const _styleArguments = <String>{
  'blurRadius',
  'borderRadius',
  'borderWidth',
  'bottom',
  'closeDelay',
  'color',
  'dimension',
  'duration',
  'elevation',
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
  'vertical',
  'width',
};
const _materialComponents = <String, String>{
  'AlertDialog': 'TRAlertDialog',
  'AppBar': 'TRAppShell',
  'Card': 'TRCard',
  'Checkbox': 'TRCheckbox',
  'CircularProgressIndicator': 'TRSpinner or TRProgress',
  'Dialog': 'TRDialog',
  'Divider': 'TRSeparator',
  'Drawer': 'TRDrawer',
  'DropdownButton': 'TRSelect',
  'ElevatedButton': 'TRButton',
  'ExpansionTile': 'TRAccordion',
  'FilledButton': 'TRButton',
  'IconButton': 'TRIconButton',
  'LinearProgressIndicator': 'TRProgress',
  'ListTile': 'a Tinyrack list component or token-backed product composite',
  'OutlinedButton': 'TRButton',
  'PopupMenuButton': 'TRMenu',
  'Radio': 'TRRadio',
  'Scaffold': 'TRAppShell',
  'Scrollbar': 'TRScrollArea',
  'SegmentedButton': 'TRToggleGroup',
  'Switch': 'TRSwitch',
  'TabBar': 'TRTabs',
  'TextButton': 'TRButton',
  'TextField': 'TRTextField',
  'TextFormField': 'TRTextField with TRForm',
  'Tooltip': 'TRTooltip',
  'VerticalDivider': 'TRSeparator',
};
final _number = RegExp(
  r'(?<![A-Za-z0-9_])(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?)(?![A-Za-z0-9_])',
);
final _tokenReference = RegExp(
  r'\b(?:TRSpacing|TRTypography|TRRadii|TRMotion|TRShadows|TRMeasurements|TRControlMetrics|TRBreakpoints|TROpacity|TinyrackTheme|tinyrackTheme)\b',
);

String _pathKey(String path) => path.replaceAll('\\', '/');

RegExp _glob(String pattern) {
  final escaped = RegExp.escape(pattern)
      .replaceAll(r'\*\*/', '(?:.*/)?')
      .replaceAll(r'\*\*', '.*')
      .replaceAll(r'\*', '[^/]*');
  return RegExp('^$escaped\$');
}

bool _matches(String path, List<String> patterns) =>
    patterns.any((pattern) => _glob(pattern).hasMatch(path));

bool _ignored(String source, int line, String ruleId) {
  final lines = source.split('\n');
  if (line < 2) return false;
  final match = RegExp(
    r'tinyrack-check-ignore-next-line\s+([\w/-]+)\s+--\s+(.\S.*?)\s*$',
  ).firstMatch(lines[line - 2]);
  return match?.group(1) == ruleId;
}

bool _tokenBacked(
  String source,
  Set<String> aliases, {
  required bool publicTokens,
}) =>
    (publicTokens && _tokenReference.hasMatch(source)) ||
    aliases.any(
      (alias) => RegExp('\\b${RegExp.escape(alias)}\\b').hasMatch(source),
    );

bool _literalDesignExpression(
  String source,
  Set<String> aliases,
  Map<String, String> variables, [
  Set<String>? visited,
  bool publicTokens = false,
]) {
  if (!publicTokens && _tokenReference.hasMatch(source)) return true;
  if (_tokenBacked(source, aliases, publicTokens: publicTokens)) return false;
  final identifier = RegExp(r'^\w+$').firstMatch(source)?.group(0);
  final initializer = identifier == null ? null : variables[identifier];
  if (initializer != null) {
    final seen = visited ?? <String>{};
    if (!seen.add(identifier!)) return true;
    return _literalDesignExpression(
      initializer,
      aliases,
      variables,
      seen,
      publicTokens,
    );
  }
  if (source.contains('double.infinity') || source.contains('.zero')) {
    return false;
  }
  if (RegExp(r'Duration\s*\(\s*days\s*:').hasMatch(source)) return false;
  final matches = _number.allMatches(source);
  for (final match in matches) {
    final literal = match.group(0)!;
    if (literal.startsWith('0x')) return true;
    final value = double.parse(literal);
    if (value <= 1) continue;
    final before = source.substring(0, match.start).trimRight();
    final after = source.substring(match.end).trimLeft();
    final adjacent =
        '${before.isEmpty ? '' : before[before.length - 1]}'
        '${after.isEmpty ? '' : after[0]}';
    if (!adjacent.contains('*') && !adjacent.contains('/')) return true;
  }
  return false;
}

final class _AliasVisitor extends RecursiveAstVisitor<void> {
  _AliasVisitor(this.aliases, this.publicTokens);

  final Set<String> aliases;
  final bool publicTokens;
  final Map<String, String> candidates = <String, String>{};

  @override
  void visitVariableDeclaration(VariableDeclaration node) {
    final initializer = node.initializer;
    if (initializer != null) {
      candidates[node.name.lexeme] = initializer.toSource();
    }
    super.visitVariableDeclaration(node);
  }

  void resolve() {
    var changed = true;
    while (changed) {
      changed = false;
      for (final entry in candidates.entries) {
        if (aliases.contains(entry.key) ||
            !_tokenBacked(entry.value, aliases, publicTokens: publicTokens)) {
          continue;
        }
        aliases.add(entry.key);
        changed = true;
      }
    }
  }
}

final class _CheckVisitor extends RecursiveAstVisitor<void> {
  _CheckVisitor({
    required this.aliases,
    required this.lineInfo,
    required this.path,
    required this.publicTokens,
    required this.source,
    required this.variables,
  });

  final Set<String> aliases;
  final LineInfo lineInfo;
  final String path;
  final bool publicTokens;
  final String source;
  final Map<String, String> variables;
  final violations = <TinyrackCheckViolation>[];
  final _seen = <String>{};

  void _add(AstNode node, String ruleId, String message, String replacement) {
    final location = lineInfo.getLocation(node.offset);
    final key = '$ruleId:${node.offset}';
    if (!_seen.add(key) || _ignored(source, location.lineNumber, ruleId)) {
      return;
    }
    violations.add(
      TinyrackCheckViolation(
        column: location.columnNumber,
        line: location.lineNumber,
        message: message,
        path: path,
        replacement: replacement,
        ruleId: ruleId,
      ),
    );
  }

  void _checkExpression(AstNode expression) {
    if (expression is InstanceCreationExpression &&
        _styleConstructors.contains(
          expression.constructorName.type.toSource(),
        )) {
      return;
    }
    final value = expression.toSource();
    if (!(_literalDesignExpression(
      value,
      aliases,
      variables,
      null,
      publicTokens,
    ))) {
      return;
    }
    _add(
      expression,
      'tokens/no-literal',
      'Visual expression is not backed by a public Tinyrack token: $value',
      'Use a public TR token or an expression derived from one.',
    );
  }

  void _checkArgument(AstNode argument) {
    final source = argument.toSource();
    final name = RegExp(r'^\s*([A-Za-z_]\w*)\s*:').firstMatch(source)?.group(1);
    if (name == null || _styleArguments.contains(name)) {
      _checkExpression(argument);
    }
  }

  @override
  void visitImportDirective(ImportDirective node) {
    final uri = node.uri.stringValue ?? '';
    if (uri.startsWith('package:tinyrack_ui/src/')) {
      _add(
        node,
        'imports/no-private-tinyrack',
        'Private Tinyrack import: $uri',
        "Import 'package:tinyrack_ui/tinyrack_ui.dart'.",
      );
    }
    super.visitImportDirective(node);
  }

  @override
  void visitInstanceCreationExpression(InstanceCreationExpression node) {
    final constructor = node.constructorName.type.toSource();
    final replacement = _materialComponents[constructor];
    if (replacement != null) {
      _add(
        node,
        'components/no-material-equivalent',
        '$constructor has a public Tinyrack equivalent.',
        'Use $replacement.',
      );
    }
    if (_styleConstructors.contains(constructor)) {
      for (final argument in node.argumentList.arguments) {
        _checkArgument(argument);
      }
    }
    super.visitInstanceCreationExpression(node);
  }

  @override
  void visitMethodInvocation(MethodInvocation node) {
    final name = node.methodName.name;
    final replacement =
        _materialComponents[name] ??
        switch (name) {
          'showDialog' => 'TRDialog',
          'showMenu' => 'TRMenu',
          'showModalBottomSheet' => 'TRDrawer',
          _ => null,
        };
    if (replacement != null) {
      _add(
        node,
        'components/no-material-equivalent',
        '$name has a public Tinyrack equivalent.',
        'Use $replacement.',
      );
    }
    final target = node.target?.toSource() ?? name;
    if (_styleConstructors.contains(target)) {
      for (final argument in node.argumentList.arguments) {
        _checkArgument(argument);
      }
    }
    super.visitMethodInvocation(node);
  }
}

TinyrackCheckConfig _config(Directory root, String? configPath) {
  final configured = configPath == null
      ? '${root.path}${Platform.pathSeparator}tinyrack.check.json'
      : File(configPath).isAbsolute
      ? configPath
      : '${root.path}${Platform.pathSeparator}$configPath';
  final file = File(configured);
  if (!file.existsSync()) return const TinyrackCheckConfig();
  final value = jsonDecode(file.readAsStringSync());
  if (value is! Map<String, Object?>) {
    throw const FormatException('tinyrack.check.json must contain an object.');
  }
  return TinyrackCheckConfig.fromJson(value);
}

Iterable<File> _sourceFiles(Directory root, TinyrackCheckConfig config) sync* {
  final includes = config.include ?? const <String>['lib/**'];
  final excludes = <String>[..._defaultExcludes, ...?config.exclude];
  for (final entity in root.listSync(recursive: true)) {
    if (entity is! File || !entity.path.endsWith('.dart')) continue;
    final key = _pathKey(entity.path.substring(root.path.length + 1));
    if (_matches(key, includes) && !_matches(key, excludes)) yield entity;
  }
}

String? _dartSdkPath() {
  final flutterRoot = Platform.environment['FLUTTER_ROOT'];
  final candidates = <String?>[
    Platform.environment['DART_SDK'],
    if (flutterRoot != null)
      '$flutterRoot${Platform.pathSeparator}bin${Platform.pathSeparator}'
          'cache${Platform.pathSeparator}dart-sdk',
    File(
      File(Platform.resolvedExecutable).resolveSymbolicLinksSync(),
    ).parent.parent.path,
  ];
  for (final candidate in candidates) {
    if (candidate != null &&
        File(
          '$candidate${Platform.pathSeparator}lib${Platform.pathSeparator}'
          '_internal${Platform.pathSeparator}allowed_experiments.json',
        ).existsSync()) {
      return candidate;
    }
  }
  return null;
}

Future<TinyrackCheckResult> checkTinyrackProject([
  TinyrackCheckOptions options = const TinyrackCheckOptions(),
]) async {
  final requestedRoot = Directory(options.root).absolute;
  if (!requestedRoot.existsSync()) {
    throw FileSystemException(
      'Project root does not exist',
      requestedRoot.path,
    );
  }
  final root = Directory(requestedRoot.resolveSymbolicLinksSync());
  final files = _sourceFiles(root, _config(root, options.configPath)).toList()
    ..sort((left, right) => left.path.compareTo(right.path));
  final contexts = AnalysisContextCollection(
    includedPaths: <String>[root.path],
    sdkPath: _dartSdkPath(),
  );
  final violations = <TinyrackCheckViolation>[];
  final allSource = StringBuffer();
  try {
    for (final file in files) {
      final source = file.readAsStringSync();
      allSource.writeln(source);
      final path = _pathKey(file.path.substring(root.path.length + 1));
      final resolved = await contexts
          .contextFor(file.path)
          .currentSession
          .getResolvedUnit(file.path);
      if (resolved is! ResolvedUnitResult) {
        throw FormatException('Could not resolve $path.');
      }
      final errors = resolved.diagnostics.where(
        (diagnostic) =>
            diagnostic.diagnosticCode.type == DiagnosticType.SYNTACTIC_ERROR,
      );
      if (errors.isNotEmpty) {
        final first = errors.first;
        final location = resolved.lineInfo.getLocation(first.offset);
        throw FormatException(
          '$path:${location.lineNumber}:${location.columnNumber} '
          '${first.message}',
        );
      }
      final publicTokens = resolved.unit.directives
          .whereType<ImportDirective>()
          .any(
            (directive) =>
                directive.uri.stringValue ==
                'package:tinyrack_ui/tinyrack_ui.dart',
          );
      final aliases = <String>{};
      final aliasVisitor = _AliasVisitor(aliases, publicTokens);
      resolved.unit.accept(aliasVisitor);
      aliasVisitor.resolve();
      final visitor = _CheckVisitor(
        aliases: aliases,
        lineInfo: resolved.lineInfo,
        path: path,
        publicTokens: publicTokens,
        source: source,
        variables: aliasVisitor.candidates,
      );
      resolved.unit.accept(visitor);
      violations.addAll(visitor.violations);
    }
  } finally {
    await contexts.dispose();
  }
  final combined = allSource.toString();
  for (final theme in const <String>[
    'TinyrackTheme.light',
    'TinyrackTheme.dark',
  ]) {
    if (files.isEmpty || combined.contains('$theme(')) continue;
    violations.add(
      TinyrackCheckViolation(
        column: 1,
        line: 1,
        message: 'The application does not configure $theme().',
        path: '.',
        replacement: 'Configure both Tinyrack light and dark themes.',
        ruleId: 'setup/require-tinyrack-theme',
      ),
    );
  }
  violations.sort(
    (left, right) =>
        '${left.path}:${left.line}:${left.column}:${left.ruleId}'.compareTo(
          '${right.path}:${right.line}:${right.column}:${right.ruleId}',
        ),
  );
  return TinyrackCheckResult(
    checkedFiles: files.length,
    violations: violations,
  );
}

String _escapeAnnotation(String value) => value
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A');

String formatTinyrackCheckResult(
  TinyrackCheckResult result, [
  TinyrackCheckFormat format = TinyrackCheckFormat.pretty,
]) {
  if (format == TinyrackCheckFormat.json) {
    return const JsonEncoder.withIndent('  ').convert(result.toJson());
  }
  if (result.violations.isEmpty) {
    return 'Tinyrack UI check passed (${result.checkedFiles} files).';
  }
  if (format == TinyrackCheckFormat.github) {
    return result.violations
        .map((violation) {
          return '::error file=${_escapeAnnotation(violation.path)},'
              'line=${violation.line},col=${violation.column},'
              'title=${_escapeAnnotation(violation.ruleId)}::'
              '${_escapeAnnotation(violation.message)}';
        })
        .join('\n');
  }
  return <String>[
    ...result.violations.map((violation) => violation.toString()),
    'Tinyrack UI check failed with ${result.violations.length} violation(s) '
        'in ${result.checkedFiles} file(s).',
  ].join('\n');
}
