import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  SvgIcon,
} from "@mui/material";

import AuthCover from "../../assets/auth-cover.png";
import Logo from "../../assets/logo.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type LocationState = {
  from?: {
    pathname: string;
  };
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as LocationState)?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
    } catch (error) {
      console.error(error);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
      localStorage.setItem("isLoggedIn", "true");
      navigate(from, { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: 2, // p-8 in Tailwind is 2rem (theme.spacing(8) = 2 * 8 = 16px)
          md: {
            width: "50%",
            padding: 3, // md:p-12 = 3rem
          },
          lg: {
            padding: 4, // lg:p-16 = 4rem
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ maxWidth: "400px", mx: "auto", width: "100%" }}>
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <img src={Logo} width={32} height={32} />
            <Typography
              variant="h5"
              component="h1"
              sx={{ ml: 1, fontWeight: 700 }}
            >
              TODO
            </Typography>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 4, fontWeight: 700 }}
          >
            Log in to Todo
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            sx={{
              py: 1.5,
              mb: 3,
              borderColor: "rgba(0,0,0,0.12)",
              color: "text.primary",
              "&:hover": {
                borderColor: "rgba(0,0,0,0.24)",
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
            disabled={loading}
          >
            Continue with Email
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", px: 1 }}>
              or
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={loading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <SvgIcon component={Visibility} />
                        ) : (
                          <SvgIcon component={VisibilityOff} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ textAlign: "right", mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ py: 1.5, mb: 2 }}
            >
              Log In
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                underline="hover"
                fontWeight={500}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Paper
        className="auth-image-container"
        sx={{
          borderRadius: 0,
          backgroundImage: `url(${AuthCover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          alignItems: "center",
          justifyContent: "center",
          display: {
            xs: "none",
            md: "block",
            lg: "flex",
          },
          width: "100%",
        }}
      />
    </Box>
  );
}
