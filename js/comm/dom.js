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