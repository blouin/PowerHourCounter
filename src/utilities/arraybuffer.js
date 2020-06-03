const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export const convertImagesForStore = async (imageFiles) => {
    let storeImages = [];
    for (let i = 0; i < imageFiles.length; i++) {
        const buffer = await imageFiles[i].arrayBuffer();
        storeImages.push('data:' + imageFiles[i].type + ';base64,' + arrayBufferToBase64(buffer));
    }
    return storeImages;
}