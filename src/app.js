import React from "react";
import { useSelector } from "react-redux";
import LoadingComponent from "./components/common/loading_component";
import AppRouter from "./router/app_router";

const App = () => {
  const { loading } = useSelector((state) => state.response);
  return (
    <React.Fragment>
      {loading && <LoadingComponent />}
      <AppRouter />
    </React.Fragment>
  );
};

export default App;
