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

function params(obj) {
    let res = []
    _.forEach(obj, (v, k) => {
        //忽略null的键值对
        if (v != null) {
            res.push(`${k}=${encodeURIComponent(v)}`)
        }
    })
    return res.join('&')
}

export {
    regJqPostJSON, params, fetchJSON, fPostJSON, fGetJSON,
}


