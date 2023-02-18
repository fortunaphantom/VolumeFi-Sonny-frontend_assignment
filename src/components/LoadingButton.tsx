import React from 'react';
import { ReactNode } from 'react';
import { RotatingLines } from 'react-loader-spinner';

interface ILoadingButtonProps {
  children: ReactNode;
  loading: boolean;
  valid: any;
  success: boolean;
  fail: boolean;
  onClick: () => void;
}

export default function LoadingButton({
  children,
  loading,
  valid,
  success,
  fail,
  onClick,
  ...other
}: ILoadingButtonProps) {
  return (
    <button
      className="loading-button"
      disabled={loading || !valid}
      type="submit"
      onClick={onClick}
      {...other}
    >
      {loading ? (
        <div className="flex justify-center">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="32"
            visible={true}
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
