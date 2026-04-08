import { useState, useEffect } from "react";
import { TokenPayload } from "../models/User";

const decodeTokenPayload = (token: string | null): TokenPayload | null => {
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );

    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
};

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
  const [payload, setPayload] = useState<TokenPayload | null>(
    decodeTokenPayload(getToken()),
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = getToken();
      setToken(newToken);
      setPayload(decodeTokenPayload(newToken));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { token, payload };
};

export default useToken;