import * as vscode from "vscode";

export interface ParsedDependencies {
  dependencies: string[];
}

export function parsePackageJson(content: string): ParsedDependencies {
  const packageJson = JSON.parse(content);
  const dependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
  return { dependencies };
}

export function getIgnoredDependencies(): string[] {
  const config = vscode.workspace.getConfiguration("ghoster");
  const userIgnoredDependencies: string[] = config.get("ignore") || [];
  return [...userIgnoredDependencies];
}
