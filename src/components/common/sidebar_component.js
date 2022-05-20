import React from "react";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarHeader,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SidebarComponent = ({ item = [], setItem }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { project } = useSelector((state) => state.response);
  return (
    <React.Fragment>
      <div style={{ width: "270px" }}></div>
      <ProSidebar className="h-full fixed">
        <SidebarHeader>
          <div className="text-xl font-bold p-4">{project?.app_name}</div>
        </SidebarHeader>

        <SidebarContent>
          {item.map((element, key) => {
            if (user?.role === "admin") {
              if (element?.label === "Cash Flow") {
                return null;
              }
            }
            return (
              <Menu key={key} iconShape="circle">
                <MenuItem
                  onClick={() => setItem(element.value)}
                  icon={element.icon}
                >
                  {element.label}
                </MenuItem>
              </Menu>
            );
          })}

          <Menu iconShape="circle">
            <MenuItem
              onClick={() => navigate("/home")}
              icon={<TiArrowBack size={20} />}
            >
              Back
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </React.Fragment>
  );
};

export default SidebarComponent;
