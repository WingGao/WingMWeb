export const phoneReg = /^1[0-9]{10}$/

export function extname(url) {
    if (!url) {
        return '';
    }
    var temp = url.split('/');
    var filename = temp[temp.length - 1];
    var filenameWithoutSuffix = filename.split(/\#|\?/)[0];
    return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
};

export function isImageUrl(url) {
    var extension = extname(url);
    if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|bmp)$/.test(extension)) {
        return true;
    } else if (/^data:/.test(url)) {
        // other file types of base64
        return false;
    } else if (extension) {
        // other file types which have extension
        return false;
    }
    return true;
};
