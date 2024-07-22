// Path: src/utils/dependency-tree.ts
export interface ImportData {
  moduleName: string;
  defaultImport?: string;
  namedImports?: string[];
  namespaceImport?: string;
  isUsed: boolean;
}

export class DependencyTree {
  private tree: Map<string, ImportData[]> = new Map();

  public setImports(filePath: string, imports: ImportData[]) {
    this.tree.set(filePath, imports);
  }

  public getImports(filePath: string): ImportData[] | undefined {
    return this.tree.get(filePath);
  }

  public removeImports(filePath: string) {
    this.tree.delete(filePath);
  }

  public getAllImports(): ImportData[] {
    const allImports: ImportData[] = [];
    for (const imports of this.tree.values()) {
      allImports.push(...imports);
    }
    return allImports;
  }
}
