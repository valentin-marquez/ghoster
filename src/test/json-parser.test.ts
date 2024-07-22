import { PackageJsonParser } from "../../src/parsers/json-parser";
import * as assert from "assert";

suite("PackageJsonParser Test Suite", () => {
  test("should parse package.json dependencies correctly", async () => {
    const content = `
            {
                "dependencies": {
                    "react": "^17.0.2",
                    "lodash": "^4.17.21"
                }
            }
        `;
    const parser = new PackageJsonParser();
    const imports = await parser.parseFile(content);

    assert.strictEqual(imports.length, 2);
    assert.strictEqual(imports[0].moduleName, "react");
    assert.strictEqual(imports[1].moduleName, "lodash");
  });
});
