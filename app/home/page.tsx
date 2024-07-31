"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { login } from "@/api/api-calls";
import { BASE_URL } from "@/utils/commonConstants";
import Loading from "@/components/Loading";

const HomePage = () => {
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleBookingNavigation = async () => {
    setLoadingData(true);
    setLoginError(null);

    try {
      const result = await login();
      console.log(`request for ${BASE_URL}login:`, result?.request);
      console.log(`response for ${BASE_URL}login:`, result?.response);
      router.push('/booking');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoginError(error.response?.data?.message || "An unexpected error occurred");
      } else {
        setLoginError("An unexpected error occurred");
      }
      setLoadingData(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {loadingData ? (
        <Loading isLoading={loadingData} />
      ) : (
        <div className="card p-2 bg-light" style={{ width: '20rem' }}>
          <button className="btn btn-primary w-100" style={{ backgroundColor: "#9f004f", border: "none" }} onClick={handleBookingNavigation} disabled={loadingData}>
            Book Arrival
          </button>
          <div className="card-body text-center">
            <img
              src="/images/image.jpg"
              height={220}
              width={320}
              className="card-img-top mb-3"
              alt="Placeholder"
            />
            <p className="card-text mb-4" style={{ fontSize: "14px" }}>
              Maximize your time in paradise; enjoy personalized escort services with preferential fast track through immigration and customs whilst you access Jamaica's premier arrival lounge where culture meets comfort.
            </p>
            <div className="border-top pt-2">View Prices</div>
            {loginError && <div className="alert alert-danger mt-3">{loginError}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
