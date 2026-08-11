import 'dart:io';

import 'package:tinyrack_ui/tinyrack_ui_check.dart';

String? _valueAfter(List<String> arguments, String flag) {
  for (final argument in arguments) {
    if (argument.startsWith('$flag=')) {
      return argument.substring(flag.length + 1);
    }
  }
  final index = arguments.indexOf(flag);
  return index == -1 || index + 1 >= arguments.length
      ? null
      : arguments[index + 1];
}

Future<void> main(List<String> arguments) async {
  try {
    final formatName = _valueAfter(arguments, '--format') ?? 'pretty';
    final format = TinyrackCheckFormat.values.where(
      (candidate) => candidate.name == formatName,
    );
    if (format.isEmpty) {
      throw FormatException('Unknown output format: $formatName');
    }
    final result = await checkTinyrackProject(
      TinyrackCheckOptions(
        configPath: _valueAfter(arguments, '--config'),
        root: _valueAfter(arguments, '--root') ?? Directory.current.path,
      ),
    );
    stdout.writeln(formatTinyrackCheckResult(result, format.single));
    exitCode = result.violations.isEmpty ? 0 : 1;
  } on Object catch (error) {
    stderr.writeln('tinyrack_ui_check: $error');
    exitCode = 2;
  }
}
