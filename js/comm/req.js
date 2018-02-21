import 'whatwg-fetch'
import qs from 'qs'
import { merge, isString, isNil, isArray, size, pick, toPlainObject, forEach, get } from 'lodash'

function regJqPostJSON() {
    $.postJSON = function (url, data, callback) {
        return jQuery.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'type': 'POST',
            'url': url,
            'data': JSON.stringify(data),
            'dataType': 'json',
            'success': callback
        });
    };
}

let localCaches = {}

function fetchJSON(url, opts) {
    //允许本地缓存
    if (opts.localCache && opts.method == 'GET') {
        let c = localCaches[url]
        if (c != null) {
            return new Promise((resovle, reject) => {
                resovle(c)
            })
        }
    }
    return fetch(url, opts).then((response) => {
        return new Promise((resolve, reject) => {
            if (response.ok) {
                return response.json().then(res => {
                    if (opts.localCache) localCaches[url] = res
                    resolve(res)
                })
            } else {
                let error = new Error(response.statusText)
                response.json().then(eres => {
                    error.response = eres
                    reject(error)
                    // throw error
                }).catch(()=>{
                    error.response = { err_msg: response.statusText }
                    reject(error)
                })
            }
        })

    })
}

function fPostJSON(url, data, opts = {}) {
    let opt = merge({
        method: 'POST',
        credentials: 'same-origin',
        headers: {},
    }, opts)
    switch (opts.dataType) {
        case 'json':
            opt.body = JSON.stringify(data)
            opt.headers['Content-Type'] = 'application/json'
            break
        case 'form':
        default:
            if (isString(data)) {
                opt.body = data
            } else {
                opt.body = params(data, null, opts)
            }
            opt.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
            break;
    }
    return fetchJSON(url, opt)
}

function fGetJSON(url, data, opts = {}) {
    if (!isNil(data)) {
        url += '?' + (isString(data) ? data : params(data, null, opts))
    }
    return fetchJSON(url, merge({
        method: 'GET',
        credentials: 'same-origin',
    }, opts))
}

/**
 * 将对象转换为请求的params
 * @param {object} obj 要转换的对象
 * @param {array|object} fields 如果定义，则只处理该对象
 * @param opts
 * @example
 * params({a:1, b:2, c:3}, {b:1})
 * // or params({a:1, b:2, c:3}, ['b'])
 * // return "a=1&c=3"
 */
function params(obj, fields, opts = {}) {
    let nobj = merge({}, obj)
    if (opts.arrayFormat === 'dot') {
        forEach(obj, (v, i) => {
            if (isArray(v)) {
                nobj[i] = toPlainObject(v)
            }
        })
    }
    return qs.stringify(nobj, pick(opts, ['allowDots', 'encode']))
    let res = []
    if (fields != null && !isArray(fields)) {
        fields = _.sortBy(_.keys(fields))
    }
    _.forEach(obj, (v, k) => {
        //忽略null的键值对
        if (v != null && (fields == null || fields.indexOf(k) > -1)) {
            res.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        }
    })
    return res.join('&')
}


export function parsePhpJSONValue(v) {
    if (v === 'true') return true
    else if (v === 'false') return false
    return v
}

export function JSONparse(s, defaultVal) {
    if (size(s) == 0) return defaultVal
    try {
        return JSON.parse(s)
    } catch (e) {
        return defaultVal
    }
}

export function getReqErrMsg(err, msg) {
    return get(err, "response.err_msg", msg)
}

export {
    regJqPostJSON, params, fetchJSON, fPostJSON, fGetJSON
}


