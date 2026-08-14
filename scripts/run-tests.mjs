import { readdirSync } from "node:fs";
import { delimiter, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const suite = process.argv[2] ?? "all";
const testRoot = resolve("tests");
const suiteDirectories =
  suite === "all" ? ["unit", "integration"] : [suite];

if (!suiteDirectories.every((name) => ["unit", "integration"].includes(name))) {
  console.error(`Unknown test suite: ${suite}`);
  process.exit(1);
}

const testFiles = suiteDirectories.flatMap((directory) =>
  readdirSync(join(testRoot, directory), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".test.ts"))
    .map((entry) => join(testRoot, directory, entry.name)),
);
const compiledModules = resolve("node_modules", "next", "dist", "compiled");
const nodePath = [compiledModules, process.env.NODE_PATH]
  .filter(Boolean)
  .join(delimiter);
const result = spawnSync(
  process.execPath,
  [
    "--conditions=react-server",
    "--import",
    "tsx",
    "--test",
    "--test-concurrency=1",
    ...testFiles,
  ],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_PATH: nodePath },
  },
);

process.exit(result.status ?? 1);
