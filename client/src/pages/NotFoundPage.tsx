import { Box } from "@mui/material";
import { useRouteError } from "react-router-dom";

const NotFoundPage = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Box>
      <h1>Oops!</h1>
      <p>Something went wrong</p>
      <p> <i>{error.statusText || error.message}</i> </p>
    </Box>
  );
};

export default NotFoundPage;