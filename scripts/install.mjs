#!/usr/bin/env node

import {
  copyFileSync,
  cpSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const skillName = "taptap-maker-kit";
const supportedEditors = ["codex", "cursor", "claude", "gemini"];
const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let scope = "user";
let selectedEditor = "all";
let projectTarget = ".";
let force = false;

function usage() {
  console.log(`Usage: taptap-maker-kit [options]

Install ${skillName} for supported AI editors.

Options:
  --scope user|project        Install for the current user or one project.
                              Default: user
  --editor NAME               codex, cursor, claude, gemini, or all.
                              Default: all
  --target DIRECTORY          Project directory used with --scope project.
                              Default: current directory
  --force                     Replace an existing installation.
  -h, --help                  Show this help.`);
}

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function pathExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function removePath(path) {
  const stat = lstatSync(path);
  if (stat.isDirectory() && !stat.isSymbolicLink()) {
    rmSync(path, { recursive: true, force: true });
  } else {
    unlinkSync(path);
  }
}

const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  const value = args[index + 1];

  switch (argument) {
    case "--scope":
      if (!value) fail("--scope requires a value");
      scope = value;
      index += 1;
      break;
    case "--editor":
      if (!value) fail("--editor requires a value");
      selectedEditor = value;
      index += 1;
      break;
    case "--target":
      if (!value) fail("--target requires a directory");
      projectTarget = value;
      index += 1;
      break;
    case "--force":
      force = true;
      break;
    case "-h":
    case "--help":
      usage();
      process.exit(0);
      break;
    default:
      fail(`unknown option: ${argument}`);
  }
}

if (!["user", "project"].includes(scope)) {
  fail("--scope must be user or project");
}

if (selectedEditor !== "all" && !supportedEditors.includes(selectedEditor)) {
  fail("--editor must be codex, cursor, claude, gemini, or all");
}

try {
  readFileSync(join(sourceRoot, "SKILL.md"));
} catch {
  fail("SKILL.md was not found in the downloaded package");
}

const installRoot = scope === "user" ? homedir() : resolve(projectTarget);
if (scope === "project") {
  try {
    if (!statSync(installRoot).isDirectory()) throw new Error();
  } catch {
    fail(`project target does not exist or is not a directory: ${projectTarget}`);
  }
}

const editors = selectedEditor === "all" ? supportedEditors : [selectedEditor];
const destinations = editors.map((editor) => ({
  editor,
  path: join(installRoot, `.${editor}`, "skills", skillName),
}));

for (const destination of destinations) {
  if (pathExists(destination.path) && !force) {
    fail(`${destination.path} already exists; rerun with --force to replace it`);
  }
}

function stageInstallation(parent) {
  const stagedPath = join(
    parent,
    `.${skillName}.install-${process.pid}-${Date.now()}`,
  );

  mkdirSync(stagedPath);
  copyFileSync(join(sourceRoot, "SKILL.md"), join(stagedPath, "SKILL.md"));
  copyFileSync(join(sourceRoot, "LICENSE"), join(stagedPath, "LICENSE"));
  cpSync(join(sourceRoot, "references"), join(stagedPath, "references"), {
    recursive: true,
  });
  writeFileSync(
    join(stagedPath, ".taptap-maker-kit.json"),
    `${JSON.stringify({ installedBy: skillName }, null, 2)}\n`,
  );

  return stagedPath;
}

for (const destination of destinations) {
  const parent = dirname(destination.path);
  mkdirSync(parent, { recursive: true });

  const stagedPath = stageInstallation(parent);
  const backupPath = `${destination.path}.backup-${process.pid}`;
  const replacing = pathExists(destination.path);

  try {
    if (replacing) renameSync(destination.path, backupPath);
    renameSync(stagedPath, destination.path);
    if (replacing) removePath(backupPath);
  } catch (error) {
    if (pathExists(stagedPath)) removePath(stagedPath);
    if (pathExists(backupPath) && !pathExists(destination.path)) {
      renameSync(backupPath, destination.path);
    }
    throw error;
  }

  console.log(`Installed for ${destination.editor}: ${destination.path}`);
}
