import { useEffect, useState } from "react";
import api from "../redux/instance";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export const useGetProfile = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get("/user/me");
        const user = response.data.data;
        dispatch(setUser(user));
        setIsInitializing(false);
      } catch (error) {
        console.log(error.response);
        dispatch(setUser(null));
        setIsInitializing(false);
      }
    };

    initAuth();
  }, [dispatch]);
  return isInitializing;
};
