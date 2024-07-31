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
        <h3 className="fw-normal text-uppercase mb-4">Payment and reservation complete</h3>
        <div className="border shadow-lg rounded-3 p-4" style={{ width: "1000px" }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT89acvfhVDnv-f3C_YA3TAWMIHCTP0B46ZQE7ge59tHOAGDdCXLC_mkj097IPTwz4Hs3U&usqp=CAU" alt="payment complete" width={80} className='mb-4 mt-3' />
          <p className="text-black mb-0">Thank you for your payment for the amount of <b>USD 50.00</b></p>
          <p>Your payment receipt will we sent to email address <a href='#'>test@example.us</a></p>
          <button className="btn btn-primary mt-3 rounded-1" onClick={handleReturnHome} style={{ backgroundColor: "#9f004f", border: "none" }}>
            RETURN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
