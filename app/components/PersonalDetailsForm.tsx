"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { setContact } from "@/api/api-calls";
import Loading from "./Loading";
import { BASE_URL } from "@/api/api";

const PersonalDetailsForm = () => {
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const router = useRouter();
  const sessionId = useSelector((state: RootState) => state.session.sessionId);
  const cartItemId = useSelector((state: RootState) => state.cart.cartItemId);

  const handleSubmit = async () => {
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    setLoadingData(true);
    try {
      const response = await setContact(sessionId, cartItemId);

      if (response.status === 0) {
        console.log(`${BASE_URL}setcontact:`, response);
        router.push('/preview');
      } else {
        setError(response?.error || 'Failed to set contact details');
      }
    } catch (error) {
      console.error('Error setting contact details:', error);
      setError('Error setting contact details');
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
            <h1 className="text-secondary mb-4">Registration Details</h1>
            <button 
              type="button" 
              className="btn btn-secondary px-5 mb-3" 
              onClick={handleSubmit}
            >
              Next
            </button>
            {error && <p className="text-danger">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsForm;