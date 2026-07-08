export type TinyrackComponentParityStatus = 'contracted' | 'mapped' | 'needs-mapping';

export type TinyrackComponentParityContract = {
  axes: readonly (
    | 'color'
    | 'focus'
    | 'radius'
    | 'shadow'
    | 'size'
    | 'spacing'
    | 'state'
    | 'typography'
  )[];
  daisyUi: readonly string[];
  mantine: readonly string[];
  reason?: string;
  status: TinyrackComponentParityStatus;
};

export const tinyrackComponentParityContracts = {
  alert: {
    axes: ['color', 'radius', 'spacing', 'state', 'typography'],
    daisyUi: ['alert'],
    mantine: ['Alert'],
    status: 'mapped',
  },
  avatar: {
    axes: ['color', 'radius', 'size', 'typography'],
    daisyUi: ['avatar'],
    mantine: ['Avatar'],
    status: 'mapped',
  },
  badge: {
    axes: ['color', 'radius', 'size', 'state', 'typography'],
    daisyUi: ['badge'],
    mantine: ['Badge'],
    status: 'mapped',
  },
  breadcrumbs: {
    axes: ['color', 'spacing', 'typography'],
    daisyUi: ['breadcrumbs'],
    mantine: ['Breadcrumbs'],
    status: 'mapped',
  },
  button: {
    axes: ['color', 'focus', 'radius', 'shadow', 'size', 'state', 'typography'],
    daisyUi: ['button'],
    mantine: ['Button'],
    status: 'mapped',
  },
  card: {
    axes: ['color', 'radius', 'shadow', 'spacing', 'state', 'typography'],
    daisyUi: ['card'],
    mantine: ['Card'],
    status: 'mapped',
  },
  checkbox: {
    axes: ['color', 'focus', 'radius', 'size', 'state'],
    daisyUi: ['checkbox'],
    mantine: ['Checkbox'],
    status: 'mapped',
  },
  collapse: {
    axes: ['color', 'radius', 'spacing', 'state', 'typography'],
    daisyUi: ['collapse'],
    mantine: ['Collapse'],
    reason:
      'Mantine Collapse is an unstyled transition wrapper; daisyUI collapse is a styled disclosure surface.',
    status: 'contracted',
  },
  divider: {
    axes: ['color', 'spacing', 'typography'],
    daisyUi: ['divider'],
    mantine: ['Divider'],
    status: 'mapped',
  },
  drawer: {
    axes: ['color', 'radius', 'shadow', 'spacing', 'state'],
    daisyUi: ['drawer'],
    mantine: ['Drawer'],
    status: 'mapped',
  },
  fieldset: {
    axes: ['color', 'radius', 'spacing', 'typography'],
    daisyUi: ['fieldset'],
    mantine: ['Fieldset'],
    status: 'mapped',
  },
  fileInput: {
    axes: ['color', 'focus', 'radius', 'size', 'state', 'typography'],
    daisyUi: ['fileinput'],
    mantine: ['FileInput'],
    status: 'mapped',
  },
  indicator: {
    axes: ['color', 'radius', 'size', 'state', 'typography'],
    daisyUi: ['indicator'],
    mantine: ['Indicator'],
    status: 'mapped',
  },
  input: {
    axes: ['color', 'focus', 'radius', 'size', 'state', 'typography'],
    daisyUi: ['input'],
    mantine: ['Input', 'TextInput'],
    status: 'mapped',
  },
  kbd: {
    axes: ['color', 'radius', 'size', 'shadow', 'typography'],
    daisyUi: ['kbd'],
    mantine: ['Kbd'],
    status: 'mapped',
  },
  list: {
    axes: ['color', 'radius', 'spacing', 'typography'],
    daisyUi: ['list'],
    mantine: ['List'],
    status: 'mapped',
  },
  loader: {
    axes: ['color', 'size', 'state'],
    daisyUi: ['loading'],
    mantine: ['Loader'],
    status: 'mapped',
  },
  menu: {
    axes: ['color', 'focus', 'radius', 'shadow', 'spacing', 'state', 'typography'],
    daisyUi: ['dropdown', 'menu'],
    mantine: ['Menu'],
    status: 'mapped',
  },
  modal: {
    axes: ['color', 'radius', 'shadow', 'spacing', 'state', 'typography'],
    daisyUi: ['modal'],
    mantine: ['Modal'],
    status: 'mapped',
  },
  progress: {
    axes: ['color', 'radius', 'size', 'state'],
    daisyUi: ['progress'],
    mantine: ['Progress'],
    status: 'mapped',
  },
  radialProgress: {
    axes: ['color', 'size', 'state', 'typography'],
    daisyUi: ['radialprogress'],
    mantine: ['RingProgress', 'SemiCircleProgress'],
    status: 'mapped',
  },
  radio: {
    axes: ['color', 'focus', 'radius', 'size', 'state'],
    daisyUi: ['radio'],
    mantine: ['Radio'],
    status: 'mapped',
  },
  range: {
    axes: ['color', 'focus', 'radius', 'size', 'state'],
    daisyUi: ['range'],
    mantine: ['RangeSlider', 'Slider'],
    status: 'mapped',
  },
  rating: {
    axes: ['color', 'size', 'state'],
    daisyUi: ['rating'],
    mantine: ['Rating'],
    status: 'mapped',
  },
  select: {
    axes: ['color', 'focus', 'radius', 'size', 'state', 'typography'],
    daisyUi: ['select'],
    mantine: ['NativeSelect', 'Select'],
    status: 'mapped',
  },
  skeleton: {
    axes: ['color', 'radius', 'state'],
    daisyUi: ['skeleton'],
    mantine: ['Skeleton'],
    status: 'mapped',
  },
  stack: {
    axes: ['spacing'],
    daisyUi: ['stack'],
    mantine: ['Stack'],
    reason:
      'Mantine Stack is a vertical flex layout primitive; daisyUI stack is an overlapping visual stack.',
    status: 'contracted',
  },
  stepper: {
    axes: ['color', 'radius', 'size', 'spacing', 'state', 'typography'],
    daisyUi: ['steps'],
    mantine: ['Stepper'],
    status: 'mapped',
  },
  switch: {
    axes: ['color', 'focus', 'radius', 'size', 'state'],
    daisyUi: ['toggle'],
    mantine: ['Switch'],
    status: 'mapped',
  },
  table: {
    axes: ['color', 'radius', 'spacing', 'state', 'typography'],
    daisyUi: ['table'],
    mantine: ['Table'],
    status: 'mapped',
  },
  tabs: {
    axes: ['color', 'focus', 'radius', 'size', 'spacing', 'state', 'typography'],
    daisyUi: ['tab'],
    mantine: ['Tabs'],
    status: 'mapped',
  },
  textarea: {
    axes: ['color', 'focus', 'radius', 'size', 'state', 'typography'],
    daisyUi: ['textarea'],
    mantine: ['Textarea'],
    status: 'mapped',
  },
  timeline: {
    axes: ['color', 'spacing', 'state', 'typography'],
    daisyUi: ['timeline'],
    mantine: ['Timeline'],
    status: 'mapped',
  },
  tooltip: {
    axes: ['color', 'radius', 'shadow', 'spacing', 'state', 'typography'],
    daisyUi: ['tooltip'],
    mantine: ['Tooltip'],
    status: 'mapped',
  },
} as const satisfies Record<string, TinyrackComponentParityContract>;
