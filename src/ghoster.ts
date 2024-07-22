import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { parsePackageJson, ParsedDependencies } from "./parsers/package";
import { ParserFactory } from "./parsers/factory";
import { findFiles, readFileContent } from "./utils/files";
import { highlightUnusedDependencies, createDecorationTypes, clearDecorations } from "./utils/decoration";
import { getIgnoredDependencies } from "./utils/constants";
import { DependencyTree, ImportData } from "./utils/dependency-tree";

export class Ghoster {
  private packageJsonPath: string | undefined;
  private dependencyTree = new DependencyTree();
  private watcher!: vscode.FileSystemWatcher;
  private debounceTimer: NodeJS.Timeout | null = null;
  private packageJsonDependencies: string[] = [];
  private ignoredPatterns: RegExp[] = [];

  constructor() {
    createDecorationTypes();
    this.setupFileWatcher();
    this.initialScan();
  }

  private setupFileWatcher() {
    this.watcher = vscode.workspace.createFileSystemWatcher("**/*.{js,ts,jsx,tsx,json}", false, false, false);

    this.watcher.onDidChange(this.debounceFileChange.bind(this));
    this.watcher.onDidCreate(this.debounceFileChange.bind(this));
    this.watcher.onDidDelete(this.handleFileDelete.bind(this));
  }

  private debounceFileChange(uri: vscode.Uri) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => this.handleFileChange(uri), 500);
  }

  private async handleFileChange(uri: vscode.Uri) {
    console.log(`File changed: ${uri.fsPath}`);
    if (uri.fsPath === this.packageJsonPath) {
      await this.updatePackageJsonDependencies();
    } else if (path.basename(uri.fsPath) === ".gitignore") {
      await this.updateIgnoredPatterns();
    } else {
      const content = await readFileContent(uri);
      const imports = await this.parseFile(content, uri.fsPath);
      this.dependencyTree.setImports(uri.fsPath, imports);
    }
    this.updateDecorations();
  }

  private handleFileDelete(uri: vscode.Uri) {
    console.log(`File deleted: ${uri.fsPath}`);
    this.dependencyTree.removeImports(uri.fsPath);
    this.updateDecorations();
  }

  private async initialScan() {
    const packageJson = await this.getPackageJson();
    if (!packageJson) {
      vscode.window.showErrorMessage("No package.json found in the workspace");
      return;
    }

    await this.updatePackageJsonDependencies();
    await this.updateIgnoredPatterns();

    const files = await findFiles();
    await Promise.all(
      files.map(async (file) => {
        if (!this.shouldIgnoreFile(file.fsPath)) {
          const content = await readFileContent(file);
          const imports = await this.parseFile(content, file.fsPath);
          this.dependencyTree.setImports(file.fsPath, imports);
        }
      })
    );

    this.updateDecorations();
  }

  private async updatePackageJsonDependencies() {
    if (!this.packageJsonPath) {
      return;
    }

    const packageJsonContent = await readFileContent(vscode.Uri.file(this.packageJsonPath));
    const { dependencies } = parsePackageJson(packageJsonContent);
    this.packageJsonDependencies = dependencies;
  }

  private async updateIgnoredPatterns() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return;
    }

    const gitignorePath = path.join(workspaceFolders[0].uri.fsPath, ".gitignore");

    try {
      const gitignoreContent = await fs.promises.readFile(gitignorePath, "utf8");
      this.ignoredPatterns = gitignoreContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map(this.convertGitignorePatternToRegex);
    } catch (error) {
      console.log("No .gitignore found or unable to read it. Using default ignored patterns.");
      this.ignoredPatterns = [/^node_modules\//, /^dist\//, /^build\//];
    }
  }

  private convertGitignorePatternToRegex(pattern: string): RegExp {
    let regexPattern = pattern
      .replace(/\./g, "\\.") // Escape dots
      .replace(/\*/g, ".*") // Convert * to .*
      .replace(/\?/g, "."); // Convert ? to .

    // Handle directory matches
    if (pattern.endsWith("/")) {
      regexPattern = `^${regexPattern}.*$`;
    } else {
      regexPattern = `^${regexPattern}$`;
    }

    return new RegExp(regexPattern);
  }

  private shouldIgnoreFile(filePath: string): boolean {
    const relativePath = vscode.workspace.asRelativePath(filePath);
    return this.ignoredPatterns.some((pattern) => pattern.test(relativePath));
  }

  public async highlightUnusedDependencies() {
    if (!this.packageJsonPath) {
      vscode.window.showErrorMessage("No package.json found in the workspace");
      return;
    }

    this.updateDecorations();
  }

  private async getPackageJson(): Promise<string | undefined> {
    const packageJsonFiles = await vscode.workspace.findFiles("**/package.json", "**/node_modules/**", 1);
    if (packageJsonFiles.length === 0) {
      return undefined;
    }

    this.packageJsonPath = packageJsonFiles[0].fsPath;
    const document = await vscode.workspace.openTextDocument(this.packageJsonPath);
    return document.getText();
  }

  private async parseFile(content: string, filePath: string): Promise<ImportData[]> {
    const parser = ParserFactory.createParser(filePath);
    return await parser.parseFile(content);
  }

  private findUnusedDependencies(dependencies: string[], imports: ImportData[]): string[] {
    const ignoredDependencies = getIgnoredDependencies();
    const usedDependencies = new Set<string>();

    imports.forEach((imp) => {
      // Check if the full module name or any part of it matches a dependency
      const moduleParts = imp.moduleName.split("/");
      for (let i = 1; i <= moduleParts.length; i++) {
        const potentialDependency = moduleParts.slice(0, i).join("/");
        if (dependencies.includes(potentialDependency)) {
          usedDependencies.add(potentialDependency);
          break;
        }
      }
    });

    return dependencies.filter((dep) => !usedDependencies.has(dep) && !ignoredDependencies.includes(dep));
  }

  private updateDecorations() {
    if (this.packageJsonPath) {
      const usedImports = this.dependencyTree.getAllImports();
      const unusedDependencies = this.findUnusedDependencies(this.packageJsonDependencies, usedImports);
      highlightUnusedDependencies(this.packageJsonPath, unusedDependencies);
    }
  }
}
