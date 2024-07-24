'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getSchedule, reserveCartItem } from '@/api/api-calls';
import Loading from './Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL } from '@/api/api';
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
      const response = await getSchedule(sessionId);
      if (response.status === 0) {
        console.log(`${BASE_URL}getschedule:`, response);
      } else {
        setError(response?.error || 'Failed to fetch schedule');
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
      const response = await reserveCartItem(sessionId);

      if (response.status === 0) {
        console.log(`${BASE_URL}reservecartitem:`, response);

        const cartItemId = response.data.cartitemid
        dispatch(setCartItemId(cartItemId))
        router.push('/personalDetails');
      } else {
        setError(response?.error || 'Failed to reserve cart item');
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
            <h1 className='pb-4 text-secondary'>Booking Form</h1>
            <form onSubmit={(e) => e.preventDefault()} className="mb-3 d-flex flex-column">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control mb-2"
                placeholderText="Select a date"
              />
              <button type="button" className="btn btn-secondary" onClick={handleSubmit}>
                Next
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
