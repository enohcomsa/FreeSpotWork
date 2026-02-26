import { execSync } from "child_process";
import * as path from "path";

const DEPLOYED = "https://freespotwork.onrender.com/openapi.json";
const LOCAL = "http://localhost:3333/openapi.json";

function pickOpenApiUrl(): string {
  try {
    execSync(`curl -fsS "${DEPLOYED}"`, { stdio: "ignore" });
    return DEPLOYED;
  } catch {
    return LOCAL;
  }
}

const OPENAPI_URL = pickOpenApiUrl();

const ROOT = process.env.INIT_CWD || process.cwd();
const OUT_LIB = path.join(ROOT, "libs", "_free-spot-client-api");
const OUT_DIR = path.join(OUT_LIB, "src");
const ADDITIONAL = [
  "ngVersion=20.3.3",
  "fileNaming=kebab-case",
  "stringEnums=true",
  "enumPropertyNaming=UPPERCASE",
  "serviceSuffix=HttpService",
  "modelSuffix=DTO",
  "providedIn=root",
  "useSingleRequestParameter=true"
].join(",");

console.log("▶ Generating Angular client from:", OPENAPI_URL);

execSync(`rm -rf "${OUT_DIR}"`, { stdio: "inherit" });
execSync(
  `npx openapi-generator-cli generate -i ${OPENAPI_URL} -g typescript-angular -o "${OUT_DIR}" --additional-properties=${ADDITIONAL} --global-property apis,models,supportingFiles,apiTests=false,modelTests=false --generate-alias-as-model`,
  { stdio: "inherit" }
);

console.log("✅ Done. Generated at libs/_free-spot-api-client/src");
