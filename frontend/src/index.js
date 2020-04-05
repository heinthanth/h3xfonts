// main react process
// load react view

import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./css/app.css";
import Main from "./view/Main";

ReactDOM.render(<Main />, document.getElementById("ui"));
