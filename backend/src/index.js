const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const homogenizeRoutes = require("./routes/homogenize");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", homogenizeRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch(err => console.error("Error DB:", err));