const vscode = require('vscode');
const path = require('path');

let activeEditor = null;
let isTyping = false;
let currentFrameIndex = 0;
let animationTimer = null;
let sleepTimer = null;
let decorationType = null;

// Configuration options
let isEnabled = true;
let idleTimeout = 1000;
let animationSpeed = 150;
let catColor = 'orange';

const runFrames = ['run_1.svg', 'run_2.svg', 'run_3.svg', 'run_4.svg'];
const sleepFrames = ['sleep_1.svg', 'sleep_2.svg'];

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  activeEditor = vscode.window.activeTextEditor;

  // Initialize configurations and decoration
  initialize(context);

  // Handle active editor change
  vscode.window.onDidChangeActiveTextEditor(editor => {
    activeEditor = editor;
    if (editor) {
      updateCompanionPosition(context);
    }
  }, null, context.subscriptions);

  // Handle selection (cursor position) change
  vscode.window.onDidChangeTextEditorSelection(event => {
    if (activeEditor && event.textEditor === activeEditor) {
      updateCompanionPosition(context);
    }
  }, null, context.subscriptions);

  // Handle typing/text changes
  vscode.workspace.onDidChangeTextDocument(event => {
    if (activeEditor && event.document === activeEditor.document) {
      triggerTyping(context);
    }
  }, null, context.subscriptions);

  // Handle configuration changes
  vscode.workspace.onDidChangeConfiguration(event => {
    if (event.affectsConfiguration('typingCat')) {
      cleanup();
      initialize(context);
    }
  }, null, context.subscriptions);
}

/**
 * Initializes/Loads configs and starts the companion.
 * @param {vscode.ExtensionContext} context
 */
function initialize(context) {
  const config = vscode.workspace.getConfiguration('typingCat');
  isEnabled = config.get('enabled', true);
  idleTimeout = config.get('idleTimeout', 1000);
  animationSpeed = config.get('animationSpeed', 150);
  catColor = config.get('catColor', 'orange');

  if (!isEnabled) {
    return;
  }

  // Create the decoration type once
  decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 12px',
    }
  });

  // Start with sleeping animation
  isTyping = false;
  currentFrameIndex = 0;
  startAnimationLoop(context);
}

/**
 * Starts or updates the frame-cycling animation loop.
 * @param {vscode.ExtensionContext} context
 */
function startAnimationLoop(context) {
  if (animationTimer) {
    clearInterval(animationTimer);
    animationTimer = null;
  }

  const frames = isTyping ? runFrames : sleepFrames;

  animationTimer = setInterval(() => {
    if (!isEnabled || !activeEditor) {
      return;
    }
    
    currentFrameIndex = (currentFrameIndex + 1) % frames.length;
    updateCompanionPosition(context);
  }, animationSpeed);
}

/**
 * Handles typing events to wake up the cat.
 * @param {vscode.ExtensionContext} context
 */
function triggerTyping(context) {
  if (!isEnabled) {
    return;
  }

  if (sleepTimer) {
    clearTimeout(sleepTimer);
    sleepTimer = null;
  }

  if (!isTyping) {
    isTyping = true;
    currentFrameIndex = 0;
    startAnimationLoop(context);
  }

  sleepTimer = setTimeout(() => {
    isTyping = false;
    currentFrameIndex = 0;
    startAnimationLoop(context);
  }, idleTimeout);
}

/**
 * Updates the decoration in the editor to follow the cursor.
 * @param {vscode.ExtensionContext} context
 */
function updateCompanionPosition(context) {
  if (!isEnabled || !activeEditor || !decorationType) {
    return;
  }

  try {
    const line = activeEditor.selection.active.line;
    const lineLength = activeEditor.document.lineAt(line).text.length;
    const position = new vscode.Position(line, lineLength);
    const range = new vscode.Range(position, position);

    const frames = isTyping ? runFrames : sleepFrames;
    const frame = frames[currentFrameIndex % frames.length];
    
    // Construct local file URI for the current SVG frame
    const framePath = path.join(context.extensionPath, 'media', catColor, frame);
    const iconUri = vscode.Uri.file(framePath);

    activeEditor.setDecorations(decorationType, [{
      range: range,
      renderOptions: {
        after: {
          contentIconPath: iconUri
        }
      }
    }]);
  } catch (error) {
    console.error('Error updating Typing Cat position:', error);
  }
}

/**
 * Cleans up running timers and decorations.
 */
function cleanup() {
  if (animationTimer) {
    clearInterval(animationTimer);
    animationTimer = null;
  }
  if (sleepTimer) {
    clearTimeout(sleepTimer);
    sleepTimer = null;
  }
  if (decorationType) {
    decorationType.dispose();
    decorationType = null;
  }
}

/**
 * Deactivates the extension.
 */
function deactivate() {
  cleanup();
}

module.exports = {
  activate,
  deactivate
};
