import { DependencyTree, ImportData } from "../../src/utils/dependency-tree";
import * as assert from "assert";

suite("DependencyTree Test Suite", () => {
  test("should manage dependency tree correctly", () => {
    const dependencyTree = new DependencyTree();
    const filePath = "/path/to/file.js";
    const imports: ImportData[] = [
      { moduleName: "react", isUsed: true },
      { moduleName: "lodash", isUsed: true },
    ];

    dependencyTree.setImports(filePath, imports);
    const retrievedImports = dependencyTree.getImports(filePath);

    assert.strictEqual(retrievedImports?.length, 2);
    assert.strictEqual(retrievedImports?.[0].moduleName, "react");

    dependencyTree.removeImports(filePath);
    const removedImports = dependencyTree.getImports(filePath);
    assert.strictEqual(removedImports, undefined);
  });
});
