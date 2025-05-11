import { CircularProgress, Box, Typography } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: "primary.main" }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          fontWeight: 500,
          color: "text.secondary",
          animation: "pulse 1.5s infinite",
          "@keyframes pulse": {
            "0%": { opacity: 0.6 },
            "50%": { opacity: 1 },
            "100%": { opacity: 0.6 },
          },
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
}
