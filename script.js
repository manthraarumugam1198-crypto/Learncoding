
const code = document.getElementById("code");
const output = document.getElementById("output");
const runButton = document.getElementById("run");
const status = document.getElementById("status");

let pyodide;

async function initializePython() {
  runButton.disabled = true;

  try {
    pyodide = await loadPyodide();
    status.textContent = "Python is ready!";
    output.textContent = "Ready to run your code.";
    runButton.disabled = false;
  } catch (error) {
    status.textContent = "Could not load Python. Check your internet connection.";
    output.textContent = String(error);
  }
}

runButton.addEventListener("click", async () => {
  if (!pyodide) return;

  runButton.disabled = true;
  output.textContent = "Running...";

  try {
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

    pyodide.runPython(code.value);

    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");

    output.textContent = stdout + stderr || "Program finished with no output.";
  } catch (error) {
    output.textContent = String(error);
  } finally {
    runButton.disabled = false;
  }
});

initializePython();
