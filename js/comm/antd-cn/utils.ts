import { twoWayBind } from '../react-utils';
import { omit } from 'lodash';

export function atSwitchBind(that, key, cb?) {
    return twoWayBind(that, key, cb, v => v, 'checked');
}

// 有时候form获取的有空的情况，去除
export function atFixFormValues(values): any {
    if (Array.isArray(values)) {
        while (values.length > 0) {
            if (values[0] == null) {
                values.splice(0, 1);
            } else {
                break;
            }
        }
    } else if (typeof values === 'object') {
        values = omit(values, ['']);
    }
    return values;
}
