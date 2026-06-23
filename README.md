# Typing Pookie Companion

**Typing Pookie Companion** is a cute and interactive extension for Visual Studio Code and Cursor. It places a charming, animated pookie companion at the end of your active coding line. 

Whenever you type, the cat wakes up and runs/walks. When you stop coding, the cat curled up and takes a nap!

---

## Features

- 🐈 **Active Companion**: A cat companion that follows your active line as you code.
- 🏃 **Typing Animation**: Wakes up and runs/walks along with your keystrokes.
- 😴 **Sleeping State**: Automatically curls up and falls asleep when you stop typing.
- 🎨 **Multiple Color Themes**: Choose from Orange, Black (Tuxedo), White, or Gray cat variants.
- ⚙️ **Configurable Timeout & Speeds**: Fine-tune how quickly the cat falls asleep and the speed of its animation.

---

## Configuration

You can customize the extension via your VS Code Settings (`settings.json`):

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `typingCat.enabled` | `boolean` | `true` | Enable or disable the cat companion. |
| `typingCat.catColor` | `string` | `"pookie"` | The color theme of your cat companion (`pookie`, `orange`, `black`, `white`, `gray`). |
| `typingCat.idleTimeout` | `number` | `1000` | Time in milliseconds before the cat falls asleep after you stop typing. |
| `typingCat.animationSpeed` | `number` | `150` | Speed of the animation loop (milliseconds per frame). |

---

## Installation

1. Package the extension into a `.vsix` file:
   ```bash
   npx @vscode/vsce package
   ```
2. Open VS Code or Cursor.
3. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
4. Select **Extensions: Install from VSIX...**.
5. Select the generated `typing-pookie-0.1.0.vsix` file.
6. The cat will appear at the end of your current line on any active text document!
