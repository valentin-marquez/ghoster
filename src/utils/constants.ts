// Path: src/utils/constants.ts
import * as vscode from "vscode";

export function getIgnoredDependencies(): string[] {
  const config = vscode.workspace.getConfiguration("ghoster");
  const userIgnoredDependencies: string[] = config.get("ignore") || [];
  return [...userIgnoredDependencies];
}
