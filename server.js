require("dotenv").config();
const express = require("express");
const { responseMiddleware } = require("./src/middlewares");
const routes = require("./src/routes");

const app = express();

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
