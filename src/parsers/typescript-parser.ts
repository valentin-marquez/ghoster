import { parse } from "@babel/parser";
import { JavaScriptParser } from "./javascript-parser";
import { Import } from "./parser";

export class TypeScriptParser extends JavaScriptParser {
  async parseFile(content: string): Promise<Import[]> {
    console.time("parseFile: TypeScriptParser");

    const ast = parse(content, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const result = this.extractImports(ast);
    console.timeEnd("parseFile: TypeScriptParser");
    return result;
  }
}
