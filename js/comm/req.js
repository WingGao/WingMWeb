/**
 * Created by gaoyunyun on 2017/5/17.
 */

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

export {
    regJqPostJSON,
}


