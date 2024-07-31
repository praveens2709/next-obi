import CryptoJS from 'crypto-js';

function formatCreditCardExpiryFAC(cardMonth: any, cardYear: any) {
    let cardExpiry = cardMonth + cardYear?.slice(-2);
    return cardExpiry;
}

const base64ToWordArray = (base64: any) => {
    return CryptoJS.enc.Base64.parse(base64);
};

const wordArrayToBase64 = (wordArray: any) => {
    return CryptoJS.enc.Base64.stringify(wordArray);
};

const encryptData = (data: any, iv: any, key: any) => {
    const value = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), base64ToWordArray(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return value.ciphertext.toString(CryptoJS.enc.Base64)
}

export const encryptCardDetails = (cardholderDetails: any, key: any) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const cardNumber = encryptData(cardholderDetails?.cardNumber, iv, key);
    const cardHolderName = encryptData(cardholderDetails?.name, iv, key);
    const cvv = encryptData(cardholderDetails?.cvv, iv, key);
    const expiryDate = encryptData(formatCreditCardExpiryFAC(cardholderDetails?.cardMonth, cardholderDetails?.cardYear), iv, key);

    return {
        iv: wordArrayToBase64(iv),
        cardNumber: cardNumber,
        cardHolderName: cardHolderName,
        cvv: cvv,
        expiryDate: expiryDate,
    };
};
