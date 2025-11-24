const CryptoJs = require("crypto-js");

const key = 'recoMeKey';

export const Encrypt = (value) => {

    const encoded = CryptoJs.AES.encrypt(value,key).toString();

    const result = encodeURIComponent(encoded);

    return result;
};