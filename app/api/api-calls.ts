"use server";
import axios from "axios";
import { BASE_URL } from './api';

export async function login() {
  const CUSTOMER_LOGIN = {
    username: "esite3@viponline",
    password: "5f4dcc3b5aa765d61d8327deb882cf99",
  };
  const VIPER_CONST = {
    alwaysOnUsername: "esite3@viponline",
    alwaysOnSessionid: "00009223581026309436128527",
  };

  const body = {
    username: VIPER_CONST.alwaysOnUsername,
    sessionid: VIPER_CONST.alwaysOnSessionid,
    request: CUSTOMER_LOGIN,
  };

  try {
    const response = await axios.post(`${BASE_URL}/login`, body);
    console.log("Login data", response.data);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSchedule(sessionId: string) {
  const res = {
    airportid: "SIA",
    direction: "A",
    traveldate: "20240804",
  };

  const body = {
    username: "esite3@viponline",
    sessionid: sessionId,
    failstatus: 0,
    request: res,
  };

  try {
    const response = await axios.post(`${BASE_URL}/getschedule`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function reserveCartItem( sessionId: string) {
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
    arrivalscheduleid: 515150,
    departurescheduleid: 0,
  };

  const body = {
    username: "esite3@viponline",
    sessionid: sessionId,
    failstatus: 0,
    request: res,
  };

  try {
    const response = await axios.post(`${BASE_URL}/reservecartitem`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
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

  const body = {
    username: "esite3@viponline",
    sessionid: sessionId,
    failstatus: 0,
    request: res,
  };

  try {
    const response = await axios.post(`${BASE_URL}/setcontact`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrderId(sessionId: string) {
  const res = {
    amount: 50,
    source: "OBI-MAIN",
  };

  const body = {
    username: "esite3@viponline",
    sessionid: sessionId,
    failstatus: 0,
    request: res,
  };

  try {
    const response = await axios.post(`${BASE_URL}/getorderid`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function addConfirmationLog(
  sessionId: string,
  cartitemId: number,
  orderIdData: string
) {
  const body = {
    username: "esite3@viponline",
    sessionid: sessionId,
    failstatus: 0,
    request: {
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
          arrivalscheduleid: 515150,
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
    },
  };

  console.log("response", body);
  try {
    const response = await axios.post(`${BASE_URL}/addconfirmationlog`, body);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function processCard(sessionId: string, orderIdData: string) {
  const body = {
    username: "esite3@viponline",
    sessionid: sessionId,
    failstatus: 0,
    request: {
      orderid: orderIdData,
      actiontype: "CHARGECARD",
      creditcard: {
        cardtype: "VISA",
        cardnumber: "szJnJIvD0qin98Sdv6UBFutM/+Vat5yp3nNr8pL6XX0=",
        cardholder: "GA3PiAz65R+3K1o1dyxnhA==",
        expirydate: "UbPjQqDmoIDz3hG9SMrINg==",
        cvv: "r8YBGktz3r6q2vKKI8FAxA==",
        amount: 50,
        iv: "LOnnWpsjwGgro6koOObMpQ==",
      },
    },
  };

  console.log("response", body);
  try {
    const response = await axios.post(
      "https://nigeriadev.reliablesoftjm.com/VIPERWS/processcard",
      body
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function confirmCart(sessionId: string, cartitemId: number) {
    const body = {
      username: "esite3@viponline",
      sessionid: sessionId,
      failstatus: 0,
      request: {
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
            arrivalscheduleid: 515150,
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
            authorizationnumber: "123456",
          },
        },
        affiliateid: "!",
        subaffiliateid: 0,
        httpreferrer: "",
        referrerid: "",
      },
    };
  
    console.log("praveen", body);
    try {
      const response = await axios.post(`${BASE_URL}/confirmcart`, body);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
