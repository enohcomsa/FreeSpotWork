import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import apiV1 from "./routes";
import { errorHandler } from "./middlewares/error";
import { connectToDatabase } from "./db";
import { setupSwagger } from "./swagger";

async function bootstrap() {
  const app = express();
  app.set('trust proxy', 1);

  const allowedOrigins = ["http://localhost:4200"];
  app.use(
    cors({
      origin: allowedOrigins, // or a function if you need logic
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false, // only if you actually use cookies/credentials
      maxAge: 600, // cache preflight for 10 minutes
    })
  );
  app.options("*", cors());
  app.use(express.json({ type: ['application/json', 'application/merge-patch+json'] }));
  app.use("/assets", express.static(path.join(__dirname, "assets")));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.get("/api/v1", (_req, res) => {
    res.json({ ok: true, name: "FreeSpot API", version: "v1" });
  });
  app.use("/api/v1", apiV1);

  setupSwagger(app);

  app.use(errorHandler);

  try {
    await connectToDatabase();
    const port = Number(process.env.PORT) || 3333;
    app.listen(port, () => {
      console.log(`API at http://localhost:${port}/api/v1`);
      console.log(`Docs at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error("Failed to init DB", err);
    process.exit(1);
  }
}

void bootstrap();
