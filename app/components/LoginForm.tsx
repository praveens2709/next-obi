"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSessionId } from "../store/appSlice";
import Loading from "./Loading";
import { login } from "@/api/api-calls";
import { BASE_URL } from "@/utils/commonConstants";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const handleChange = async () => {
    try {
      setLoadingData(true);
      const result = await login();

      console.log(`request for ${BASE_URL}/login:`, result?.request);
      console.log(`response for ${BASE_URL}login:`, result?.response);
  
      if (result?.response.status === 0) {
        const sessionId = result.response.data.sessionid;
        dispatch(setSessionId(sessionId));
        router.push("/home");
      } else {
        setLoginError("Login failed: No response data");
      }
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
            <button className="btn btn-primary rounded-1 px-5 mb-3" onClick={handleChange}
            style={{ backgroundColor: "#9f004f", border: "none" }}>
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
