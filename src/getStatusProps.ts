import { FormItemProps } from '@arco-design/web-react';
import { FieldMetaProps } from 'formik';

/**
 *  根据 表单 meta 和 isValidating 返回 Form.Item 的 status 和 message
 * @param meta
 * @param isValidating
 */
export default function getStatusProps(
  meta: FieldMetaProps<any>,
  isValidating: boolean
) {
  const validateStatus = getStatus(meta, isValidating);
  return {
    validateStatus,
    help: validateStatus === 'error' ? meta.error : void 0,
  };
}

/**
 *  根据 表单 meta 和 isValidating 返回  status
 * @param meta
 * @param isValidating
 */
export function getStatus(meta: FieldMetaProps<any>, isValidating: boolean) {
  if (isValidating) {
    return 'validating' as FormItemProps['validateStatus'];
  }
  if (!meta.touched) {
    return null as any as FormItemProps['validateStatus'];
  }
  return (
    typeof meta.error === 'string' ? 'error' : 'success'
  ) as FormItemProps['validateStatus'];
}
