const md5 = require('md5');

export function md5_16(msg) {
    let sum = md5(msg)
    //32位提取中间16位
    return sum.substr(8, 16)
}
