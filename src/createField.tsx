import { Form, FormItemProps } from '@arco-design/web-react';
import { useFormikContext } from 'formik';
import React, {
  ComponentProps,
  ComponentType,
  ElementType,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import isEqual from 'react-fast-compare';
import getStatusProps from './getStatusProps';

export interface FieldProps<T extends ElementType, F extends ElementType> {
  /**
   * Field name
   */
  name: string;
  /**
   * Form.Item label
   */
  label?: any extends ComponentProps<F>
    ? never
    : ComponentProps<F> extends { label?: infer R }
    ? R
    : never;
  /**
   * Form.Item required
   */
  required?: any extends ComponentProps<F>
    ? never
    : ComponentProps<F> extends { required?: infer R }
    ? R
    : never;
  /**
   * Form.Item formItem
   */
  formItem?: F | null;
  /**
   * Form.Item props
   */
  formItemProps?: any extends ComponentProps<F>
    ? never
    : Omit<ComponentProps<F>, 'label' | 'required'>;
  /**
   * 外层容器，如：InputAdornment
   */
  container?: T;
  /**
   * 外层容器属性
   */
  containerProps?: ComponentProps<T>;
  /** Tells Formik to validate the form on each input's onChange event */
  validateOnChange?: boolean;
  /** Tells Formik to validate the form on each input's onBlur event */
  validateOnBlur?: boolean;
  /**
   * 默认 formik 不允许 undefined 值，所以需要用 nullable 来指定是否允许 undefined，会将 undefined 临时转换为 null 使用
   */
  nullable?: boolean;
}

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * 排除 value onChange 属性
 */
export type FieldPropsOmitInputProps<
  P,
  T extends ElementType,
  F extends ElementType
> = DistributiveOmit<P, 'value' | 'onChange'> &
  Partial<Pick<P, Extract<keyof P, 'onChange'>>> &
  FieldProps<T, F>;

const memo: <T extends ElementType>(
  Component: T,
  areEqual?: (
    prevProps: React.ComponentProps<T>,
    nextProps: React.ComponentProps<T>
  ) => boolean
) => T = React.memo;

export default function createField<P>(component: ComponentType<P>) {
  return memo(
    <
      T extends ElementType,
      F extends ElementType = ComponentType<FormItemProps>
    >({
      name,
      label,
      required,
      formItem: FormItem,
      formItemProps,
      container,
      containerProps,
      validateOnChange,
      validateOnBlur,
      nullable,
      // @ts-ignore
      onBlur,
      // @ts-ignore
      onChange,
      ...props
    }: FieldPropsOmitInputProps<P, T, F>) => {
      const formik = useFormikContext();
      const field = formik.getFieldProps(name);
      const meta = formik.getFieldMeta(name);

      const Component: ElementType = component;
      validateOnChange = validateOnChange ?? formik.validateOnChange;
      validateOnBlur = validateOnBlur ?? formik.validateOnBlur;

      const formikRef = useRef(formik);
      useEffect(() => {
        formikRef.current = formik;
      }, [formik]);

      const invalidateValueFlagRef = useRef(true);

      const internalOnBlur = useCallback(
        async (...args: any[]) => {
          const shouldValidate =
            invalidateValueFlagRef.current && validateOnBlur;
          invalidateValueFlagRef.current = false;
          const helpers = formikRef.current.getFieldHelpers(name);
          await helpers.setTouched(true, shouldValidate);
          onBlur?.(...args);
        },
        [name, onBlur, validateOnBlur]
      );
      const internalOnChange = useCallback(
        async (value: any, ...args: any[]) => {
          // 兼容 Event 类型
          if (value?.nativeEvent instanceof Event && value?.target) {
            value = value.target.value;
          }
          if (nullable && value === undefined) {
            value = null;
          }
          invalidateValueFlagRef.current = true;
          const helpers = formikRef.current.getFieldHelpers(name);
          const meta = formikRef.current.getFieldMeta(name);
          if (!meta.touched) {
            await helpers.setTouched(true, false);
          }
          await helpers.setValue(value, validateOnChange);
          onChange?.(value, ...args);
        },
        [name, onChange, validateOnChange]
      );

      const internalValue = nullable ? field.value ?? undefined : field.value;

      const children = (
        <Component
          {...props}
          value={internalValue}
          onBlur={internalOnBlur}
          onChange={internalOnChange}
        />
      );
      const element = container
        ? React.createElement(container, containerProps, children)
        : children;

      if (FormItem === void 0) {
        // @ts-ignore
        FormItem = Form.Item;
      }
      if (FormItem) {
        return (
          // @ts-ignore
          <FormItem
            label={label}
            required={!!required}
            {...getStatusProps(meta, formik.isValidating)}
            {...formItemProps}
          >
            {element}
          </FormItem>
        );
      } else {
        return element;
      }
    },
    isEqual
  );
}
