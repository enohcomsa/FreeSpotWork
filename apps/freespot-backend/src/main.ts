import "dotenv/config";
import express from "express";
import path from "path";
import apiV1 from "./routes";
import { errorHandler } from "./middlewares/error";
import { connectToDatabase } from "./db";
import { setupSwagger } from "./swagger";

async function bootstrap() {
  const app = express();

  app.use(express.json());
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
