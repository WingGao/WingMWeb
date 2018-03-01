/**
 * 运行函数
 * @param {*} func
 * @param {*} args
 */
export function callFunc(func, args = []) {
    if (typeof func === 'function') {
        return func(...args)
    }
    return false
}

export function isPromise(obj) {
    if (typeof obj === 'object' && typeof obj.then === 'function') {
        return true;
    }
    return false;
}
