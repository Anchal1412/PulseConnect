import { useState, useEffect } from "react";

const useToken = () => {
  const getToken = () => {
    try {
      const data = localStorage.getItem("data");
      return data ? JSON.parse(data).token : null;
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState(getToken);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getToken());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { token };
};

export default useToken;