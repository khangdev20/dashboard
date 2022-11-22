import { Route, Routes } from "react-router-dom";
import { Fragment } from "react";
import Login from "./pages/auth/Login/Login";
import "./App.css";
import { publicRoutes } from "./routes/index";
import DefaultLayout from "./components/Layout/DefaultLayout/DefaultLayout";
import { SnackbarProvider } from "notistack";
import { Box } from "@mui/material";
import { useApi } from "./hooks/useApi";
import { REQUEST_TYPE } from "./Enums/RequestType";

function App() {
  const { callApi } = useApi();
  const getNewToken = () => {
    callApi<string>(REQUEST_TYPE.GET, "api/users/getNewToken")
      .then((res) => {
        const response = res.data;
        console.log(response);
        sessionStorage.setItem("jwt", response);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  setInterval(getNewToken, 27000000);

  return (
    <SnackbarProvider autoHideDuration={2000} maxSnack={6}>
      <Box>
        {sessionStorage.getItem("jwt") !== null ? (
          <Routes>
            {publicRoutes.map((route, key) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              const Page = route.component;
              return (
                <Route
                  key={key}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        ) : (
          <Login />
        )}
      </Box>
    </SnackbarProvider>
  );
}

export default App;
