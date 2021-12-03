import {
  Cascader as Cascader_,
  Checkbox as Checkbox_,
  CheckboxProps,
  DatePicker as DatePicker_,
  Input as Input_,
  InputNumber as InputNumber_,
  Radio as Radio_,
  Select as Select_,
  TimePicker as TimePicker_,
} from '@arco-design/web-react';
import createField from './createField';

export default createField;

export { createField };
export const Select = createField(Select_);
export const DatePicker = createField(DatePicker_);
export const MonthPicker = createField(DatePicker_.MonthPicker);
export const RangePicker = createField(DatePicker_.RangePicker);
export const TimePicker = createField(TimePicker_);
export const TimeRangePicker = createField(TimePicker_.RangePicker);
export const Input = createField(Input_);
export const InputNumber = createField(InputNumber_);
export const Password = createField(Input_.Password);
export const TextArea = createField(Input_.TextArea);
export const RadioGroup = createField(Radio_.Group);
export const Cascader = createField(Cascader_);
export const Checkbox = createField<CheckboxProps>(Checkbox_);
