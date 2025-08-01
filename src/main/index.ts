import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import * as keytar from 'keytar'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC handlers for settings
  ipcMain.handle('get-ai-config', async (_, provider) => {
    try {
      const config = await keytar.getPassword('auto-gsql', `ai-config-${provider}`)
      return config ? JSON.parse(config) : null
    } catch (error) {
      console.error('Failed to get ai config:', error)
      return null
    }
  })

  ipcMain.handle('save-ai-config', async (_, provider, config) => {
    try {
      await keytar.setPassword('auto-gsql', `ai-config-${provider}`, JSON.stringify(config))
      return true
    } catch (error) {
      console.error('Failed to save ai config:', error)
      return false
    }
  })

  // Token管理
  ipcMain.handle('get-auth-token', async () => {
    try {
      const token = await keytar.getPassword('auto-gsql', 'auth-token')
      return token
    } catch (error) {
      console.error('Failed to get auth token:', error)
      return null
    }
  })

  ipcMain.handle('save-auth-token', async (_, token) => {
    try {
      await keytar.setPassword('auto-gsql', 'auth-token', token)
      return true
    } catch (error) {
      console.error('Failed to save auth token:', error)
      return false
    }
  })

  ipcMain.handle('clear-auth-token', async () => {
    try {
      await keytar.deletePassword('auto-gsql', 'auth-token')
      return true
    } catch (error) {
      console.error('Failed to clear auth token:', error)
      return false
    }
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
