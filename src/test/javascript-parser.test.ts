import { JavaScriptParser } from "../../src/parsers/javascript-parser";
import * as assert from "assert";

suite("JavaScriptParser Test Suite", () => {
  test("should parse JavaScript imports correctly", async () => {
    const content = `
            import React from "react";
            import { useState } from "react";
            import * as lodash from "lodash";
        `;
    const parser = new JavaScriptParser();
    const imports = await parser.parseFile(content);

    assert.strictEqual(imports.length, 3);
    assert.strictEqual(imports[0].moduleName, "react");
    assert.strictEqual(imports[1].moduleName, "react");
    assert.strictEqual(imports[2].moduleName, "lodash");
  });
});
