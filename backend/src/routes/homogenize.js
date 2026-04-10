const express = require("express");
const router = express.Router();
const { homogenize } = require("../interpolation");
const History = require("../models/History");


router.post("/homogenize", async (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Se esperaba un array de registros" });
    }

    const result = homogenize(records);

    // Guardar en DB
    await History.create({ input: records, output: result });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;