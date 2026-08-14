import 'dart:convert';
import 'dart:io';

import 'package:analyzer/dart/analysis/analysis_context_collection.dart';
import 'package:analyzer/dart/analysis/results.dart';
import 'package:analyzer/dart/ast/ast.dart';
import 'package:analyzer/dart/ast/visitor.dart';
import 'package:analyzer/dart/element/element.dart';
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

  static const packageVersion = '0.62.1';

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
  'Border',
  'BorderRadius',
  'BorderSide',
  'BoxConstraints',
  'BoxShadow',
  'Color',
  'EdgeInsets',
  'IconData',
  'Opacity',
  'Offset',
  'Padding',
  'Radius',
  'ShapeDecoration',
  'Size',
  'SizedBox',
  'TextStyle',
};
const _styleMethods = <String>{
  'all',
  'circular',
  'fromLTRB',
  'fromRadius',
  'fromSTEB',
  'lerp',
  'only',
  'symmetric',
  'withAlpha',
  'withOpacity',
  'withValues',
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
  'ActionChip': 'a Tinyrack button or token-backed product composite',
  'AlertDialog': 'TRAlertDialog',
  'AppBar': 'TRAppShell',
  'Card': 'TRCard',
  'Checkbox': 'TRCheckbox',
  'ChoiceChip': 'TRToggleGroup or a token-backed product composite',
  'CircularProgressIndicator': 'TRSpinner or TRProgress',
  'Dialog': 'TRDialog',
  'Divider': 'TRSeparator',
  'Drawer': 'TRDrawer',
  'DropdownButton': 'TRSelect',
  'DropdownButtonFormField': 'TRSelect with TRForm',
  'ElevatedButton': 'TRButton',
  'ExpansionTile': 'TRAccordion',
  'FilterChip': 'TRToggleGroup or a token-backed product composite',
  'FilledButton': 'TRButton',
  'FloatingActionButton': 'TRButton',
  'IconButton': 'TRIconButton',
  'InputChip': 'a Tinyrack button or token-backed product composite',
  'InkResponse': 'a Tinyrack component',
  'InkWell': 'a Tinyrack component',
  'LinearProgressIndicator': 'TRProgress',
  'ListTile': 'a Tinyrack list component or token-backed product composite',
  'Material': 'a Tinyrack surface component',
  'BottomNavigationBar': 'TRAppShell or a Tinyrack navigation component',
  'NavigationRail': 'TRAppShell or TRTreeNav',
  'OutlinedButton': 'TRButton',
  'PopupMenuButton': 'TRMenu',
  'PopupMenuItem': 'TRMenu',
  'Radio': 'TRRadio',
  'Scaffold': 'TRAppShell',
  'Scrollbar': 'TRScrollArea',
  'SegmentedButton': 'TRToggleGroup',
  'SelectableText': 'TRText or a Tinyrack text component',
  'SimpleDialog': 'TRDialog',
  'SnackBar': 'TRToastRegion',
  'Switch': 'TRSwitch',
  'TabBar': 'TRTabs',
  'TextButton': 'TRButton',
  'TextField': 'TRTextField',
  'TextFormField': 'TRTextField with TRForm',
  'Tooltip': 'TRTooltip',
  'VerticalDivider': 'TRSeparator',
};
const _cupertinoComponents = <String, String>{
  'CupertinoActivityIndicator': 'TRSpinner or TRProgress',
  'CupertinoAlertDialog': 'TRAlertDialog',
  'CupertinoButton': 'TRButton',
  'CupertinoContextMenu': 'TRContextMenu',
  'CupertinoNavigationBar': 'TRAppShell',
  'CupertinoPageScaffold': 'TRAppShell',
  'CupertinoScrollbar': 'TRScrollArea',
  'CupertinoSwitch': 'TRSwitch',
  'CupertinoTabBar': 'TRTabs',
  'CupertinoTextField': 'TRTextField',
};
const _overlayMethods = <String, String>{
  'showAboutDialog': 'TRDialog',
  'showDialog': 'TRDialog',
  'showMenu': 'TRMenu',
  'showModalBottomSheet': 'TRDrawer',
};
const _tinyrackTokenOwners = <String>{
  'TRBreakpoints',
  'TRControlMetrics',
  'TRMeasurements',
  'TRMotion',
  'TROpacity',
  'TRRadii',
  'TRShadows',
  'TRSpacing',
  'TRTypography',
  'TinyrackThemeData',
};
const _frameworkVisualOwners = <String>{
  'Colors',
  'CupertinoColors',
  'CupertinoIcons',
  'FontWeight',
  'Icons',
};
const _frameworkThemeMembers = <String>{'colorScheme', 'textTheme'};

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

