import { FileParser, Import } from "./parser";

export class PackageJsonParser implements FileParser {
  async parseFile(content: string): Promise<Import[]> {
    const packageJson = JSON.parse(content);
    const dependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
    return dependencies.map((dep) => ({
      moduleName: dep,
      isUsed: true, // Marcamos las dependencias de package.json como usadas por defecto
    }));
  }
}
