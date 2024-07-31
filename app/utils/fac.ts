"use client";

import { store } from "@/store";
import { PaymentResponse, ResolveData, HtmlData } from "../types";
import { addConfirmationLog, getOrderId, getPaymentGateway, processCard } from "../api/api-calls";
import { setOrderId } from "@/store/appSlice";
import { BASE_URL, IS_PAYMENT_MODAL, PRIVATE_AESKEY } from "./commonConstants";
import { encryptCardDetails } from "./commonFunctions";

export let facProcess3DSPayment: any;

if (IS_PAYMENT_MODAL === "iframe" as any) {
  facProcess3DSPayment = async (HtmlData: any, sessionId: string) => {
    return new Promise((resolve, reject) => {
      const paymentGatewayDetail = getPaymentGateway(sessionId);

      console.log(`${BASE_URL}getpaymentgateway :`, paymentGatewayDetail)

      let redirecturl2 = paymentGatewayDetail;
      //  https://nigeria.reliablesoftjm.com/VIPERWS/powertranzcallback

      let width = 900;
      let height = 600;

      let left = window.outerWidth / 2 + window.screenX - width / 2;
      let top = window.outerHeight / 2 + window.screenY - height / 2;

      let paymentWindow: any = window.open("", "_blank", "width=" + width + "height=" + height + " top=" + top + " left=" + left);

      if (!paymentWindow) {
        paymentWindow.close();
        resolve({
          success: false,
          statusMessage: "browserPopingError",
          data: {},
        });
      }

      paymentWindow.document.write(
        `<div style="margin: auto; width: 50%; border: 1px solid #EEE; padding: 10px; border-radius: 10px;right: 50%; bottom: 50%;transform: translate(50%,50%);position: absolute;"><p style="text-align: center;"><span style="font-weight: bold; font-size: 1.2em;">${"waitMessage"} </span><br/>${"paymentProcessingError"}</p>`
      );
      paymentWindow.document.write(HtmlData);

      let paymentInterval = setInterval(function () {
        if (paymentWindow.closed) {
          clearInterval(paymentInterval);
          resolve({
            success: false,
            windowClosed: true,
            statusMessage: "windowClosedError",
            data: {},
          });
        }
      }, 2000);

      window.addEventListener(
        "message",
        function (ev) {
          let postData = ev.data;
          let responseData: PaymentResponse;
          if (postData.originUrl === redirecturl2) {
            if (postData.ResponseCode === 1) {
              clearInterval(paymentInterval);
              responseData = {
                responsecode: postData.ResponseCode,
                authorizationnumber: postData.AuthCode,
                originalresponsecode: postData.OriginalResponseCode,
                cardnumber: postData.PaddedCardNo,
                referencenumber: postData.ReferenceNo,
                reasoncode: postData.ReasonCode,
                reasoncodedescription: postData.ReasonCodeDesc,
              };
              paymentWindow.close();
              window.removeEventListener("message", function (ev) { });
              resolve({
                success: true,
                statusMessage: "Success",
                data: responseData,
              });
            } else {
              clearInterval(paymentInterval);
              window.removeEventListener("message", function (ev) { });

              paymentWindow.close();

              responseData = {
                responsecode: postData.ResponseCode,
                authorizationnumber: postData.AuthCode,
                originalresponsecode: postData.OriginalResponseCode,
                cardnumber: postData.PaddedCardNo,
                referencenumber: postData.ReferenceNo,
                reasoncode: postData.ReasonCode,
                reasoncodedescription: postData.ReasonCodeDesc,
              };

              resolve({
                success: false,
                statusMessage: responseData.reasoncodedescription,
                data: responseData,
              });
            }
          }
        },
        false
      );
    });
  };
} else {
  facProcess3DSPayment = async ( HtmlData: HtmlData, sessionId: string ): Promise<ResolveData> => {
    return new Promise((resolve, reject) => {
      const paymentGatewayDetail = getPaymentGateway(sessionId);
      const redirecturl2 = paymentGatewayDetail;

      const modal = document.createElement("div");
      modal.classList.add("modal", "fade");
      modal.id = "myModal";
      modal.role = "dialog";
      modal.style.zIndex = "19999";
      modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header justify-content-end py-0">
                  <button type="button" class="close btn" aria-label="Close">
                    <span aria-hidden="true" class="fs-4">×</span>
                  </button>
                </div>
                <div class="modal-body" style="height:400px; display:flex; justify-content:center; align-items:center">
                  <div id="loading_screen">
                    <div id="loader" class="p-3" style="height:100%; width:100%">
                      <div class="loader mx-auto"></div>
                    </div>
                    <h4 id="message" class="text-center lh-base ">
                      ${"waitMessage"} <br />${"paymentProcessingError"}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          `;

      const appElement = document.querySelector(".App");
      if (appElement) {
        appElement.appendChild(modal);
      } else {
        console.error("No elements found with class 'App'");
        reject(new Error("No elements found with class 'App'"));
        return;
      }

      modal.style.display = "block";
      modal.classList.add("show");

      const iframe = document.createElement("iframe");
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.srcdoc = HtmlData;
      iframe.style.display = "none";

      let i = 0;
      iframe.addEventListener("load", () => {
        if (i === 1) {
          const screen = document.getElementById("loading_screen");
          if (screen) {
            screen.remove();
          }
          iframe.style.display = "block";
        }
        i++;
      });

      modal.querySelector(".modal-body")?.appendChild(iframe);

      const closeModal = () => {
        modal.remove();
      };

      modal.querySelector(".close.btn")?.addEventListener("click", closeModal);

      let paymentInterval: any;

      const handleMessage = (ev: MessageEvent) => {
        const postData = ev.data;
        if (postData.originUrl === redirecturl2) {
          clearInterval(paymentInterval);

          const responseData: PaymentResponse = {
            responsecode: postData.ResponseCode,
            authorizationnumber: postData.AuthCode,
            originalresponsecode: postData.OriginalResponseCode,
            cardnumber: postData.PaddedCardNo,
            referencenumber: postData.ReferenceNo,
            reasoncode: postData.ReasonCode,
            reasoncodedescription: postData.ReasonCodeDesc,
          };

          closeModal();
          window.removeEventListener("message", handleMessage);

          resolve({
            success: postData.ResponseCode === 1,
            statusMessage:
              postData.ResponseCode === 1
                ? "Success"
                : responseData.reasoncodedescription,
            data: responseData,
          });
        }
      };

      window.addEventListener("message", handleMessage);

      const checkModalClose = setInterval(() => {
        if (!document.body.contains(modal)) {
          clearInterval(checkModalClose);
          resolve({
            success: false,
            statusMessage: "windowClosedError",
            data: {},
          });
        }
      }, 2000);
    });
  };
}

export function closeModal() {
  const modal = document.getElementById("myModal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("show");
    modal.remove();
  }
}

export const processCreditCardPayment = async (paymentData: any, getSessionData: string, getcartitemIdData: number) => {

  try {
    const orderIdResult = await getOrderId(getSessionData);
    console.log(`request for ${BASE_URL}getorderid :`, orderIdResult?.request);
    console.log(`response for ${BASE_URL}getorderid :`, orderIdResult?.response);

    const orderIdDataVar = await orderIdResult?.response.data.orderid;

    store.dispatch(setOrderId(orderIdDataVar));

    let encryptedCardDetails = encryptCardDetails(
      paymentData?.cardholderDetails,
      PRIVATE_AESKEY
    );

    if (
      !orderIdResult ||
      orderIdResult.response.data.orderid === "" ||
      orderIdResult.response.data.orderid === null ||
      orderIdResult.response.status !== 0
    ) {
      orderIdResult?.response.statusMessage &&
        console.error("error", orderIdResult.response.statusMessage);
    } else {

      const dataAddconfirmation = {
        sessionid: getSessionData,
        cardId: getcartitemIdData,
        orderId: orderIdDataVar,
      }

      const addconfirmationDataResult = await addConfirmationLog(dataAddconfirmation);

      console.log(`request for ${BASE_URL}addconfirmationlog`, addconfirmationDataResult?.request)
      console.log(`response for ${BASE_URL}addconfirmationlog`, addconfirmationDataResult?.response)


      const processCardRequest = {
        orderid: orderIdDataVar,
        actiontype: "CHARGECARD",
        creditcard: {
          cardtype: paymentData.cardholderDetails.cardType,
          cardnumber: encryptedCardDetails?.cardNumber,
          cardholder: encryptedCardDetails?.cardHolderName,
          expirydate: encryptedCardDetails?.expiryDate,
          cvv: encryptedCardDetails?.cvv,
          // amount: paymentData.amount,
          amount: 50,
          iv: encryptedCardDetails?.iv,
        },
      };

      const processCardResult = await processCard(
        processCardRequest as any,
        getSessionData as string
      );

      console.log(`request for ${BASE_URL}processcard :`, processCardResult?.request)
      console.log(`response for ${BASE_URL}processcard :`, processCardResult?.response)

      if (processCardResult?.response.status === 0) {
        let facResponse;
        if (processCardResult.response.data?.html) {
          facResponse = await facProcess3DSPayment(
            processCardResult.response?.data.html
          );
        } else {
          facResponse = processCardResult;
          facResponse.response.data.orderid = setOrderId;
        }
        if (
          facResponse.data?.authorizationnumber &&
          facResponse.data.authorizationnumber !== ""
        ) {
          return facResponse;
        } else {
          if (!facResponse.windowClosed) {
            await console.error("error", facResponse?.statusMessage);
          }
          return processCardResult;
        }
      } else {
        await console.error("error", processCardResult?.response?.statusMessage);
        return processCardResult;
      }
    }
  } catch (e) {
    console.error("Error :", e);
  }
};