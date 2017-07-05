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
        if (getVal == null) val = event.target.value;
        else val = getVal(event, a1);
        if (typeof val == "string") {
            val = val.trim();
        }
        _.set(obj, stateKey, val);
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
 * @return {{value: *, onChange}}
 */
export function twoWayBind(that, key, cb, getVal, valueKey = 'value') {
    let obj = {
        onChange: onIptChange(that, key, cb, getVal)
    };
    obj[valueKey] = _.get(that.state, key);
    return obj
}