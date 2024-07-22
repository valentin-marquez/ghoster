export interface Import {
  moduleName: string;
  defaultImport?: string;
  namedImports?: string[];
  namespaceImport?: string;
  isUsed: boolean;
}

export interface ParsedDependencies {
  dependencies: string[];
}

export interface FileParser {
  parseFile(content: string): Promise<Import[]>;
}
