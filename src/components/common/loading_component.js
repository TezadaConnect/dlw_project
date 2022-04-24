import React from "react";
import ReactLoading from "react-loading";

const LoadingComponent = () => {
  return (
    <React.Fragment>
      <div className="bg-opacity-10 bg-black w-full h-full flex justify-center items-center fixed top-0">
        <ReactLoading
          type={"spinningBubbles"}
          color={"black"}
          height={50}
          width={50}
        />
      </div>
    </React.Fragment>
  );
};

export default LoadingComponent;
