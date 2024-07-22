// Path: src/utils/decoration.ts
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

function getRandomGhostlyMessage(): string {
  return ghostlyMessages[Math.floor(Math.random() * ghostlyMessages.length)];
}

const analyzingMessage = "🔍 Analyzing usage...";

let unusedDependencyDecorationType: vscode.TextEditorDecorationType;

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
}

export function clearDecorations(textEditor: vscode.TextEditor) {
  textEditor.setDecorations(unusedDependencyDecorationType, []);
}

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
            contentText: analyzingMessage,
            color: new vscode.ThemeColor("editorInfo.foreground"),
            backgroundColor: "transparent",
            margin: "0 0 0 1em",
          },
        },
      },
    ];

    textEditor.setDecorations(unusedDependencyDecorationType, decorationOptions);
  }
}
