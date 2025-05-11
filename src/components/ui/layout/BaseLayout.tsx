import { Outlet } from "react-router";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import Logo from "../../../assets/logo.svg";
import { Logout } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router";

export default function BaseLayout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

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
        <Toolbar sx={{ justifyContent: "space-between" }}>
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
          <Button
            color="error"
            startIcon={<SvgIcon component={Logout} />}
            onClick={handleSignOut}
          />
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "920px",
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
