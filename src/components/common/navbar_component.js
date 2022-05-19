import React from "react";
import { MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuthHook, { useCheckLogin } from "../../helpers/hooks/useAuthHook";
import { setUser } from "../../redux/slice/user_slice";

const NavbarComponent = ({ title = "DLW SYSTEM" }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useAuthHook();
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  useCheckLogin();
  return (
    <React.Fragment>
      <div className="flex flex-row justify-between py-4 px-5 shadow-md items-center">
        <div>
          <strong>{title}</strong>
        </div>
        <div className="flex flex-row gap-5 justify-center items-center">
          <p className="cursor-pointer hover:underline">{user?.name}</p>
          <span
            className="hover:text-gray-500"
            onClick={() => {
              logout();
              dispatch(setUser(null));
              nagivate("/", { replace: true });
            }}
          >
            <MdLogout size={25} />
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavbarComponent;
