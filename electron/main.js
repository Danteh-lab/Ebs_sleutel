const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Add your app icon here
    show: false, // Don't show until ready
    titleBarStyle: 'default',
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    app.quit();
  });

  return mainWindow;
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'Bestand',
      submenu: [
        {
          label: 'Afsluiten',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Bewerken',
      submenu: [
        { label: 'Ongedaan maken', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Opnieuw', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Knippen', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Kopiëren', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Plakken', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Beeld',
      submenu: [
        { label: 'Herladen', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Geforceerd herladen', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Ontwikkelaarstools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Werkelijke grootte', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Inzoomen', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Uitzoomen', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Volledig scherm', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Venster',
      submenu: [
        { label: 'Minimaliseren', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Sluiten', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Over EBS Key Management',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/your-repo/ebs-key-management');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationURL) => {
    event.preventDefault();
    require('electron').shell.openExternal(navigationURL);
  });
});