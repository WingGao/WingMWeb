import { twoWayBind } from '../react-utils';

export function atSwitchBind(that, key, cb?) {
    return twoWayBind(that, key, cb, v => v, 'checked');
}
