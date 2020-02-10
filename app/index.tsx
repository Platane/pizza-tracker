import "@pizza-tracker/polyfill/polyfill.flat";
import "@pizza-tracker/polyfill/polyfill.fromEntries";

import React from "react";
import { render } from "react-dom";
import { App } from "./components/App";

export const init = () => {
  const rootElement = document.getElementById("root");

  render(<App />, rootElement);
};

init();
