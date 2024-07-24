"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './components/Loading';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-white vh-100 d-flex justify-content-center align-items-center">
      <Loading isLoading={true} />
    </div>
  );
};

export default IndexPage;
