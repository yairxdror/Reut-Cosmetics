import fs from "node:fs";
import path from "node:path";

export async function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(await fs.promises.readFile(filePath, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
    return typeof fallback === "function" ? fallback() : structuredClone(fallback);
  }
}

export async function writeJsonFile(filePath, value) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, JSON.stringify(value, null, 2));
}
