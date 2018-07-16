import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { get } from 'lodash';

export interface WrappedFormUtils2 extends WrappedFormUtils {
    getFieldProps?(name: string, option?: GetFieldDecoratorOptions): any;
}
/**
 * 直接从form中获取对应的值，深度便利
 */
export function formGetValueDeep(form: WrappedFormUtils, fieldName: string, defVal?) {
    const vals = form.getFieldsValue();
    return get(vals, fieldName, defVal);
}
