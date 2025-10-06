const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors({
  origin: ["https://product-price-optimization-app-frontend.onrender.com"],
  methods: ["GET", "POST"],
}));
app.use(bodyParser.json());

const pythonCmd = process.platform === "win32" ? "python" : "python3";

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post("/predict", (req, res) => {
  const data = req.body.features; // expect an array like [actual_price, discount_percentage, rating, rating_count]
  if (!Array.isArray(data)) return res.status(400).json({ error: "features must be an array" });

  const pyCwd = path.join(__dirname, "python");
  const py = spawn(pythonCmd, ["predict.py", JSON.stringify(data)], { cwd: pyCwd });

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
  py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

  py.on("close", (code) => {
    if (code !== 0) {
      console.error("Python stderr:", stderr);
      return res.status(500).json({ error: "Python script failed", details: stderr.trim() });
    }
    try {
      const num = parseFloat(stdout.trim());
      console.log("Python STDOUT (Prediction):", stdout); // <<< ADD THIS
      if (isNaN(num)) throw new Error("Invalid numeric output from Python: " + stdout);
      res.json({ optimized_price: Number(num.toFixed(2)) });
    } catch (err) {
      res.status(500).json({ error: "Parsing error", details: err.message, raw: stdout });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
console.log("Initializing backend server...");
