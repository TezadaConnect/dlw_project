import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, collection } from "@firebase/firestore";
import { authentication, firestore } from "../../config/firebase_config";
import { useEffect } from "react";
import { setUser } from "../../redux/slice/user_slice";
import { useDispatch, useSelector } from "react-redux";
import { setBusy } from "../../redux/slice/response_slice";
import AuthService from "../../services/auth_service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const useAuthHook = () => {
  const MySwal = withReactContent(Swal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (values) => {
    dispatch(setBusy(true));
    await AuthService.login(values)
      .then((res) => {
        MySwal.fire({
          title: "Login Successfully",
          text: "Welcome to DLW Dashboard",
          timer: 5000,
          icon: "success",
          showConfirmButton: false,
        });
        dispatch(
          setUser({
            id: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
            role: res.role,
          })
        );
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        MySwal.fire({
          title: "Login Denied",
          text: err?.message,
          timer: 5000,
          icon: "error",
          confirmButtonColor: "#000",
        });
        return;
      });
    dispatch(setBusy(false));
  };

  const logout = () => {
    MySwal.fire({
      title: "Logout Successfully",
      text: "You logout successfully",
      timer: 3000,
      icon: "success",
      showConfirmButton: false,
    });
    AuthService.logout();
    dispatch(setUser(null));
  };

  return { login, logout };
};

export default useAuthHook;

export const useCheckUser = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getUser = () => {
    if (user === null) {
      onAuthStateChanged(authentication, async (currentUser) => {
        dispatch(setBusy(true));
        if (currentUser) {
          const userInfo = await getDoc(
            doc(collection(firestore, "users"), currentUser.uid)
          );
          if (userInfo.exists()) {
            if (userInfo.data().role !== "client") {
              dispatch(
                setUser({
                  id: currentUser.uid,
                  name: currentUser.displayName,
                  email: currentUser.email,
                  role: userInfo.data().role,
                })
              );
            }
          }
        }
        dispatch(setBusy(false));
      });
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useCheckLogin = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.id === null) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
