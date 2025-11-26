const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const config = require("./config");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const routes = require("./routes");
const db = require("./models");

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// CORS configuration
app.use(
  cors({
    origin: config.cors.origin === "*" ? true : config.cors.origin,
    credentials: config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);


// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
    error: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1", limiter);

// Request timestamp middleware
app.use((req, res, next) => {
  req.timestamp = new Date().toISOString();
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/v1", routes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "School Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Management System API",
    version: "1.0.0",
    environment: config.server.env,
    timestamp: new Date().toISOString(),
    endpoints: {
      api: "/api/v1",
      health: "/api/health",
      auth: "/api/auth",
      staff: "/api/staff",
      role: "/api/role",
      students: "/api/student",
      permission: "/api/permission",
      section: "/api/section",
    },
  });
});

// 404 handler
app.use(notFound);
// Error handling middleware
app.use(errorHandler);


// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log("Database connection established successfully");

    // Sync database (create tables if they don't exist)
    if (config.server.env === "development") {
      await db.sequelize.sync({ alter: true });
      console.log("Database synchronized successfully");
    }

    // Start server
    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(
        `Server running on ${config.server.host}:${config.server.port}`
      );
      console.log(`Environment: ${config.server.env}`);
      console.log(
        `API Base URL: http://${config.server.host}:${config.server.port}/api/v1`
      );
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("HTTP server closed");

        try {
          await db.sequelize.close();
          console.log("Database connection closed");
          console.log("Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          console.error("Error during database shutdown:", error);
          process.exit(1);
        }
      });
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
