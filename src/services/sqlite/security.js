import CryptoES from "crypto-es";
import * as CryptoJS from "crypto-js";

const EncriptService = {
    secret: "0934fa14-e523-4bd8-856c-d8feca027aa4",
    /**
     * 
     * @param {string} toEncrypt 
     */
    aesEncrypt: function (toEncrypt) {
        return CryptoES.AES.encrypt(toEncrypt,this.secret).toString();
    },
    /**
     * 
     * @param {string} toDecrypt 
     */
    aesDecrypt: function (toDecrypt) {
        return CryptoJS.AES.decrypt(toDecrypt, this.secret).toString(CryptoJS.enc.Utf8);
    }
}

export default EncriptService;