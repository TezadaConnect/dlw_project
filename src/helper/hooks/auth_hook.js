import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../../config/firebase_config";
import { setBusy, setRefresh } from "../../redux/slices/response_slice";
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
      .then(async (userRes) => {
        const QRY = collection(firestore, "users");
        const userInfo = await getDoc(doc(QRY, userRes?.uid));
        dispatch(
          setUser({
            id: userRes.uid,
            name: userRes.displayName,
            email: userRes.email,
            fname: userInfo?.data().fname,
            lname: userInfo?.data().lname,
            contact: userInfo?.data().contact,
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
      .then(async (userRes) => {
        const QRY = collection(firestore, "users");
        const userInfo = await getDoc(doc(QRY, userRes?.uid));
        dispatch(
          setUser({
            id: userRes.uid,
            name: userRes.displayName,
            email: userRes.email,
            fname: userInfo?.data().fname,
            lname: userInfo?.data().lname,
            contact: userInfo?.data().contact,
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

  const editProfile = async (values) => {
    dispatch(setBusy(true));
    await AuthService.editProfile(values)
      .then(async () => {
        showMessage({
          message: "New User",
          description: "Account Successfully Updated",
          type: "success",
          icon: "success",
        });

        dispatch(setBusy(false));

        next.goBack();
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
    dispatch(setRefresh());
  };

  const checkUser = () => {
    useEffect(async () => {
      if (user !== null) {
        next.reset({ index: 0, routes: [{ name: "Home" }] });
      }
    }, [user]);
  };

  const checkAgreement = () => {
    useEffect(async () => {
      dispatch(setBusy(true));
      await AuthService.readAgreement(user.id)
        .then((res) => {
          if (res === false) {
            next.reset({ index: 0, routes: [{ name: "Terms" }] });
          }
        })
        .catch((err) => {
          showMessage({
            message: "Action Denied",
            description: err.message,
            type: "danger",
            icon: "danger",
          });
        });
      dispatch(setBusy(false));
    }, []);
  };

  const agreedToTerms = async () => {
    if (user !== null) {
      await AuthService.modifyAgreement(user.id)
        .then(() => {
          showMessage({
            message: "Welcome",
            description: "Agreed to terms and agreement",
            type: "success",
            icon: "success",
          });
          next.reset({ index: 0, routes: [{ name: "Home" }] });
        })
        .catch((err) => {
          showMessage({
            message: "Action Denied",
            description: err.message,
            type: "danger",
            icon: "danger",
          });
        });
    }
  };

  return {
    login,
    signup,
    logout,
    checkUser,
    checkAgreement,
    agreedToTerms,
    editProfile,
  };
};

export default useAuthHook;
