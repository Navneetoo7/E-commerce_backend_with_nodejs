const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 4000;
app.use(cors());
//Connect to db
connectDB();

//define router and API
app.use(express.json({ extended: false }));
app.use("/api/users", require("./routers/userAPI"));
app.use("/api/products", require("./routers/productsAPI"));
app.use("/api/auth", require("./routers/authAPI"));
app.get("/", (req, res) => {
  res.status(200).send("My app running fine");
});
app.listen(PORT, () => {
  console.log(`server up ${PORT}`);
});
