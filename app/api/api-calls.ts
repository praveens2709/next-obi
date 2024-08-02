"use server";
import axios from "axios";
import { BASE_URL, createRequestBody } from '../utils/commonConstants';
import { PaymentGatewayResponse } from "@/types";

export async function login() {
  const body = {
    failstatus: 0,
    request: {
      username: 'esite3@viponline',
      password: '5f4dcc3b5aa765d61d8327deb882cf99',
      marketid: 'JAM',
      languageid: 'en'
    }
  };

  console.log("Request for login:", body);

  try {
    const response = await axios.post(`${BASE_URL}/login`, body);
    console.log("Response from login:", response.data);
    return {
      request: body,
      response: response.data.status === 0
        ? {
            status: response.data.status,
            statusMessage: response.data.statusMessage,
            severity: 0,
            data: {
              username: "esite3@viponline",
              sessionid: response.data.data.sessionid,
              marketid: "JAM",
              languageid: "en",
            },
          }
        : {
            status: response.data.status,
            statusMessage: response.data.statusMessage,
          }
    };
  } catch (error) {
    console.error("Error during login:", error);
  }
}

export async function getSchedule(sessionId: string) {
  const res = {
    airportid: "SIA",
    direction: "A",
    traveldate: "20240809",
  };

  const body = createRequestBody(sessionId, res);
  console.log("Request for getSchedule:", body);

  try {
    const response = await axios.post(`${BASE_URL}/getschedule`, body);
    console.log("Response from getSchedule:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
      }
    };
  } catch (error) {
    console.error("Error during getSchedule:", error);
  }
}

export async function reserveCartItem(sessionId: string) {
  const data = {
    cartitemid: 0,
    productid: "ARRIVALONLY",
    ticketsrequested: 1,
    adulttickets: 1,
    childtickets: 0,
    paymenttype: "GUESTCARD",
    distributorid: "",
  };

  const res = {
    ...data,
    productid: "ARRIVALONLY",
    arrivalscheduleid: 448200,
    departurescheduleid: 0,
  };

  const body = createRequestBody(sessionId, res);
  console.log("Request for reserveCartItem:", body);

  try {
    const response = await axios.post(`${BASE_URL}/reservecartitem`, body);
    console.log("Response from reserveCartItem:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
        cartitemid: response.data.data.cartitemid,
      }
    };
  } catch (error) {
    console.error("Error during reserveCartItem:", error);
  }
}

export async function setContact(sessionId: string, cartitemId: number) {
  const data = {
    cartitemid: cartitemId,
    email: "praveen1892293@gmail.com",
    firstname: "Praveen",
    lastname: "Sharma",
    phone: "06376135858",
    title: "MR",
  };

  const res = {
    contact: data,
  };

  const body = createRequestBody(sessionId, res);
  console.log("Request for setContact:", body);

  try {
    const response = await axios.post(`${BASE_URL}/setcontact`, body);
    console.log("Response from setContact:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
        data: {
          contact: {
            cartitemid: response.data.data.contact.cartitemid,
          }
        }
      }
    };
  } catch (error) {
    console.error("Error during setContact:", error);
  }
}

export async function getOrderId(sessionId: string) {
  const res = {
    amount: 50,
    source: "OBI-MAIN",
  };

  const body = createRequestBody(sessionId, res);
  console.log("Request for getOrderId:", body);

  try {
    const response = await axios.post(`${BASE_URL}/getorderid`, body);
    console.log("Response from getOrderId:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
        data: {
          orderid: response.data.data.orderid,
        }
      }
    };
  } catch (error) {
    console.error("Error during getOrderId:", error);
  }
}

