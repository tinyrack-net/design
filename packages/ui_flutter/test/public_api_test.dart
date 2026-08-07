import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:tinyrack_ui/tinyrack_ui.dart';

/// Every public class, enum, mixin, and extension the library declares.
///
/// Naming each one here is the guard: renaming or deleting a type stops the
/// build at this file. That alone cannot notice a type nobody added, which is
/// how three window-caption types once lived and died outside this list, so
/// the list is also checked against what the sources declare.
const publicTypes = <Type>[
  TRAccordion,
  TRAccordionItem,
  TRAlert,
  TRAlertDialog,
  TRAnimatedNumber,
  TRAnimatedNumberAnimation,
  TRAnimatedNumberRollDirection,
  TRAppShell,
  TRAppShellActions,
  TRAppShellBrand,
  TRAppShellBreakpoint,
  TRAppShellChrome,
  TRAppShellClose,
  TRAppShellController,
  TRAppShellHeader,
  TRAppShellLayout,
  TRAppShellMain,
  TRAppShellMobileDrawerSide,
  TRAppShellMobileSidebar,
  TRAppShellNavigationKind,
  TRAppShellOutline,
  TRAppShellPageScroll,
  TRAppShellSidebar,
  TRAppShellSidebarLabel,
  TRAppShellSidebarMode,
  TRAppShellSidebarToggle,
  TRAppShellTrigger,
  TRAppearance,
  TRAutocomplete,
  TRAutocompleteCompletionMode,
  TRAutocompleteController,
  TRAutocompleteFormField,
  TRAutocompleteItem,
  TRAvatar,
  TRAvatarShape,
  TRBadge,
  TRBreadcrumbs,
  TRBreadcrumbsItem,
  TRBreakpoints,
  TRButton,
  TRCard,
  TRCardContent,
  TRCardDescription,
  TRCardFooter,
  TRCardHeader,
  TRCardPadding,
  TRCardTitle,
  TRCardVariant,
  TRCheckbox,
  TRCheckboxFormField,
  TRCheckboxGroup,
  TRCode,
  TRCodeBlock,
  TRCodeHighlightFailure,
  TRCodeHighlightFailureReason,
  TRCodeHighlightRequest,
  TRCodeHighlightResult,
  TRCodeHighlighterProvider,
  TRCollapsible,
  TRCollapsibleAttachedEdge,
  TRCombobox,
  TRComboboxController,
  TRComboboxFilterMode,
  TRComboboxFormField,
  TRComboboxItem,
  TRComboboxLayout,
  TRContextMenu,
  TRContextMenuController,
  TRContextMenuHost,
  TRContextMenuPresenter,
  TRContextMenuPresenterScope,
  TRControlMetrics,
  TRCopyButton,
  TRCopyButtonStatus,
  TRDialog,
  TRDialogPlacement,
  TRDrawer,
  TRDrawerController,
  TRDrawerPlacement,
  TRDrawerScaffold,
  TRDropOverlay,
  TRField,
  TRFieldAppearance,
  TRFieldset,
  TRFileTree,
  TRFileTreeDirectory,
  TRFileTreeFile,
  TRFileTreeNode,
  TRFlutterContextMenuPresenter,
  TRForm,
  TRFormState,
  TRFormValues,
  TRFocusRing,
  TRIconButton,
  TRInlineSuggestionItem,
  TRInlineSuggestions,
  TRInlineSuggestionsController,
  TRInlineSuggestionsStatus,
  TRIntent,
  TRLayerPlacement,
  TRLink,
  TRLinkUnderline,
  TRLinkVariant,
  TRMeasurements,
  TRMenu,
  TRMenuActionElement,
  TRMenuCheckboxItem,
  TRMenuElement,
  TRMenuGroupLabel,
  TRMenuItem,
  TRMenuRadioItem,
  TRMenuSeparator,
  TRMenuSeparatorElement,
  TRMenuSubmenu,
  TRMenuSubmenuElement,
  TRMenubar,
  TRMenubarMenu,
  TRMeter,
  TRMotion,
  TRMultiCombobox,
  TRMultiComboboxController,
  TRMultiComboboxFormField,
  TRNavigationMenu,
  TRNavigationMenuController,
  TRNavigationMenuItem,
  TRNativeContextMenuPresenter,
  TRNumberField,
  TRNumberFieldController,
  TRNumberFieldFormField,
  TROpacity,
  TROtpField,
  TROtpFieldController,
  TROtpFieldFormField,
  TRPageTransitionsBuilder,
  TRPagination,
  TRPopover,
  TRPopoverController,
  TRPreviewCard,
  TRPreviewCardController,
  TRProgress,
  TRRadii,
  TRRadio,
  TRRadioGroup,
  TRRangeSlider,
  TRRangeSliderFormField,
  TRScrollArea,
  TRSelect,
  TRSelectFormField,
  TRSelectItem,
  TRSeparator,
  TRSeparatorOrientation,
  TRSeparatorVariant,
  TRShadows,
  TRSkeleton,
  TRSkeletonShape,
  TRSplitView,
  TRSlider,
  TRSliderFormField,
  TRSpacing,
  TRSpinner,
  TRSpinnerVariant,
  TRStatusVariant,
  TRStepsItem,
  TRStepsRoot,
  TRSwitch,
  TRTable,
  TRTableColumn,
  TRTableDensity,
  TRTableFooter,
  TRTableRow,
  TRTabs,
  TRTabDropDetails,
  TRTabsDragConfiguration,
  TRTabsTab,
  TRText,
  TRTextAlign,
  TRTextColor,
  TRTextField,
  TRTextVariant,
  TRTextWeight,
  TRTextarea,
  TRToastAnchor,
  TRToastController,
  TRToastData,
  TRToastHandle,
  TRToastPlacement,
  TRToastRegion,
  TRToggle,
  TRToggleGroup,
  TRToolbar,
  TRToolbarButton,
  TRToolbarGroup,
  TRToolbarInput,
  TRToolbarLink,
  TRToolbarSeparator,
  TRTooltip,
  TRTooltipController,
  TRTooltipProvider,
  TRTreeNav,
  TRTreeNavController,
  TRTreeNavGroup,
  TRTreeNavItem,
  TRTreeNavLeaf,
  TRTypography,
  TRUiSize,
  TRWindowFrame,
  TRWindowFrameAddressBar,
  TRWindowFrameBody,
  TRWindowFrameControl,
  TRWindowFrameControlTone,
  TRWindowFrameControls,
  TRWindowFramePadding,
  TRWindowFrameTitle,
  TRWindowFrameTitleBar,
  TRWindowFrameVariant,
];

