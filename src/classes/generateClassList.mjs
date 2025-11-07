// mkClassList.mjs
// Generates or updates nodeTypes.json based on implemented DcNode subclasses

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- configuration ---
const sourceDir = "./"; // adjust if your classes live elsewhere
const nodeTypesPath = path.resolve("../assets/nodes/nodeTypes-new.json");
const search = 'import { DcNode } from "./DcNode"';
const thumbDir = "/img/widgets/";

// --- helpers ---
function loadJSON(filePath) {
    if (!fs.existsSync(filePath)) {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify({}, null, 4), "utf8");
        return {};
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
        console.warn(`Warning: Failed to parse JSON at ${filePath}, using empty object. Error: ${err.message}`);
        return {};
    }
}
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
}

// --- main logic ---
console.log("🔍 Scanning for DcNode-based classes...");

const nodeList = loadJSON(nodeTypesPath);
const files = fs.readdirSync(sourceDir);
const foundTypes = [];

for (const file of files) {
  if (!file.endsWith(".ts")) continue;
  const fullPath = path.join(sourceDir, file);
  const content = fs.readFileSync(fullPath, "utf8");

  if (content.includes(search)) {
    const tp = path.basename(file, ".ts").toLowerCase();
    foundTypes.push(tp);

    let meta = null;
    try {
      console.log("➡️ Processing:", file, fullPath);
      // Dynamically import file to get its exported classInfo
      const mod = await import(pathToFileURL(fullPath));
      meta = mod.meta || null;
    } catch (err) {
      console.warn("⚠️ Could not import classInfo from", file, err.message);
    }

    if (!meta) {
      // fallback defaults
      meta = {
        name: tp,
        group: "misc",
        consent: false,
        en: { label: tp, info: "Auto-generated entry" },
        de: { label: tp, info: "Automatisch erzeugt" },
        expert: false,
        exturl: false,
        backend: false
      };
    }

    // ensure thumbnail
    meta.thumb = meta.thumb || `${thumbDir}${tp}.png`;
    meta.implemented = true;
    nodeList[tp] = meta;
    console.log("✅ Added/updated:", tp);
  }
}

// mark unimplemented
for (const key of Object.keys(nodeList)) {
  if (!foundTypes.includes(key)) {
    nodeList[key].implemented = false;
  }
}

saveJSON(nodeTypesPath, nodeList);
console.log("🎉 nodeTypes.json updated.");