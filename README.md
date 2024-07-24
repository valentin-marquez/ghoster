# Ghoster - VSCode Unused Dependencies Detector

![Version](https://img.shields.io/github/v/release/valentin-marquez/ghoster)
![License](https://img.shields.io/github/license/valentin-marquez/ghoster)
![Build Status](https://img.shields.io/github/actions/workflow/status/valentin-marquez/ghoster/build.yml)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/valentin-marquez.ghoster)
![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/valentin-marquez.ghoster)
![Issues](https://img.shields.io/github/issues/valentin-marquez/ghoster)
![Stars](https://img.shields.io/github/stars/valentin-marquez/ghoster)

Ghoster is a Visual Studio Code extension that helps you keep your `package.json` clean by detecting and highlighting unused dependencies in your JavaScript and TypeScript projects.

## Features

- 👀 Real-time detection of unused dependencies
- 🎨 Highlights unused dependencies directly in your `package.json` file
- 🚀 Efficient file watching and analysis
- 🧠 Smart parsing of JavaScript, TypeScript, and JSON files
- 🔧 Customizable ignored dependencies

## Supported File Types and Import Styles

Ghoster currently supports:

- File types: .js, .jsx, .ts, .tsx
- Import style: ECMAScript modules (e.g., `import x from 'y'`)

Note: CommonJS `require()` statements are not currently supported.

## Installation

1. Open Visual Studio Code
2. Press `Ctrl+P` (or `Cmd+P` on macOS) to open the Quick Open dialog
3. Type `ext install ghoster` and press Enter
4. Click the Install button

## Usage

Once installed, Ghoster will automatically start analyzing your project:

1. Open a JavaScript or TypeScript project in VSCode
2. Open your `package.json` file
3. Unused dependencies will be highlighted with a ghostly message 👻

The extension will continuously monitor your files for changes and update the highlights in real-time.

## Commands

Ghoster adds the following command to the Command Palette:

- `Ghoster: Highlight Unused Dependencies`: Manually trigger the analysis of unused dependencies

## Configuration

You can customize Ghoster by modifying your VSCode `settings.json`:

```json
{
  "ghoster.ignore": ["some-package-to-ignore", "another-package-to-ignore"]
}
```

This setting allows you to specify dependencies that should be ignored by Ghoster, even if they appear to be unused.

## How It Works

Ghoster uses a smart file watching system to detect changes in your project files. When a file is modified, created, or deleted, Ghoster analyzes only the affected file, maintaining an up-to-date dependency tree without unnecessary full project scans.

## Contributing

We welcome contributions to Ghoster! If you have suggestions for improvements or bug fixes, please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/yourusername/ghoster).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have any questions, please open an issue on our [GitHub repository](https://github.com/yourusername/ghoster/issues).

Happy coding, and may your dependencies always be lean and mean! 👻💻
