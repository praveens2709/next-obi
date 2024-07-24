import React from 'react';

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="d-flex align-items-center justify-content-center bg-white">
      <img
        src="https://i.pinimg.com/originals/c2/35/c7/c235c7dd9e7765960ffc41b3009d5368.gif"
        alt="Loading..." style={{width:"350px"}}
      />
    </div>
  );
};

export default Loading;
