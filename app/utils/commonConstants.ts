export const BASE_URL = 'https://nigeriadev.reliablesoftjm.com/VIPERWS/';

export const SECRET_KEY = "MY_SECRET_KEY";

export const IS_PAYMENT_MODAL = "iframe";

export const PRIVATE_AESKEY = "pnFCdYBqZwtbOSKvi8WGKA==";

export const CUSTOMER_LOGIN = {
    username: "esite3@viponline",
    password: "5f4dcc3b5aa765d61d8327deb882cf99",
};

export const COMMON_BODY = {
    username: "esite3@viponline",
    failstatus: 0,
};

export function createRequestBody(sessionId:string, requestData:any) {
    return {
      ...COMMON_BODY,
      sessionid: sessionId,
      request: requestData,
    };
}