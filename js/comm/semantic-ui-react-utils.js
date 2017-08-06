import { twoWayBind } from './react-utils'

/**
 *
 * @param {*} e
 * @param {*} val
 * @example
 * <Checkbox {...twoWayBind(this, 'stateKey', cb, checkboxOnChange, 'checked') } />
 */
export function checkboxOnChange(e, val) {
    return val.checked
}

export function dropdownOnChange(e, val) {
    return val.value
}

export function value2OnChange(e, val) {
    return val.value
}

/**
 * ST的checkbox绑定
 * @param {*} that
 * @param {*} key
 * @param {*} ckval raido的时候，需要去判定是否被选中
 * @param {*} cb
 */
export function stTwoWayRadio(that, key, ckval, cb) {
    let res = twoWayBind(that, key, cb, value2OnChange)
    if (ckval != null) {
        res['checked'] = _.get(that.state, key) == ckval
        res['value'] = ckval
    }
    return res
}

export function stTwoWayCheckbox(that, key, cb) {
    let res = twoWayBind(that, key, cb, checkboxOnChange, 'checked')
    return res
}


export function stTwoWayMenu(that, key, name, cb) {
    let res = twoWayBind(that, key, cb, (e, val) => val.name)
    if (name != null) {
        res['onClick'] = res['onChange']
        delete res['onChange']
        res['active'] = _.get(that.state, key) == name
        res['name'] = name
    }
    return res
}
