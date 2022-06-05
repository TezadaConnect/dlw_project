import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useCheckUser } from "../helpers/hooks/useAuthHook";
import { useGetProducts } from "../helpers/hooks/useStartDepHooks";
import AdminView from "../views/admin_view";

import ApplicationView from "../views/application_view";
import LoginView from "../views/auth_view/login_view";
import FourOFour from "../views/four_o_four_view";
import ManagementView from "../views/management_view";
import ServicesView from "../views/services_view";

const AppRouter = () => {
  useCheckUser();
  useGetProducts();
  return (
    <React.Fragment>
      <BrowserRouter basename="/dlw-admin">
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/home" element={<ApplicationView />} />
          <Route path="/services-page" element={<ServicesView />} />
          <Route path="/management-page" element={<ManagementView />} />
          <Route path="/admin-page" element={<AdminView />} />
          <Route path="*" element={<FourOFour />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default AppRouter;
