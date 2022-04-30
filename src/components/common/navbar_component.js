import React from "react";
import { MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";
import useAuthHook, { useCheckLogin } from "../../helpers/hooks/useAuthHook";

const NavbarComponent = ({ title = "DLW SYSTEM" }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useAuthHook();
  useCheckLogin();
  return (
    <React.Fragment>
      <div className="flex flex-row justify-between py-4 px-5 shadow-md items-center">
        <div>
          <strong>{title}</strong>
        </div>
        <div className="flex flex-row gap-5 justify-center items-center">
          <p className="cursor-pointer hover:underline">{user?.name}</p>
          <span className="hover:text-gray-500" onClick={() => logout()}>
            <MdLogout size={25} />
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NavbarComponent;
