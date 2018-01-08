import { get, set, cloneDeep } from 'lodash'

/**
 * form绑定
 * @param that
 * @param stateKey
 * @param cb
 * @param getVal
 * @returns {function(*=)}
 */
export function onIptChange(that, stateKey, cb = null, getVal = null) {
    return ((event, a1) => {
        var obj = that.state;
        var val = null;
        if (getVal == null) {
            //基础类型直接处理
            if (['number', 'boolean', 'string'].indexOf(typeof event) >= 0){
                val = event;
            }else {
                val = event.target.value;
            }
        } else val = getVal(event, a1);
        // if (typeof val == "string") {
        //     val = val.trim();
        // }
        set(obj, stateKey, val);
        that.setState(obj, () => {
            if (cb != null) cb.call(that, val);
        });

        // console.log('onIptChange', obj)
    })
}

/**
 * 简陋的双向绑定
 * 用法 {...twoWayBind(this,'x')}
 * @param that
 * @param key
 * @param cb
 * @param getValue 直接返回最终的返回结果，默认为 event=>event.target.value
 * @param valueKey 某些组件并非接受value，比如<Checkbox checked={true} />这种就要传 'checked'
 * @return {{value: *, onChange}}
 */
export function twoWayBind(that, key, cb, getVal, valueKey = 'value') {
    let obj = {
        onChange: onIptChange(that, key, cb, getVal)
    };
    obj[valueKey] = get(that.state, key);
    return obj
}

/**
 * 自动设定state
 * @param {*} that
 * @param {*} newState
 */
export function setState(that, newState, opt) {
    let oldState = cloneDeep(that.state)
    if (that.state == null) {
        that.state = newState
    } else {
        that.setState(newState, opt.after.bind(that, oldState))
    }
}
