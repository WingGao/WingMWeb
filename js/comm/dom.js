export function wait_dom(selector) {
    return new Promise((resolve, reject) => {
        let inter = setInterval(() => {
            let ele = document.querySelector(selector)
            if (ele != null) {
                clearInterval(inter)
                resolve(ele)
            }
        }, 100)
    })
}

/**
 * 回退或者跳转到某个地方
 * @param defLocation
 */
export function goBackOrReplace(defLocation) {
    if (window.history.length > 0) {
        window.history.back()
    } else if (typeof defLocation === 'string') {
        window.location.replace(defLocation)
    }
}
