
let _loadedIds = [];
function getLoadId(url) {
    return url.replace(/\W/gi, '_');
}

function loadOne(url) {
    let promise = new Promise((resolve, reject) => {
        let sid = getLoadId(url);
        if (document.getElementById(sid) != null) {
            resolve(sid)
        } else {
            let script = null;
            if (url.indexOf('.css') > 0) {
                script = document.createElement('link');
                script.rel = 'stylesheet';
                script.href = url;
                script.id = sid;
            } else {
                script = document.createElement('script');
                script.src = url;
                script.id = sid;
            }
            script.onload = function () {
                resolve(sid)
            };
            script.onerror = () => reject(sid);

            document.head.appendChild(script);
            // _loadedIds.push(sid);
        }
    });
    return promise;
}
/**
 * 添加指定js/css
 * @param {string} urls 
 * @return {Promise} (sid)=>{}
 */
export function simpleLoad(urls) {
    if (Array.isArray(urls)) {
        return Promise.all(urls.map(loadOne))
    } else {
        return loadOne(urls)
    }
}
/**
 * 移除添加的脚本或样式
 * @param {string|array} ids
 */
export function removeLoad(urls) {
    function remove(url) {
        var id = getLoadId(url);
        var r = document.getElementById(id);
        if (r != null) r.parentNode.removeChild(r);
    }

    if (Array.isArray(urls)) {
        urls.map(remove)
    } else {
        remove(urls);
    }
}