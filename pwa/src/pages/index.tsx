import * as React from "react";
import { getUser, isLoggedIn } from "../services/auth";
import Dashboard from "../templates/dashboard/Dashboard";
import { HeaderContext } from "../context/headerContext";

const IndexPage = () => {
  const [_, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    isLoggedIn() &&
      setHeader(<h1>Conductor</h1>);
  }, [isLoggedIn()]);

  return isLoggedIn() && <Dashboard />;
};

export default IndexPage;