export async function addConfirmationLog(dataAddconfirmation: any) {
  const sessionId = dataAddconfirmation.sessionid;
  const cartitemId = dataAddconfirmation.cartItemId;
  const orderIdData = dataAddconfirmation.orderId;

  const request = {
    distributorid: "",
    sendconfirmation: {
      sendto: "praveen1892293@gmail.com",
      copyto: "",
    },
    cart: [
      {
        cartitemid: cartitemId,
        productid: "ARRIVALONLY",
        referencenumber: "",
        groupid: "NA",
        groupbooking: "N",
        arrivalscheduleid: 448200,
        departurescheduleid: 0,
        adulttickets: 1,
        childtickets: 0,
        infanttickets: 0,
        optional: {
          occasioncomment: "",
          paddlename: "Praveen Sharma",
        },
        passengers: [
          {
            passengertype: "ADULT",
            title: "MR",
            firstname: "Praveen",
            lastname: "Sharma",
            email: "praveen1892293@gmail.com",
            phone: "06376135858",
            dob: "",
          },
        ],
        primarycontact: {
          title: "MR",
          firstname: "Praveen",
          lastname: "Sharma",
          email: "praveen1892293@gmail.com",
          phone: "06376135858",
        },
        secondarycontact: {
          title: "MR",
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
        },
        amount: 50,
      },
    ],
    payment: {
      paymenttype: "GUESTCARD",
      charged: "Y",
      creditcard: {
        cardtype: "VISA",
        cardnumber: "1111",
        cardholder: "Praveen Sharma",
        email: "praveen1892293@gmail.com",
        currency: "USD",
        amount: 50,
        authorizationnumber: 123456,
      },
    },
    affiliateid: "!",
    subaffiliateid: 0,
    httpreferrer: "",
    referrerid: "",
    orderid: orderIdData,
  };

  const body = createRequestBody(sessionId, request);
  console.log("Request for addConfirmationLog:", body);

  try {
    const response = await axios.post(`${BASE_URL}/addconfirmationlog`, body);
    console.log("Response from addConfirmationLog:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
      }
    };
  } catch (error) {
    console.error("Error during addConfirmationLog:", error);
  }
}

export async function processCard(processCardRequest: any, sessionId: string) {
  const body = createRequestBody(sessionId, processCardRequest);
  console.log("Request for processCard:", body);

  try {
    const response = await axios.post(`${BASE_URL}/processcard`, body);
    console.log("Response from processCard:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
        data: response.data.data,
      }
    };
  } catch (error) {
    console.error("Error during processCard:", error);
  }
}

export async function confirmCart(sessionId: string, cartitemId: number) {
  const request = {
    distributorid: "",
    sendconfirmation: {
      sendto: "praveen1892293@gmail.com",
      copyto: "",
    },
    cart: [
      {
        cartitemid: cartitemId,
        productid: "ARRIVALONLY",
        referencenumber: "",
        groupid: "NA",
        groupbooking: "N",
        arrivalscheduleid: 448200,
        departurescheduleid: 0,
        adulttickets: 1,
        childtickets: 0,
        infanttickets: 0,
        optional: {
          occasioncomment: "",
          paddlename: "Praveen Sharma",
        },
        passengers: [
          {
            passengertype: "ADULT",
            title: "MR",
            firstname: "Praveen",
            lastname: "Sharma",
            email: "praveen1892293@gmail.com",
            phone: "06376135858",
            dob: "",
          },
        ],
        primarycontact: {
          title: "MR",
          firstname: "Praveen",
          lastname: "Sharma",
          email: "praveen1892293@gmail.com",
          phone: "06376135858",
        },
        secondarycontact: {
          title: "MR",
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
        },
        amount: 50,
      },
    ],
    payment: {
      paymenttype: "GUESTCARD",
      charged: "Y",
      creditcard: {
        cardtype: "VISA",
        cardnumber: "1111",
        cardholder: "Praveen Sharma",
        email: "praveen1892293@gmail.com",
        currency: "USD",
        amount: 50,
        authorizationnumber: 123456,
      },
    },
    affiliateid: "!",
    subaffiliateid: 0,
    httpreferrer: "",
    referrerid: "",
    orderid: "12574",
  };

  const body = createRequestBody(sessionId, request);
  console.log("Request for confirmCart:", body);

  try {
    const response = await axios.post(`${BASE_URL}/confirmcart`, body);
    console.log("Response from confirmCart:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
      }
    };
  } catch (error) {
    console.error("Error during confirmCart:", error);
  }
}

export async function getPaymentGateway(sessionId: string): Promise<PaymentGatewayResponse | undefined> {
  const body = createRequestBody(sessionId, {});
  console.log("Request for getPaymentGateway:", body);

  try {
    const response = await axios.post(`${BASE_URL}/getpaymentgateway`, body);
    console.log("Response from getPaymentGateway:", response.data);
    return {
      request: body,
      response: {
        username: response.data.username,
        sessionid: response.data.sessionid,
        status: response.data.status,
        statusMessage: response.data.statusMessage,
        severity: response.data.severity,
        redirecturl2: response.data.data.redirecturl2,
      },
    };
  } catch (error) {
    console.error("Error during getPaymentGateway:", error);
    return undefined;
  }
}