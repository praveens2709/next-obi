"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { AppDispatch, RootState } from "@/store";
import { processCreditCardPayment } from "@/utils/fac";
import { confirmCart } from "@/api/api-calls";
import Loading from "./Loading";
import { BASE_URL } from "@/utils/commonConstants";
import { fetchPaymentGateway } from "@/store/paymentSlice";

const PaymentForm = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const getSessionId = useSelector((state: RootState) => state.app.sessionId);
  const getCartItemId = useSelector((state: RootState) => state.app.cartItemId);
  const [submitOnClickDisable, setSubmitOnClickDisable] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const sessionId = useSelector((state: RootState) => state.app.sessionId);
  
  useEffect(() => {
    if (sessionId) {
      dispatch(fetchPaymentGateway(sessionId));
    }
  }, [sessionId, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "test@example.us",
      cardType: "VISA",
      cardNumber: "",
      cardMonth: "07",
      cardYear: "24",
      cvv: "",
    },
    onSubmit: (values) => {
      handleSubmit(values, "CREDITCARD");
    },
  });

  const handleSubmit = async (values: any, paymentType: string) => {
    setSubmitOnClickDisable(true);
    setLoadingData(true);

    try {
      let objPayment: { creditcard?: { cardnumber?: string; authorizationnumber?: number; amount?: number } } = {};
      let callConfirmCart = false;

      if (paymentType === "CREDITCARD") {
        const paymentData = {
          source: "OBI-MAIN",
          amount: 50,
          cardholderDetails: values,
        };

        const responseCC = await processCreditCardPayment(paymentData, getSessionId, Number(getCartItemId));
        objPayment = {
          creditcard: {
            cardnumber: responseCC?.data.cardnumber,
            authorizationnumber: responseCC?.data.authorizationnumber,
            amount: responseCC?.data.amount,
          },
        };

        if (objPayment.creditcard?.authorizationnumber) {
          callConfirmCart = true;
        }
      }

      if (callConfirmCart) {
        const result = await confirmCart(String(getSessionId), Number(getCartItemId));

        console.log(`request for ${BASE_URL}confirmCart`, result?.request);
        
        if (result?.response.status === 0) {
          console.log(`response for ${BASE_URL}confirmCart`, result?.response);
          router.push("/confirmation");
        } else {
          setLoginError(result?.response.statusMessage || "Error confirming cart");
        }
      }
    } catch (error) {
      setLoginError("An error occurred while processing payment.");
    } finally {
      setSubmitOnClickDisable(false);
      setLoadingData(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      {loadingData ? (
        <Loading isLoading={loadingData} />
      ) : (
        <>
          <div className="text-center mb-4">
            <h5 className="fw-normal">CARDHOLDER DETAILS</h5>
          </div>
          <div className="border shadow-lg rounded-3 p-4" style={{ width: "750px" }}>
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span>We Accept:</span>
                <div>
                  <img src="https://obi.reliablesoftjm.com/static/media/visa.98f3b2abd48214115a2419216a4f4ceb.svg" alt="Visa" className="me-2" width={50} />
                  <img src="https://obi.reliablesoftjm.com/static/media/mastercard.94176ffa711516513fc1dedd64c199c3.svg" alt="Mastercard" width={50} />
                </div>
              </div>
              <hr style={{ borderBottom: "3px solid #000" }} />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label>Cardholder Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Cardholder Name"
                    className="form-control"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.name && formik.errors.name ? <div className="text-danger">{formik.errors.name}</div> : null}
                </div>
                <div className="col">
                  <label>Cardholder Email <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Cardholder Email"
                      className="form-control"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label>Card Type <span className="text-danger">*</span></label>
                  <select
                    name="cardType"
                    className="form-select"
                    value={formik.values.cardType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  >
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                  </select>
                  {formik.touched.cardType && formik.errors.cardType ? <div className="text-danger">{formik.errors.cardType}</div> : null}
                </div>
                <div className="col">
                  <label>Card Number <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    className="form-control"
                    minLength={16}
                    maxLength={16}
                    value={formik.values.cardNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.cardNumber && formik.errors.cardNumber ? <div className="text-danger">{formik.errors.cardNumber}</div> : null}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-5 pe-0">
                  <label>Expiry Date <span className="text-danger">*</span></label>
                  <div className="d-flex">
                    <select
                      name="cardMonth"
                      className="form-select border-end-0 rounded-end-0"
                      value={formik.values.cardMonth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {formik.touched.cardMonth && formik.errors.cardMonth ? <div className="text-danger">{formik.errors.cardMonth}</div> : null}
                    <select
                      name="cardYear"
                      className="form-select rounded-start-0"
                      value={formik.values.cardYear}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={2024 + i} value={2024 + i}>
                          {2024 + i}
                        </option>
                      ))}
                    </select>
                    {formik.touched.cardYear && formik.errors.cardYear ? <div className="text-danger">{formik.errors.cardYear}</div> : null}
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="col-3">
                  <label>CVV <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="XXX"
                    className="form-control"
                    minLength={3}
                    maxLength={3}
                    value={formik.values.cvv}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.cvv && formik.errors.cvv ? <div className="text-danger">{formik.errors.cvv}</div> : null}
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  disabled={submitOnClickDisable}
                  className={`btn btn-primary rounded-1 ${submitOnClickDisable ? "disabled" : ""}`}
                  style={{ backgroundColor: "#9f004f", border: "none" }}
                >
                  SUBMIT
                </button>
              </div>
              {loginError && <div className="text-danger mt-3">{loginError}</div>}
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentForm;
