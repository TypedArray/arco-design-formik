# @typedarray/arco-design-formik

基于 [formik](https://github.com/jaredpalmer/formik) 和 `@arco-design/web-react` [Form](https://arco.design/react/components/form) 的表单验证组件，支持自定义封装 `createField`

# Install 安装

Available as an npm package [@typedarray/arco-design-formik](https://www.npmjs.com/package/@typedarray/arco-design-formik)

```sh
// with npm
npm install @typedarray/arco-design-formik

// with yarn
yarn add @typedarray/arco-design-formik
```

## Usage 使用方法

```jsx
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from '@arco-design/web-react';
import { Input, Select } from '@tcfuture/arco-design-formik';

const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required('请输入')
    .max(10, '最多10个字符')
    .min(3, '最少3个字符'),
  password: Yup.string()
    .trim()
    .required('请输入')
    .max(10, '最多10个字符')
    .min(6, '最少6个字符'),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref('password'), null],
    '密码必须一致'
  ),
});

const App = () => (
  <Formik
    initialValues={{
      username: '',
      password: '',
      passwordConfirmation: '',
    }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      console.log('onSubmit', values);
    }}
  >
    {({ handleSubmit }) => (
      <Form layout="vertical">
        <Input name="username" label="用户名" placeholder="请输入用户名" />
        <Input name="password" label="密码" placeholder="请输入密码" />
        <Input
          name="passwordConfirmation"
          label="密码确认"
          placeholder="请再次输入密码"
        />
        <Button htmlType="button" type="primary" onClick={() => handleSubmit()}>
          提交
        </Button>
      </Form>
    )}
  </Formik>
);
```

## Features 功能

1. 自定义封装 `createField`，使用 `value` 和 `onChange` 实现自定义表单组件，通过 `formItemProps` 可以设置表单项的样式

```jsx
import { createField } from '@tcfuture/arco-design-formik';

function MyField({
  value,
  onChange,
  ...ramainingProps
}: {
  value: string,
  onChange: (value: string) => void,
} & HTMLProps<HTMLInputElement>) {
  const masked = useMemo(() => {
    return value.replace(/\s/g, '').split('').join('-');
  }, [value]);
  const onInnerChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.split('-').join('');
    onChange(newValue);
  }, []);
  return <input {...ramainingProps} value={masked} onChange={onInnerChange} />;
}
const FormikMyField = createField(MyField);

<FormikMyField
  name="test"
  label="我的自定义字段"
  placeholder="请输入..."
  formItemProps={{
    extra: '附加信息',
  }}
/>;
```
