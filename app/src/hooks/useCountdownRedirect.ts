import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCountdownRedirect = ({
  isSuccess,
  initialCountdown,
  url,
}: {
  isSuccess: boolean;
  initialCountdown: number;
  url: string;
}) => {
  const [countdown, setCountdown] = useState<number>(initialCountdown);
  const navigate = useNavigate();

  useEffect(() => {
    const shouldDisplayCountdown = isSuccess && countdown > 0;
    const shouldRedirect = isSuccess && countdown === 0;

    if (shouldDisplayCountdown) {
      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownTimer);
    }

    if (shouldRedirect) {
      navigate(url);
    }
  }, [isSuccess, countdown, navigate, url]);

  return countdown;
};
