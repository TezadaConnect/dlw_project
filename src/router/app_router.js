import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginView from "../views/auth/login_view";

const AppRouter = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginView />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default AppRouter;
