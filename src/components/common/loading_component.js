import React from "react";
import ReactLoading from "react-loading";

const LoadingComponent = () => {
  return (
    <React.Fragment>
      <div className="bg-loading-transparent w-screen h-screen flex justify-center items-center">
        <ReactLoading type={"spinningBubbles"} color={"black"} height={40} width={40} />
      </div>
    </React.Fragment>
  );
};

export default LoadingComponent;
