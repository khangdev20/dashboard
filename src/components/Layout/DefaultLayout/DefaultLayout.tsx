import { Box, Toolbar } from "@mui/material";
import Header from "../../Header/Header";
import SiderBar from "../../Sider/SideBar";

const DefaultLayout = ({ children }: any) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: 1,
          width: { sm: `calc(100% - ${200}px)`, flexShrink: { sm: 0 } },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DefaultLayout;
