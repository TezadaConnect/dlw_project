import React from "react";
import { CgSmartHomeWashMachine } from "react-icons/cg";

const ApplicationCardComponent = ({
  icon = <CgSmartHomeWashMachine size={200} />,
  title = "Services",
}) => {
  return (
    <React.Fragment>
      <div className="shadow-md p-5 border rounded cursor-pointer">
        <div>{icon}</div>
        <div className="font-bold text-2xl text-center">{title}</div>
      </div>
    </React.Fragment>
  );
};

export default ApplicationCardComponent;
