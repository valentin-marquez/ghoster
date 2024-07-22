import * as path from "path";

import { JavaScriptParser } from "./javascript-parser";
import { PackageJsonParser } from "./json-parser";
import { TypeScriptParser } from "./typescript-parser";

import type { FileParser } from "./parser";

export class ParserFactory {
  static createParser(filePath: string): FileParser {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
      case ".json":
        return new PackageJsonParser();
      case ".js":
      case ".jsx":
        return new JavaScriptParser();
      case ".ts":
      case ".tsx":
        return new TypeScriptParser();
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }
}