String? _libraryUri(Element? element) => element?.library?.uri.toString();

String? _ownerName(Element? element) => element?.enclosingElement?.lookupName;

bool _fromFlutter(Element? element) =>
    _libraryUri(element)?.startsWith('package:flutter/') ?? false;

bool _fromStandaloneDesignUi(Element? element) {
  final library = _libraryUri(element);
  return library?.startsWith('package:material_ui/') == true ||
      library?.startsWith('package:cupertino_ui/') == true;
}

bool _fromFlutterDesignUi(Element? element) =>
    _fromFlutter(element) || _fromStandaloneDesignUi(element);

bool _fromFlutterSdk(Element? element) =>
    _fromFlutterDesignUi(element) || _libraryUri(element) == 'dart:ui';

bool _fromTinyrack(Element? element) =>
    _libraryUri(element)?.startsWith('package:tinyrack_ui/') ?? false;

bool _isTinyrackToken(Element? element) =>
    _fromTinyrack(element) &&
    _tinyrackTokenOwners.contains(_ownerName(element));

bool _isAllowedStructuralConstant(AstNode node, Element? element) =>
    node.toSource() == 'double.infinity' || element?.lookupName == 'zero';

Element? _variableElement(Element? element) =>
    element is PropertyAccessorElement && element.isOriginVariable
    ? element.variable
    : element;

final class _LiteralVisitor extends RecursiveAstVisitor<void> {
  _LiteralVisitor(this.variables, [Set<Element>? visited])
    : visited = visited ?? <Element>{};

  final Set<Element> visited;
  final Map<Element, Expression> variables;
  bool forbidden = false;

  void _checkElement(AstNode node, Element? element) {
    if (forbidden || element == null || _isTinyrackToken(element)) return;
    if (_isAllowedStructuralConstant(node, element)) return;
    if (element is VariableElement) {
      final value = element.computeConstantValue();
      if (value?.toDoubleValue() != null || value?.toIntValue() != null) {
        forbidden = true;
      }
    }
  }

  @override
  void visitDoubleLiteral(DoubleLiteral node) => forbidden = true;

  @override
  void visitIntegerLiteral(IntegerLiteral node) => forbidden = true;

  @override
  void visitPrefixedIdentifier(PrefixedIdentifier node) {
    if (_isTinyrackToken(node.element) ||
        _isAllowedStructuralConstant(node, node.element)) {
      return;
    }
    _checkElement(node, node.element);
    if (!forbidden) super.visitPrefixedIdentifier(node);
  }

  @override
  void visitPropertyAccess(PropertyAccess node) {
    if (_isTinyrackToken(node.propertyName.element) ||
        _isAllowedStructuralConstant(node, node.propertyName.element)) {
      return;
    }
    _checkElement(node, node.propertyName.element);
    if (!forbidden) super.visitPropertyAccess(node);
  }

  @override
  void visitSimpleIdentifier(SimpleIdentifier node) {
    if (node.parent is Label) return;
    final element = _variableElement(node.element);
    final initializer = element == null ? null : variables[element];
    if (initializer != null && visited.add(element!)) {
      final visitor = _LiteralVisitor(variables, visited);
      initializer.accept(visitor);
      forbidden = visitor.forbidden;
      return;
    }
    _checkElement(node, node.element);
    if (!forbidden) super.visitSimpleIdentifier(node);
  }
}

bool _containsVisualLiteral(
  Expression expression,
  Map<Element, Expression> variables,
) {
  final visitor = _LiteralVisitor(variables);
  expression.accept(visitor);
  return visitor.forbidden;
}

final class _VariableVisitor extends RecursiveAstVisitor<void> {
  final variables = <Element, Expression>{};

  @override
  void visitVariableDeclaration(VariableDeclaration node) {
    final initializer = node.initializer;
    final element = node.declaredFragment?.element;
    if ((node.isConst || node.isFinal) &&
        initializer != null &&
        element != null) {
      variables[element] = initializer;
    }
    super.visitVariableDeclaration(node);
  }
}

final class _CheckVisitor extends RecursiveAstVisitor<void> {
  _CheckVisitor({
    required this.lineInfo,
    required this.path,
    required this.source,
    required this.variables,
  });

  final LineInfo lineInfo;
  final String path;
  final String source;
  final Map<Element, Expression> variables;
  final configuredThemes = <String>{};
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

  void _checkExpression(Expression expression) {
    if (expression is InstanceCreationExpression &&
        _fromFlutterSdk(expression.constructorName.element) &&
        _styleConstructors.contains(
          _ownerName(expression.constructorName.element),
        )) {
      return;
    }
    if (!_containsVisualLiteral(expression, variables)) return;
    final value = expression.toSource();
    _add(
      expression,
      'tokens/no-literal',
      'Visual expression is not backed by a public Tinyrack token: $value',
      'Use a public TR token or an expression derived from one.',
    );
  }

