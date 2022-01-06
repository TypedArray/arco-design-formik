import { Button, Form } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { Meta, Story } from '@storybook/react';
import { Formik } from 'formik';
import React, { ChangeEvent, HTMLProps, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { Checkbox, createField, Input, RadioGroup, Select } from '../src';

const meta: Meta = {
  title: 'Formik',
};

export default meta;

const options = [
  {
    value: 'name',
    label: '产品名称',
  },
  {
    value: 'id',
    label: '产品ID',
  },
];

export const Default: Story = () => {
  const validationSchema = useMemo(
    () =>
      Yup.object({
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
        searchKey: Yup.string().nullable().required('请输入'),
      }),
    []
  );
  return (
    <Formik
      initialValues={{
        username: '',
        url: '',
        password: '',
        sex: '',
        checkbox: true,
        searchKey: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log('onSubmit', values);
      }}
      validate={(values) => {
        console.log('====================================');
        console.log('validate', values);
        console.log('====================================');
      }}
    >
      {({ handleSubmit }) => (
        <Form layout="vertical" onSubmit={() => handleSubmit()}>
          <Input
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            validateOnChange={false}
            formItemProps={{ hasFeedback: false, extra: '最多10个字符' }}
            allowClear
          />
          <Input
            name="url"
            label="网站"
            placeholder="请输入域名"
            addBefore="https://"
            addAfter=".com"
            onChange={(value) => {
              console.log('====================================');
              console.log('onChange', value);
              console.log('====================================');
            }}
          />
          <RadioGroup
            label="性别"
            name="sex"
            onChange={(value) => {
              console.log('====================================');
              console.log('onChange', value);
              console.log('====================================');
            }}
            options={options}
          />
          <Checkbox name="checkbox" label="Checkbox">
            Checkbox
          </Checkbox>
          <Input name="password" label="密码" placeholder="请输入密码" />
          <Input
            name="passwordConfirmation"
            label="密码确认"
            placeholder="请再次输入密码"
          />
          <Select
            name="searchKey"
            label="searchKey"
            options={options}
            allowClear
            nullable
          />
          <Button htmlType="submit" type="primary">
            提交
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export const PasswordConfirmation: Story = () => {
  const validationSchema = useMemo(
    () =>
      Yup.object({
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
      }),
    []
  );
  return (
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
          <Button
            htmlType="button"
            type="primary"
            onClick={() => handleSubmit()}
          >
            提交
          </Button>
        </Form>
      )}
    </Formik>
  );
};

function MyField({
  value,
  onChange,
  ...ramainingProps
}: {
  value: string;
  onChange: (value: string) => void;
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

export const CreateFiled: Story = () => {
  const validationSchema = useMemo(
    () =>
      Yup.object({
        test: Yup.string(),
      }),
    []
  );
  return (
    <Formik
      initialValues={{
        test: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log('onSubmit', values);
      }}
    >
      {({ values }) => (
        <Form layout="vertical">
          <FormikMyField name="test" label="test" placeholder="请输入..." />
          <div>
            value is <strong>{values.test}</strong>
          </div>
        </Form>
      )}
    </Formik>
  );
};
