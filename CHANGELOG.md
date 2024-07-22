# Change Log

All notable changes to the "ghoster-unused-highlighter" extension will be documented in this file.

## [1.0.0] - 2023-07-22

### Added

- Initial release of Ghoster
- Real-time detection of unused dependencies
- Highlighting of unused dependencies in `package.json`
- Support for JavaScript and TypeScript files (.js, .jsx, .ts, .tsx)
- Support for ECMAScript module imports
- Customizable ignored dependencies
- Respect for common ignore patterns (node_modules, dist, build, .git)

### Known Limitations

- Does not currently support CommonJS `require()` statements
- Only tested with ECMAScript module imports

## [Unreleased]

- Support for CommonJS `require()` statements
- Improved performance for large projects
- Additional customization options
