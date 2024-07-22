import * as vscode from "vscode";

export async function findFiles(): Promise<vscode.Uri[]> {
  return vscode.workspace.findFiles("{**/*.js,**/*.ts,**/*.jsx,**/*.tsx}", "**/node_modules/**");
}

export async function readFileContent(file: vscode.Uri): Promise<string> {
  const fileContent = await vscode.workspace.fs.readFile(file);
  return new TextDecoder("utf-8").decode(fileContent);
}
