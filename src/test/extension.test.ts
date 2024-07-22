import * as assert from "assert";
import * as vscode from "vscode";
import { Ghoster } from "../ghoster";

suite("Ghoster Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("should activate Ghoster extension", async () => {
    const extension = vscode.extensions.getExtension("yourpublisher.ghoster");
    assert.ok(extension, "Extension not found");

    await extension?.activate();
    assert.ok(extension.isActive, "Extension is not active");
  });

  test("should highlight unused dependencies", async () => {
    const ghoster = new Ghoster();

    // Simulate opening a package.json file
    const packageJsonUri = vscode.Uri.file("./package.json");
    const document = await vscode.workspace.openTextDocument(packageJsonUri);
    await vscode.window.showTextDocument(document);

    // Trigger the highlightUnusedDependencies command
    await ghoster.highlightUnusedDependencies();

    // Add assertions here to check if the unused dependencies are highlighted correctly
    // This may involve checking the decorations in the editor, etc.
  });
});
