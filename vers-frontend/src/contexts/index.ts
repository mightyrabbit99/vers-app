import * as React from "react";

export const initViewState = {
  viewWidth: 980,
};

export const ViewContext = React.createContext(initViewState);
