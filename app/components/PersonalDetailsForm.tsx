'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { setContact } from '@/api/api-calls';
import Loading from './Loading';
import { BASE_URL } from '@/utils/commonConstants';

const PersonalDetailsForm = () => {
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const router = useRouter();
  const sessionId = useSelector((state: RootState) => state.app.sessionId);
  const cartItemId = useSelector((state: RootState) => state.app.cartItemId);

  const handleSubmit = async () => {
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    if (cartItemId === undefined) {
      setError('Cart Item ID is missing');
      return;
    }

    setLoadingData(true);
    try {
      const result = await setContact(sessionId, cartItemId);

      console.log(`request for ${BASE_URL}/setcontact:`, result?.request);

      if (result?.response.status === 0) {
        console.log(`response for ${BASE_URL}/setcontact:`, result.response);
        router.push('/preview');
      } else {
        setError(result?.response.error || 'Failed to set contact details');
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
            <h3 className="fw-normal mb-4 text-uppercase">Registration Details</h3>
            <button 
              type="button" 
              className="btn btn-primary rounded-1 px-5 mb-3 text-uppercase" 
              onClick={handleSubmit}
              style={{ backgroundColor: "#9f004f", border: "none" }}
            >
              Proceed to checkout
            </button>
            {error && <p className="text-danger">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
