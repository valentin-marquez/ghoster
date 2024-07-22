// Path: src/utils/cache.ts
import { ParsedDependencies } from "../parsers/package";

interface FileCache {
  size: number;
  lastChecked: number;
}

export class Cache {
  private dependencies: ParsedDependencies = { dependencies: [] };
  private usedImports: string[] = [];
  private fileCache: Map<string, FileCache> = new Map();
  private lastAnalysisTime: number = 0;

  public setDependencies(dependencies: ParsedDependencies) {
    this.dependencies = dependencies;
  }

  public getDependencies(): ParsedDependencies {
    return this.dependencies;
  }

  public setUsedImports(usedImports: string[]) {
    this.usedImports = usedImports;
  }

  public getUsedImports(): string[] {
    return this.usedImports;
  }

  public setFileCache(filePath: string, size: number) {
    this.fileCache.set(filePath, { size, lastChecked: Date.now() });
  }

  public getFileCache(filePath: string): FileCache | undefined {
    return this.fileCache.get(filePath);
  }

  public setLastAnalysisTime() {
    this.lastAnalysisTime = Date.now();
  }

  public getLastAnalysisTime(): number {
    return this.lastAnalysisTime;
  }
}
