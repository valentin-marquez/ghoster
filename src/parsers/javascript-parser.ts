// Path: src/parsers/javascript-parser.ts
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

import type { FileParser, Import } from "./parser";

export class JavaScriptParser implements FileParser {
  async parseFile(content: string): Promise<Import[]> {
    console.time("parseFile: JavaScriptParser");
    const result = this.parseImports(content);
    console.timeEnd("parseFile: JavaScriptParser");
    return result;
  }

  protected parseImports(content: string): Import[] {
    const ast = parse(content, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    return this.extractImports(ast);
  }

  public extractImports(ast: any): Import[] {
    console.time("extractImports: JavaScriptParser");

    const imports: Import[] = [];
    const importedIdentifiers = new Map<string, Import>();

    // First pass: collect all imports
    traverse(ast, {
      ImportDeclaration(path) {
        const importDeclaration = path.node;
        const moduleName = importDeclaration.source.value;
        const importData: Import = {
          moduleName,
          defaultImport: undefined,
          namespaceImport: undefined,
          namedImports: [],
          isUsed: false,
        };

        importDeclaration.specifiers.forEach((specifier) => {
          if (t.isImportDefaultSpecifier(specifier)) {
            importData.defaultImport = specifier.local.name;
            importedIdentifiers.set(specifier.local.name, importData);
          } else if (t.isImportNamespaceSpecifier(specifier)) {
            importData.namespaceImport = specifier.local.name;
            importedIdentifiers.set(specifier.local.name, importData);
          } else if (t.isImportSpecifier(specifier)) {
            importData.namedImports!.push(specifier.local.name);
            importedIdentifiers.set(specifier.local.name, importData);
          }
        });

        imports.push(importData);
      },
    });

    // Second pass: check for usage
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        if (importedIdentifiers.has(name)) {
          if (
            !t.isImportDeclaration(path.parent) &&
            !t.isImportSpecifier(path.parent) &&
            !t.isImportDefaultSpecifier(path.parent) &&
            !t.isImportNamespaceSpecifier(path.parent)
          ) {
            importedIdentifiers.get(name)!.isUsed = true;
          }
        }
      },
      MemberExpression(path) {
        if (t.isIdentifier(path.node.object)) {
          const name = path.node.object.name;
          if (importedIdentifiers.has(name)) {
            importedIdentifiers.get(name)!.isUsed = true;
          }
        }
      },
      JSXIdentifier(path) {
        const name = path.node.name;
        if (importedIdentifiers.has(name)) {
          importedIdentifiers.get(name)!.isUsed = true;
        }
      },
      JSXMemberExpression(path) {
        if (t.isJSXIdentifier(path.node.object)) {
          const name = path.node.object.name;
          if (importedIdentifiers.has(name)) {
            importedIdentifiers.get(name)!.isUsed = true;
          }
        }
      },
    });

    console.timeEnd("extractImports: JavaScriptParser");
    return imports.filter((imp) => imp.isUsed);
  }
}
