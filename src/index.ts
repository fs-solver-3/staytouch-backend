require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
import {
  authRegiser,
  authLogin,
  updateLocation,
  pagination,
  geoAreaUsers,
} from "./apiCtrls";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.post("/auth/register", authRegiser);
app.post("/auth/login", authLogin);
app.post("/update-location", updateLocation);
app.get("/pagination", pagination);
app.get("/geo-area-users", geoAreaUsers);
app.listen(port, () => {
  console.log(`API server running on port ${port}.`);
});
