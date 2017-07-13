/**
 * 运行函数
 * @param {*} func 
 * @param {*} args 
 */
export function callFunc(func, args = []) {
    if (typeof func == 'function') {
        return func(...args)
    }
    return false
}