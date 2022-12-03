import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function LogInPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <>
    <button className="App-button2" onClick={() => loginWithRedirect()}>Log In</button>
    </>
  );
}

export default LogInPage;