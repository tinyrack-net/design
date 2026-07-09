export const fieldClassName = 'tr-field';
export const labelClassName = 'tr-label';
export const inputClassName = 'tr-input';
export const textareaClassName = 'tr-textarea';
export const selectClassName = 'tr-select';
export const checkboxClassName = 'tr-checkbox';
export const checkboxInputClassName = 'tr-checkbox-input';
export const checkboxControlClassName = 'tr-checkbox-control';
export const checkboxLabelClassName = 'tr-checkbox-label';
export const radioGroupClassName = 'tr-radio-group';
export const radioClassName = 'tr-radio';
export const radioInputClassName = 'tr-radio-input';
export const radioControlClassName = 'tr-radio-control';
export const radioLabelClassName = 'tr-radio-label';
export const switchClassName = 'tr-switch';
export const switchInputClassName = 'tr-switch-input';
export const switchTrackClassName = 'tr-switch-track';
export const switchThumbClassName = 'tr-switch-thumb';
export const switchLabelClassName = 'tr-switch-label';
export const formMessageClassName = 'tr-form-message';

export const formControlSizes = ['sm', 'md', 'lg'] as const;
export const formMessageVariants = ['neutral', 'error'] as const;
export const radioGroupOrientations = ['vertical', 'horizontal'] as const;

export type FormControlSize = (typeof formControlSizes)[number];
export type FormMessageVariant = (typeof formMessageVariants)[number];
export type RadioGroupOrientation = (typeof radioGroupOrientations)[number];

export const formContract = {
  defaultMessageVariant: 'neutral',
  defaultRadioGroupOrientation: 'vertical',
  defaultSize: 'md',
} as const satisfies {
  defaultMessageVariant: FormMessageVariant;
  defaultRadioGroupOrientation: RadioGroupOrientation;
  defaultSize: FormControlSize;
};
