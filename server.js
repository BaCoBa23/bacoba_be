require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { responseMiddleware } = require("./src/middlewares");
const routes = require("./src/routes");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Gắn Response Middleware để dùng res.success và res.error
app.use(responseMiddleware);

app.use(routes);

// Xử lý 404 Route Not Found
app.use((req, res) => {
  res.error({ message: "API Endpoint Not Found", status: 404 });
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/api/v1/health`);
});
