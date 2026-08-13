import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/semantics.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
// ignore: implementation_imports
import 'package:tinyrack_ui/src/internal/layer.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

void main() {
  _SemanticsUpdateTestBinding();

  testWidgets(
    'adjacent list layers keep every serialized semantics node reachable',
    (tester) async {
      final semantics = tester.ensureSemantics();
      await tester.pumpWidget(const Placeholder(), phase: EnginePhase.build);
      _SemanticsUpdateBuilderSpy.batches.clear();

      var showA = true;
      var showB = false;
      late StateSetter update;
      await tester.pumpWidget(
        MaterialApp(
          theme: TinyrackTheme.light(),
          home: Scaffold(
            body: StatefulBuilder(
              builder: (context, setState) {
                update = setState;
                return ListView(
                  children: [
                    Row(
                      children: [
                        _layer(open: showA, name: 'A'),
                        _layer(open: showB, name: 'B'),
                      ],
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      );
      await tester.pump();

      final graph = <int, _SemanticsNodeUpdate>{};
      _expectUpdatedNodesReachable(graph);
      expect(find.text('Layer A'), findsOneWidget);

      update(() => showB = true);
      await tester.pump();
      await tester.pump();
      _expectUpdatedNodesReachable(graph);
      expect(find.text('Layer A'), findsOneWidget);
      expect(find.text('Layer B'), findsOneWidget);

      update(() => showA = false);
      await tester.pump();
      await tester.pump();
      _expectUpdatedNodesReachable(graph);
      expect(find.text('Layer A'), findsNothing);
      expect(find.text('Layer B'), findsOneWidget);
      semantics.dispose();
    },
  );
}

Widget _layer({required bool open, required String name}) => TRAnchoredLayer(
  open: open,
  requestFocus: false,
  triggerBuilder: (context, open, openLayer, closeLayer, toggleLayer) =>
      Text('Trigger $name'),
  layerBuilder: (context) => Text('Layer $name'),
);

void _expectUpdatedNodesReachable(Map<int, _SemanticsNodeUpdate> graph) {
  for (final batch in _SemanticsUpdateBuilderSpy.takeBatches()) {
    graph.addAll(batch);
    expect(graph, contains(0));

    final reachable = <int>{};
    void visit(int id) {
      if (!reachable.add(id)) return;
      final node = graph[id];
      if (node == null) return;
      for (final child in node.childrenInTraversalOrder) {
        visit(child);
      }
    }

    visit(0);
    expect(
      batch.keys.where((id) => !reachable.contains(id)),
      isEmpty,
      reason:
          'The Windows accessibility bridge rejects orphan semantics nodes.',
    );
  }
}

typedef _SemanticsNodeUpdate = ({Int32List childrenInTraversalOrder});

class _SemanticsUpdateTestBinding extends AutomatedTestWidgetsFlutterBinding {
  @override
  ui.SemanticsUpdateBuilder createSemanticsUpdateBuilder() =>
      _SemanticsUpdateBuilderSpy();
}

class _SemanticsUpdateBuilderSpy extends Fake
    implements ui.SemanticsUpdateBuilder {
  final ui.SemanticsUpdateBuilder _builder = ui.SemanticsUpdateBuilder();
  final Map<int, _SemanticsNodeUpdate> _nodes = {};

  static final List<Map<int, _SemanticsNodeUpdate>> batches = [];

  static List<Map<int, _SemanticsNodeUpdate>> takeBatches() {
    final result = List<Map<int, _SemanticsNodeUpdate>>.of(batches);
    batches.clear();
    return result;
  }

  @override
  void updateNode({
    required int id,
    required SemanticsFlags flags,
    required int actions,
    required int maxValueLength,
    required int currentValueLength,
    required int textSelectionBase,
    required int textSelectionExtent,
    required int platformViewId,
    required int scrollChildren,
    required int scrollIndex,
    required int? traversalParent,
    required double scrollPosition,
    required double scrollExtentMax,
    required double scrollExtentMin,
    required Rect rect,
    required String identifier,
    required String label,
    List<StringAttribute>? labelAttributes,
    required String value,
    List<StringAttribute>? valueAttributes,
    required String increasedValue,
    List<StringAttribute>? increasedValueAttributes,
    required String decreasedValue,
    List<StringAttribute>? decreasedValueAttributes,
    required String hint,
    List<StringAttribute>? hintAttributes,
    String? tooltip,
    TextDirection? textDirection,
    required Float64List transform,
    required Float64List hitTestTransform,
    required Int32List childrenInTraversalOrder,
    required Int32List childrenInHitTestOrder,
    required Int32List additionalActions,
    int headingLevel = 0,
    String? linkUrl,
    SemanticsRole role = SemanticsRole.none,
    required List<String>? controlsNodes,
    SemanticsValidationResult validationResult = SemanticsValidationResult.none,
    ui.SemanticsHitTestBehavior hitTestBehavior =
        ui.SemanticsHitTestBehavior.defer,
    required ui.SemanticsInputType inputType,
    required ui.Locale? locale,
    required String minValue,
    required String maxValue,
  }) {
    assert(!_nodes.containsKey(id));
    _nodes[id] = (
      childrenInTraversalOrder: Int32List.fromList(childrenInTraversalOrder),
    );
  }

  @override
  void updateCustomAction({
    required int id,
    String? label,
    String? hint,
    int overrideId = -1,
  }) => _builder.updateCustomAction(
    id: id,
    label: label,
    hint: hint,
    overrideId: overrideId,
  );

  @override
  ui.SemanticsUpdate build() {
    batches.add(Map<int, _SemanticsNodeUpdate>.of(_nodes));
    return _builder.build();
  }
}
