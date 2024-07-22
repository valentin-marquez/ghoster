// Path: src/extension.ts
import * as vscode from "vscode";
import { Ghoster } from "./ghoster";

export function activate(context: vscode.ExtensionContext) {
  console.log("Ghoster is now active!");

  const ghoster = new Ghoster();

  let disposable = vscode.commands.registerCommand("ghoster.highlightUnused", () => {
    ghoster.highlightUnusedDependencies();
  });

  context.subscriptions.push(disposable);

  vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
    if (document.fileName.endsWith("package.json")) {
      ghoster.highlightUnusedDependencies();
    }
  });

  vscode.window.onDidChangeActiveTextEditor((editor: vscode.TextEditor | undefined) => {
    if (editor && editor.document.fileName.endsWith("package.json")) {
      ghoster.highlightUnusedDependencies();
    }
  });
}

export function deactivate() {}
