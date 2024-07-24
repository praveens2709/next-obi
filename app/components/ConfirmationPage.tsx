"use client"
import { useRouter } from 'next/navigation';

const Confirmation = () => {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push('/home');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="text-secondary">Booking Confirmed</h1>
        <p className="text-black">Your booking has been successfully confirmed. Thank you!</p>
        <button className="btn btn-secondary mt-3" onClick={handleReturnHome}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
