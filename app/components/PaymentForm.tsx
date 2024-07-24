"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import Loading from "./Loading";
import { addConfirmationLog, confirmCart, getOrderId, processCard } from "@/api/api-calls";
import { BASE_URL } from "@/api/api";
// import { setOrderId } from "@/store/appSlice";

const PaymentForm = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const sessionId = useSelector((state: RootState) => state.app.sessionId);
  const cartItemId = useSelector((state: RootState) => state.app.cartItemId);

  const handlePayment = async () => {
    if (!sessionId) {
      setPaymentError("Session ID is missing");
      return;
    }

    setLoadingData(true);
    try {
      const orderIdResponse = await getOrderId(sessionId);
      if (orderIdResponse.status === 0) {
        console.log(`${BASE_URL}/getorderid:`, orderIdResponse);
        const orderId = orderIdResponse.data.orderid;

        // dispatch(setOrderId(orderId));

        const addLogResponse = await addConfirmationLog(sessionId, cartItemId, orderId);
        if (addLogResponse.status === 0) {
          console.log(`${BASE_URL}/addconfirmationlog:`, addLogResponse);

          const processCardResponse = await processCard(sessionId, orderId);
          if (processCardResponse.status === 0) {
            console.log(`${BASE_URL}/processcard:`, processCardResponse);

            const confirmCartResponse = await confirmCart(sessionId, cartItemId);
            if (confirmCartResponse.status === 0) {
              console.log(`${BASE_URL}/confirmcart:`, confirmCartResponse);
              router.push("/confirmation");
            } else {
              setPaymentError("Failed to confirm cart");
            }
          } else {
            setPaymentError("Failed to process card");
          }
        } else {
          setPaymentError("Failed to add confirmation log");
        }
      } else {
        setPaymentError("Failed to get order ID");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Payment error occurred");
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        {loadingData ? (
          <Loading isLoading={loadingData} />
        ) : (
          <>
            <h1 className="text-secondary mb-4">Payment Details</h1>
            <button className="btn btn-secondary px-5 mb-3" onClick={handlePayment}>
              Submit Payment
            </button>
            {paymentError && <p className="text-danger">{paymentError}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
