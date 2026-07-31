import { execSync } from "child_process";
import fs from "node:fs";
import * as path from "path";

const OPENAPI_URL = "https://freespotwork.onrender.com/openapi.json";

const ROOT = process.env.INIT_CWD || process.cwd();
const OUT_LIB = path.join(ROOT, "libs", "_free-spot-client-api");
const OUT_DIR = path.join(OUT_LIB, "src");

const ADDITIONAL_PROPERTIES = [
  "ngVersion=22.0.7",
  "fileNaming=kebab-case",
  "stringEnums=true",
  "enumPropertyNaming=UPPERCASE",
  "serviceSuffix=HttpService",
  "modelSuffix=DTO",
  "providedIn=root",
  "useSingleRequestParameter=true",
].join(",");

const GENERATOR = [
  'npx openapi-generator-cli generate',
  `-i "${OPENAPI_URL}"`,
  "-g typescript-angular",
  `-o "${OUT_DIR}"`,
  `--additional-properties=${ADDITIONAL_PROPERTIES}`,
  "--global-property apis,models,supportingFiles,apiTests=false,modelTests=false",
  "--generate-alias-as-model",
].join(" ");

console.log(`▶ Generating Angular client from ${OPENAPI_URL}`);

fs.rmSync(OUT_DIR, {
  recursive: true,
  force: true,
});

try {
  execSync(GENERATOR, {
    stdio: "inherit",
  });
} catch {
  console.error(
    [
      "Failed to generate the Angular API client.",
      `Source: ${OPENAPI_URL}`,
      "Ensure the backend is running and the OpenAPI specification is available.",
    ].join("\n")
  );

  process.exit(1);
}

console.log("✅ Angular API client generated successfully.");
console.log(`📁 Output: ${OUT_DIR}`);
