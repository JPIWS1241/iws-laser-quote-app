const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');   // ← Auto-Updater Added

let mainWindow;
let pythonProcess;

/* ---------------------------------------------
   Create Main App Window
------------------------------------------------*/
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "icon.ico"),   // ← Branded window icon
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false
  });

  const startUrl = "http://localhost:8501";
  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/* ---------------------------------------------
   Start Streamlit (Python Backend)
------------------------------------------------*/
function startPython() {

  const baseDir = process.env.IWS_BASE_DIR || "C:\\LaserQuoteClean";
  const pythonPath = path.join(baseDir, ".venv", "Scripts", "python.exe");
  const scriptPath = path.join(baseDir, "IWS_Laser_Quote_App_v13j.py");

  log.info("Starting Streamlit with Python at:", pythonPath);
  log.info("Using app script:", scriptPath);

  pythonProcess = spawn(
    pythonPath,
    ["-m", "streamlit", "run", scriptPath, "--server.headless", "true"],
    { cwd: baseDir, shell: false }
  );

  pythonProcess.stdout.on("data", (data) => {
    log.info(`[PYTHON] ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    log.error(`[PYTHON-ERR] ${data}`);
  });

  pythonProcess.on("close", (code) => {
    log.info(`Python process exited with code ${code}`);
    if (!app.isQuitting) {
      dialog.showErrorBox(
        "IWS Laser Quote App",
        "The internal Streamlit server stopped running. Please restart the application."
      );
    }
  });
}

/* ---------------------------------------------
   Stop Python on Quit
------------------------------------------------*/
function stopPython() {
  if (pythonProcess) {
    log.info("Stopping Python process...");
    pythonProcess.kill();
    pythonProcess = null;
  }
}

/* ---------------------------------------------
   Auto-Updater Handlers
------------------------------------------------*/
autoUpdater.on("update-available", () => {
  log.info("UPDATE AVAILABLE");
});

autoUpdater.on("update-downloaded", () => {
  log.info("UPDATE DOWNLOADED — Will install after quit");
});

autoUpdater.on("error", (err) => {
  log.error("AUTO UPDATE ERROR:", err);
});

/* ---------------------------------------------
   App Ready
------------------------------------------------*/
app.on("ready", () => {

  startPython();

  // Let Streamlit boot fully before loading browser window
  setTimeout(createWindow, 8000);

  // Check GitHub Releases automatically
  autoUpdater.checkForUpdatesAndNotify();
});

/* ---------------------------------------------
   Cleanup
------------------------------------------------*/
app.on("before-quit", () => {
  app.isQuitting = true;
  stopPython();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
