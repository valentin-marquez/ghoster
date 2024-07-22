import * as vscode from "vscode";

const ghostlyMessages = [
  "👻 Boo! I'm an unused dependency!",
  "🕸️ Just gathering dust here...",
  "🦇 Hanging around unused",
  "🎃 Trick or treat! I'm unused!",
  "💀 Dead code walking",
  "🧟 Zombie dependency detected",
  "🌚 In the dark, unused and alone",
  "🕯️ Light me up or let me go!",
  "🧙‍♂️ Abracadabra! Make me disappear!",
  "🦉 Whooo's not using me?",
];

const ghostlyAnalyzingMessages = [
  "👻 Summoning the spirits of your dependencies...",
  "🔮 Gazing into the crystal ball of your code...",
  "🧙‍♂️ Casting a spell to reveal unused packages...",
  "🕯️ Lighting candles to illuminate unused imports...",
  "🦉 Whooo's been using what? Let's find out...",
];

/**
 * Returns a random ghostly message from the available ghostly messages.
 *
 * @returns A random ghostly message.
 */
function getRandomGhostlyMessage(): string {
  return ghostlyMessages[Math.floor(Math.random() * ghostlyMessages.length)];
}

/**
 * Returns a random ghostly analyzing message.
 *
 * @returns A random ghostly analyzing message.
 */
function getRandomAnalyzingMessage(): string {
  return ghostlyAnalyzingMessages[Math.floor(Math.random() * ghostlyAnalyzingMessages.length)];
}

let unusedDependencyDecorationType: vscode.TextEditorDecorationType;
let analyzingDecorationType: vscode.TextEditorDecorationType;

/**
 * Creates the decoration types for unused dependencies and analyzing message.
 */
export function createDecorationTypes() {
  unusedDependencyDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: new vscode.ThemeColor("editorWarning.background"),
    after: {
      contentText: "",
      color: new vscode.ThemeColor("editorWarning.foreground"),
      margin: "0 0 0 1em",
    },
    isWholeLine: true,
  });

  analyzingDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      contentText: "",
      color: new vscode.ThemeColor("editorInfo.foreground"),
      margin: "0 0 0 1em",
    },
    isWholeLine: true,
  });
}

/**
 * Clears the decorations for the given text editor.
 * @param textEditor The text editor to clear decorations for.
 */
export function clearDecorations(textEditor: vscode.TextEditor) {
  textEditor.setDecorations(unusedDependencyDecorationType, []);
  textEditor.setDecorations(analyzingDecorationType, []);
}

/**
 * Highlights unused dependencies in the package.json file.
 * @param packageJsonPath - The path to the package.json file.
 * @param unusedDependencies - An array of unused dependencies.
 */
export function highlightUnusedDependencies(packageJsonPath: string, unusedDependencies: string[]) {
  const textEditor = vscode.window.visibleTextEditors.find((editor) => editor.document.fileName === packageJsonPath);
  if (!textEditor) {
    return;
  }

  clearDecorations(textEditor);

  const ranges: vscode.DecorationOptions[] = unusedDependencies
    .map((dep) => {
      const regex = new RegExp(`"${dep}":\\s*".*?"`, "g");
      const text = textEditor.document.getText();
      const match = regex.exec(text);
      if (match) {
        const startPos = textEditor.document.positionAt(match.index);
        const endPos = textEditor.document.positionAt(match.index + match[0].length);
        return {
          range: new vscode.Range(startPos, endPos),
          renderOptions: {
            after: {
              contentText: getRandomGhostlyMessage(),
              color: new vscode.ThemeColor("editorWarning.foreground"),
              backgroundColor: "transparent",
              margin: "0 0 0 1em",
            },
          },
        };
      }
      return null;
    })
    .filter((range) => range !== null) as vscode.DecorationOptions[];

  textEditor.setDecorations(unusedDependencyDecorationType, ranges);
}

/**
 * Shows an analyzing message as a decoration in the specified text editor.
 *
 * @param packageJsonPath - The path of the package.json file.
 */
export function showAnalyzingMessage(packageJsonPath: string) {
  const textEditor = vscode.window.visibleTextEditors.find((editor) => editor.document.fileName === packageJsonPath);
  if (!textEditor) {
    return;
  }

  clearDecorations(textEditor);

  const text = textEditor.document.getText();
  const dependencies = text.match(/"dependencies"\s*:\s*{[\s\S]*?}/);
  if (dependencies) {
    const startPos = textEditor.document.positionAt(dependencies.index!);
    const endPos = textEditor.document.positionAt(dependencies.index! + dependencies[0].length);
    const range = new vscode.Range(startPos, endPos);

    const decorationOptions: vscode.DecorationOptions[] = [
      {
        range,
        renderOptions: {
          after: {
            contentText: getRandomAnalyzingMessage(),
            color: new vscode.ThemeColor("editorInfo.foreground"),
            backgroundColor: "transparent",
            margin: "0 0 0 1em",
          },
        },
      },
    ];

    textEditor.setDecorations(analyzingDecorationType, decorationOptions);
  }
}
