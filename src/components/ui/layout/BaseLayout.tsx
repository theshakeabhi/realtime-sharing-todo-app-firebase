import { Outlet } from "react-router";
import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import Logo from "../../assets/logo.svg";

export default function BaseLayout() {
  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "background.paper",
          color: "black",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={Logo} width={24} height={24} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                ml: 1,
                fontWeight: 700,
                display: { xs: "none", sm: "block" },
              }}
            >
              TODO
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          px: "260px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
