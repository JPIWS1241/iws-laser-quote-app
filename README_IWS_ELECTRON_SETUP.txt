IWS Laser Quote App – Electron Wrapper (Option A: Full Electron Build with Auto-Update)
===============================================================================

This folder is an Electron wrapper for your Streamlit-based Python app:

    IWS_Laser_Quote_App_v13j.py

It expects your Python app and virtual environment to live in:

    C:\LaserQuoteClean

with at least:
    C:\LaserQuoteClean\IWS_Laser_Quote_App_v13j.py
    C:\LaserQuoteClean\MaterialCost.xlsx
    C:\LaserQuoteClean\.venv\Scripts\python.exe
    (plus your logo + data folder, as already working in Streamlit)

-----------------------------------------------------------------------
1. Prerequisites (once per machine)
-----------------------------------------------------------------------

1) Install Node.js LTS from nodejs.org (if not already installed).
   After install, open PowerShell and run:

       node -v
       npm -v

   to confirm it works.

2) Ensure your Python virtual environment and app run correctly:

       cd C:\LaserQuoteClean
       .venv\Scripts\activate
       streamlit run IWS_Laser_Quote_App_v13j.py

   If that opens in the browser and works, you're ready for Electron.

-----------------------------------------------------------------------
2. Put this Electron folder in place
-----------------------------------------------------------------------

1) Copy this entire folder to your Windows machine, for example to:

       C:\LaserQuoteClean\electron-app

   So you end up with:

       C:\LaserQuoteClean\IWS_Laser_Quote_App_v13j.py
       C:\LaserQuoteClean\MaterialCost.xlsx
       C:\LaserQuoteClean\electron-app\package.json
       C:\LaserQuoteClean\electron-app\main.js
       ...

2) (Optional) Add an icon file for the installer:

       C:\LaserQuoteClean\electron-app\icon.ico

   If you skip this, the build will still work but with a default icon;
   just remove the "icon" line under "win" in package.json if needed.

-----------------------------------------------------------------------
3. Install Electron dependencies
-----------------------------------------------------------------------

In PowerShell:

    cd C:\LaserQuoteClean\electron-app
    npm install

This will download Electron, electron-builder, and electron-log.

-----------------------------------------------------------------------
4. Run the desktop app in DEV mode
-----------------------------------------------------------------------

    cd C:\LaserQuoteClean\electron-app
    npm start

What happens:

- Electron starts.
- It launches Python from:
      C:\LaserQuoteClean\.venv\Scripts\python.exe
  running:
      streamlit run IWS_Laser_Quote_App_v13j.py --server.headless true
- After ~8 seconds, the Electron window opens and loads:
      http://localhost:8501

If your folder is different from C:\LaserQuoteClean, update baseDir in
main.js OR set an environment variable before running:

    $env:IWS_BASE_DIR = "D:\Some\Other\Folder"
    npm start

-----------------------------------------------------------------------
5. Configure auto-updates via GitHub (Option A)
-----------------------------------------------------------------------

1) Create a new public or private repo on GitHub, for example:
       iws-laser-quote-app

2) In package.json, under "build.publish", replace:

       "owner": "YOUR_GITHUB_USERNAME",
       "repo": "iws-laser-quote-app"

   with your real GitHub username and repository name.

3) Commit and push this Electron folder into that GitHub repo.

4) Create a GitHub Personal Access Token (classic fine) with "repo"
   permissions, and on your build machine set:

       $env:GH_TOKEN = "YOUR_TOKEN_HERE"

   (Or create a system/user environment variable GH_TOKEN.)

5) From C:\LaserQuoteClean\electron-app run:

       npm run dist

   electron-builder will:

   - Package the app
   - Build a Windows NSIS installer (IWS Laser Quote App Setup 1.0.0.exe)
   - Create a release on GitHub with blockmap metadata
   - Embed auto-update info so future versions can update in-place

For future app updates, you will:

- Bump "version" in package.json (e.g., 1.0.1)
- Rebuild with `npm run dist`
- Publish to GitHub Releases (electron-builder does this automatically
  if GH_TOKEN is set and publish is configured)

-----------------------------------------------------------------------
6. Installing & running the real Windows app
-----------------------------------------------------------------------

After a successful `npm run dist`, you'll find something like:

    C:\LaserQuoteClean\electron-app\dist\IWS Laser Quote App Setup 1.0.0.exe

- Double-click that installer.
- It will install "IWS Laser Quote App" into Program Files.
- A desktop shortcut and Start Menu entry will be created.
- Launching from that shortcut will:
    * Start the internal Streamlit server
    * Open an Electron window with your laser quote UI
    * Keep everything self-contained for the user

-----------------------------------------------------------------------
7. Common tweaks for your environment
-----------------------------------------------------------------------

- If your virtual environment or Python path is different, edit main.js:

    const baseDir = process.env.IWS_BASE_DIR || 'C:\\LaserQuoteClean';

  Then either:
    * Change that path string, or
    * Set IWS_BASE_DIR environment variable before running.

- If your Streamlit port is not 8501, you can change:

    const startUrl = 'http://localhost:8501';

  and add --server.port to the spawn arguments in main.js.

-----------------------------------------------------------------------
You now have a clean, professional Electron wrapper (Option A)
ready to sit on top of your stable v13j app.
-----------------------------------------------------------------------
