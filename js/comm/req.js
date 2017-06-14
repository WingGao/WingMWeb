import 'whatwg-fetch'

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

function fetchJSON(url, opts) {
    return fetch(url, opts).then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            return new Promise((resovle, reject) => {
                let error = new Error(response.statusText)
                response.json().then(eres => {
                    error.response = eres
                    reject(error)
                    // throw error
                })
            })
        }
    })
}

function fPostJSON(url, data, opts = {}) {
    let opt = _.merge({
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
            opt.body = params(data)
            opt.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
            break;
    }
    return fetchJSON(url, opt)
}

function fGetJSON(url, data, opts = {}) {
    if (!_.isNil(data)) {
        url += '?' + (_.isString(data) ? data : params(data))
    }
    return fetchJSON(url, _.merge({
        method: 'GET',
        credentials: 'same-origin',
    }, opts))
}
/**
 * 将对象转换为请求的params
 * @param {object} obj 要转换的对象
 * @param {array|object} fields 如果定义，则只处理该对象
 * @example
 * params({a:1, b:2, c:3}, {b:1})
 * // or params({a:1, b:2, c:3}, ['b'])
 * // return "a=1&c=3"
 */
function params(obj, fields) {
    let res = []
    if (fields != null && !_.isArray(fields)) {
        fields = _.keys(fields)
    }
    _.forEach(obj, (v, k) => {
        //忽略null的键值对
        if (_.size(v) > 0 && (fields == null || fields.indexOf(k) > -1)) {
            res.push(`${k}=${encodeURIComponent(v)}`)
        }
    })
    return res.join('&')
}

export {
    regJqPostJSON, params, fetchJSON, fPostJSON, fGetJSON,
}


