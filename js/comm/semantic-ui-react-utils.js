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