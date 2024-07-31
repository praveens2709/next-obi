"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Preview = () => {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (agreed) {
      router.push('/payment');
    }
  };

  return (
    <div className='container d-flex flex-column justify-content-center align-items-center vh-100'>
      <div className='text-center'>
        <h3 className='mb-4 fw-normal text-uppercase'>Booking Summary</h3>
        
        <div className='form-check mb-3 d-flex align-items-center justify-content-center gap-2'>
          <input 
            className='form-check-input' 
            type='checkbox' 
            id='termsCheck' 
            onChange={() => setAgreed(!agreed)} 
          />
          <label className='form-check-label mb-0 mt-1' htmlFor='termsCheck'>
            I agree to the TERMS & CONDITIONS
          </label>
        </div>
        
        <h4 className='mb-4'>GRAND TOTAL: USD 50.00</h4>
        
        <button 
          onClick={handleAgree} 
          className='btn btn-primary px-5 text-uppercase rounded-1' 
          style={{ backgroundColor: "#9f004f", border: "none" }} 
          disabled={!agreed}
        >
          Make payment
        </button>
      </div>
    </div>
  );
};

export default Preview;
