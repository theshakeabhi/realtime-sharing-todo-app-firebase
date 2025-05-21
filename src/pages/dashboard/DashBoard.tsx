import React from "react";
import TaskPage from "../tasks/TaskPage";
import { Box, Typography } from "@mui/material";

const DashboardComp = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="h4">Your To Do Lists</Typography>
        <TaskPage />
      </Box>
    </>
  );
};

const Dashboard = React.memo(DashboardComp);
export default Dashboard;
