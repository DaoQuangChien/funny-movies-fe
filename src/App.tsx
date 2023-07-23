import { useContext, useEffect } from "react";
import { Route, Navigate, Routes, Outlet } from "react-router-dom";
import "./App.scss";
import { HeaderBar } from "./components";
import { Home, PostMovie } from "./containers";
import { AuthContext, getUserData, useAuthenActions } from "./store";
import { eAction } from "./types";

const PrivateRoute = () => {
  const { isSignIn } = useAuthenActions();

  return isSignIn ? <Outlet /> : <Navigate to="/" replace />;
};

const App = () => {
  const [, dispatch] = useContext(AuthContext)!;

  useEffect(() => {
    const userData = getUserData();

    if (userData) {
      dispatch({
        type: eAction.SIGN_IN,
        payload: {
          userData,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="app-container">
      <HeaderBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post-movie" element={<PrivateRoute />}>
          <Route path="" element={<PostMovie />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
