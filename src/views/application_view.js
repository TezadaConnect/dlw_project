import React from "react";
import ApplicationCardComponent from "../components/common/application_card_component";
import NavbarComponent from "../components/common/navbar_component";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { RiAdminLine } from "react-icons/ri";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ApplicationView = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <NavbarComponent title="DLW SYSTEM APPLICATIONS" />

      <div className="flex lg:flex-row gap-4 mt-5 mx-5">
        {itemHolder?.map((item, key) => {
          return (
            <div
              key={key}
              className="transition delay-75 hover:scale-105"
              onClick={() => {
                navigate(item.route);
              }}
            >
              <ApplicationCardComponent title={item.title} icon={item.icon} />
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default ApplicationView;

const itemHolder = [
  {
    title: "Services",
    icon: <CgSmartHomeWashMachine size={200} />,
    route: "/services-page",
  },
  {
    title: "Management",
    icon: <MdOutlineManageAccounts size={200} />,
    route: "/management-page",
  },
  {
    title: "Administrator",
    icon: <RiAdminLine size={200} />,
    route: "/admin-page",
  },
];
