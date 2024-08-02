'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getSchedule, reserveCartItem } from '@/api/api-calls';
import Loading from './Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '@/utils/commonConstants';
import { setCartItemId } from '@/store/appSlice';

const BookingForm = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const router = useRouter();
  const sessionId = useSelector((state: RootState) => state.app.sessionId);

  const handleDateChange = async (date: Date | null) => {
    setSelectedDate(date);

    if (!date) return;
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    try {
      setLoadingData(true);
      const result = await getSchedule(sessionId);

      console.log(`request for ${BASE_URL}/getschedule:`, result?.request);

      if (result?.response.status === 0) {
        console.log(`response for ${BASE_URL}/getschedule:`, result?.response);
      } else {
        setError('Failed to fetch schedule');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Error fetching schedule');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) {
      setError('Session ID is missing');
      return;
    }

    try {
      setLoadingData(true);
      const result = await reserveCartItem(sessionId);

      console.log(`request for ${BASE_URL}/reservecartitem:`, result?.request);

      if (result?.response.status === 0) {
        console.log(`response for ${BASE_URL}/reservecartitem:`, result?.response);

        const cartItemId = result.response?.cartitemid;
        if (cartItemId !== undefined) {
          dispatch(setCartItemId(cartItemId));
          router.push('/personalDetails');
        } else {
          setError('Cart item ID is missing');
        }
      } else {
        setError('Failed to reserve cart item');
      }
    } catch (error) {
      console.error('Error reserving cart item:', error);
      setError('Error reserving cart item');
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
            <h3 className='pb-4 fw-normal text-uppercase'>Booking Form</h3>
            <form onSubmit={(e) => e.preventDefault()} className="mb-3 d-flex flex-column">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control mb-2"
                placeholderText="Select a date"
              />
              <button type="button" className="btn btn-primary rounded-1 text-uppercase px-4" onClick={handleSubmit} style={{ backgroundColor: "#9f004f", border: "none" }}>
                Check Availability
              </button>
            </form>
            {error && <p className="text-danger">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
