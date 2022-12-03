import React from "react";
import loading from "../Assets/loading.svg";

const Loading = () => (
  <div className="App-spinner">
    <img src={loading} alt="Loading" />
  </div>
);

export default Loading;