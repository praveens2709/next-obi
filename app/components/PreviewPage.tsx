"use client"
import { useRouter } from 'next/navigation';

const Preview = () => {
  const router = useRouter();

  const handleAgree = () => {
    router.push('/payment');
  };

  return (
    <div className='container d-flex justify-content-center align-items-center vh-100'>
      <div className='text-center'>
        <h1 className='text-secondary'>Booking Summary</h1>
        <button onClick={handleAgree} className='btn btn-secondary px-5'>Agree and Continue</button>
      </div>
    </div>
  );
};

export default Preview;