/// Public typedefs, named as strings.
///
/// A typedef's type literal stringifies to the type it aliases rather than to
/// its own name, so these cannot be compared through [publicTypes].
const publicTypedefNames = <String>{
  'TRAnimatedNumberFormatter',
  'TRAutocompleteOptionsBuilder',
  'TRCodeHighlighter',
  'TRComboboxFilter',
  'TRComboboxOptionsBuilder',
  'TRMenuElementsBuilder',
  'TROtpSeparatorBuilder',
  'TRPaginationRangeItem',
  'TRSliderLabelBuilder',
};

typedef _Declarations = ({Set<String> types, Set<String> typedefs});

_Declarations _declaredPublicNames() {
  final typePattern = RegExp(
    r'^(?:abstract\s+|final\s+|sealed\s+|base\s+|interface\s+)*'
    r'(?:class|enum|mixin|extension)\s+(TR[A-Za-z0-9_]*)',
    multiLine: true,
  );
  final typedefPattern = RegExp(
    r'^typedef\s+(TR[A-Za-z0-9_]*)',
    multiLine: true,
  );

  final library = Directory('lib');
  expect(
    library.existsSync(),
    isTrue,
    reason: 'run this test from the ui_flutter package root',
  );

  final types = <String>{};
  final typedefs = <String>{};
  for (final entity in library.listSync(recursive: true)) {
    if (entity is! File || !entity.path.endsWith('.dart')) continue;
    // Windows reports a backslash separator, so compare a normalized path.
    final relative = entity.path.replaceAll(r'\', '/').split('lib/').last;
    // Generated tokens and internal plumbing are not part of the contract.
    if (relative.startsWith('src/internal/') ||
        relative.startsWith('src/generated/') ||
        relative == 'tinyrack_ui.dart') {
      continue;
    }
    final source = entity.readAsStringSync();
    for (final match in typePattern.allMatches(source)) {
      types.add(match.group(1)!);
    }
    for (final match in typedefPattern.allMatches(source)) {
      typedefs.add(match.group(1)!);
    }
  }
  return (types: types, typedefs: typedefs);
}

void main() {
  test('the package entrypoint preserves every public component type', () {
    // Referencing each type is the guard: a removed or renamed type fails to
    // compile here before any expectation runs.
    expect(publicTypes, isNotEmpty);
    expect(publicTypedefNames, isNotEmpty);
  });

  test('the public lists cover every declaration the sources make', () {
    final declared = _declaredPublicNames();
    // A generic type literal stringifies with its arguments applied.
    final listedTypes = publicTypes
        .map((type) => type.toString().split('<').first)
        .toSet();

    expect(
      declared.types.difference(listedTypes),
      isEmpty,
      reason: 'these public types are missing from publicTypes',
    );
    expect(
      listedTypes.difference(declared.types),
      isEmpty,
      reason: 'publicTypes names a type the sources no longer declare',
    );
    expect(
      declared.typedefs.difference(publicTypedefNames),
      isEmpty,
      reason: 'these public typedefs are missing from publicTypedefNames',
    );
    expect(
      publicTypedefNames.difference(declared.typedefs),
      isEmpty,
      reason:
          'publicTypedefNames names a typedef the sources no longer declare',
    );
  });
}
