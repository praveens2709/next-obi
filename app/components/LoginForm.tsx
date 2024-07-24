"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSessionId } from "../store/appSlice";
import Loading from "./Loading";
import { login } from "@/api/api-calls";
import { BASE_URL } from "@/api/api";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const handleChange = async () => {
    try {
      setLoadingData(true);
      const response = await login();
      console.log(`${BASE_URL}login:`, response);

      const sessionId = response.data.sessionid;
      dispatch(setSessionId(sessionId));

      router.push("/home");
    } catch (error) {
      setLoadingData(false);
      if (axios.isAxiosError(error)) {
        setLoginError(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } else {
        setLoginError("An unexpected error occurred");
      }
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
            <button className="btn btn-secondary px-5 mb-3" onClick={handleChange}>
              Login
            </button>
            {loginError && <p className="text-danger">{loginError}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