  void _checkArgument(AstNode argument) {
    final name = RegExp(
      r'^\s*([A-Za-z_]\w*)\s*:',
    ).firstMatch(argument.toSource())?.group(1);
    if (name != null && !_styleArguments.contains(name)) return;
    if (argument is Expression) {
      _checkExpression(argument);
      return;
    }
    final expression = argument.childEntities.whereType<Expression>().first;
    _checkExpression(expression);
  }

  void _checkFrameworkVisualConstant(AstNode node, Element? element) {
    final owner = _ownerName(element);
    final name = element?.lookupName;
    final library = _libraryUri(element);
    final frameworkOwner =
        _frameworkVisualOwners.contains(owner) &&
        (_fromFlutterDesignUi(element) || library == 'dart:ui');
    final themeMember =
        owner == 'ThemeData' && _frameworkThemeMembers.contains(name);
    if (!(frameworkOwner || themeMember) ||
        (owner == 'Colors' && name == 'transparent')) {
      return;
    }
    _add(
      node,
      'tokens/no-literal',
      'Flutter visual constant is not backed by a public Tinyrack token: '
          '${node.toSource()}',
      'Use a public TR token or context.tinyrackTheme.',
    );
  }

  void _checkComponent(
    AstNode node,
    Element? element,
    Map<String, String> replacements,
  ) {
    if (!_fromFlutterDesignUi(element)) return;
    final owner = _ownerName(element);
    final replacement = replacements[owner];
    if (owner == null || replacement == null) return;
    _add(
      node,
      'components/no-material-equivalent',
      '$owner has a public Tinyrack equivalent.',
      'Use $replacement.',
    );
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
    final element = node.constructorName.element;
    _checkComponent(node, element, _materialComponents);
    _checkComponent(node, element, _cupertinoComponents);
    final constructor = _ownerName(element);
    if (_fromFlutterSdk(element) && _styleConstructors.contains(constructor)) {
      for (final argument in node.argumentList.arguments) {
        _checkArgument(argument);
      }
    } else if (_fromTinyrack(element)) {
      for (final argument in node.argumentList.arguments) {
        if (RegExp(r'^\s*[A-Za-z_]\w*\s*:').hasMatch(argument.toSource())) {
          _checkArgument(argument);
        }
      }
    }
    super.visitInstanceCreationExpression(node);
  }

  @override
  void visitMethodInvocation(MethodInvocation node) {
    final element = node.methodName.element;
    final name = node.methodName.name;
    final replacement = _fromFlutterDesignUi(element)
        ? _overlayMethods[name]
        : null;
    if (replacement != null) {
      _add(
        node,
        'components/no-material-equivalent',
        '$name has a public Tinyrack equivalent.',
        'Use $replacement.',
      );
    }
    final owner = _ownerName(element);
    if (_fromFlutterSdk(element) &&
        _styleConstructors.contains(owner) &&
        _styleMethods.contains(name)) {
      for (final argument in node.argumentList.arguments) {
        _checkArgument(argument);
      }
    }
    if (_fromTinyrack(element) &&
        owner == 'TinyrackTheme' &&
        const <String>{'light', 'dark'}.contains(name)) {
      configuredThemes.add(name);
    }
    super.visitMethodInvocation(node);
  }

  @override
  void visitPrefixedIdentifier(PrefixedIdentifier node) {
    _checkFrameworkVisualConstant(node, node.element);
    super.visitPrefixedIdentifier(node);
  }

  @override
  void visitPropertyAccess(PropertyAccess node) {
    _checkFrameworkVisualConstant(node, node.propertyName.element);
    super.visitPropertyAccess(node);
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
  final configuredThemes = <String>{};
  try {
    for (final file in files) {
      final source = file.readAsStringSync();
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
      final variableVisitor = _VariableVisitor();
      resolved.unit.accept(variableVisitor);
      final visitor = _CheckVisitor(
        lineInfo: resolved.lineInfo,
        path: path,
        source: source,
        variables: variableVisitor.variables,
      );
      resolved.unit.accept(visitor);
      configuredThemes.addAll(visitor.configuredThemes);
      violations.addAll(visitor.violations);
    }
  } finally {
    await contexts.dispose();
  }
  for (final theme in const <String>['light', 'dark']) {
    if (files.isEmpty || configuredThemes.contains(theme)) continue;
    violations.add(
      TinyrackCheckViolation(
        column: 1,
        line: 1,
        message: 'The application does not configure TinyrackTheme.$theme().',
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
