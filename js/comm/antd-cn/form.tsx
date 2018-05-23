import { WrappedFormUtils, GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export interface WrappedFormUtils2 extends WrappedFormUtils {
    getFieldProps?(name: string, option?: GetFieldDecoratorOptions): any;
}
