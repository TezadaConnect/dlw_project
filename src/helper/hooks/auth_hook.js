import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { setBusy } from "../../redux/slices/response_slice";
import { setUser } from "../../redux/slices/user_slice";
import AuthService from "../../service/auth_service";

const useAuthHook = () => {
  const dispatch = useDispatch();
  const next = useNavigation();
  const { user } = useSelector((state) => state.user);

  const logout = async () => {
    dispatch(setBusy(true));
    await AuthService.logout();
    showMessage({
      message: "Logout",
      description: "Logout Successfully",
      type: "success",
      icon: "success",
    });
    dispatch(setUser(null));
    dispatch(setBusy(false));
    next.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const login = async (values) => {
    dispatch(setBusy(true));
    await AuthService.login(values)
      .then((userRes) => {
        dispatch(
          setUser({
            id: userRes.uid,
            name: userRes.displayName,
            email: userRes.email,
          })
        );
        showMessage({
          message: "Login",
          description: "Login Successfully",
          type: "success",
          icon: "success",
        });
        dispatch(setBusy(false));
        next.reset({ index: 0, routes: [{ name: "Home" }] });
      })
      .catch((err) => {
        showMessage({
          message: "Action Denied",
          description: err.message,
          type: "danger",
          icon: "danger",
        });
        dispatch(setBusy(false));
      });
  };

  const signup = async (values) => {
    dispatch(setBusy(true));
    await AuthService.register(values)
      .then((userRes) => {
        dispatch(
          setUser({
            id: userRes.uid,
            name: userRes.displayName,
            email: userRes.email,
          })
        );
        showMessage({
          message: "New User",
          description: "Account Successfully Created",
          type: "success",
          icon: "success",
        });
        dispatch(setBusy(false));
        next.reset({ index: 0, routes: [{ name: "Home" }] });
      })
      .catch((err) => {
        showMessage({
          message: "Action Denied",
          description: err.message,
          type: "danger",
          icon: "danger",
        });
        dispatch(setBusy(false));
      });
  };

  const checkUser = () => {
    useEffect(async () => {
      if (user !== null) {
        next.reset({ index: 0, routes: [{ name: "Home" }] });
      }
    }, [user]);
  };

  return { login, signup, logout, checkUser };
};

export default useAuthHook;
