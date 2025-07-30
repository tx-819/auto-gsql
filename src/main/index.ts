import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import * as keytar from 'keytar'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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
  ipcMain.handle('get-settings', async () => {
    try {
      const settings = await keytar.getPassword('auto-gsql', 'app-settings')
      return settings ? JSON.parse(settings) : null
    } catch (error) {
      console.error('Failed to get settings:', error)
      return null
    }
  })

  ipcMain.handle('save-settings', async (_, settings) => {
    try {
      await keytar.setPassword('auto-gsql', 'app-settings', JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('Failed to save settings:', error)
      return false
    }
  })

  // IPC handlers for authentication
  ipcMain.handle('get-current-user', async () => {
    try {
      const userData = await keytar.getPassword('auto-gsql', 'current-user')
      return userData
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  })

  ipcMain.handle('save-user-session', async (_, userData) => {
    try {
      await keytar.setPassword('auto-gsql', 'current-user', userData)
      return true
    } catch (error) {
      console.error('Failed to save user session:', error)
      return false
    }
  })

  ipcMain.handle('clear-user-session', async () => {
    try {
      await keytar.deletePassword('auto-gsql', 'current-user')
      return true
    } catch (error) {
      console.error('Failed to clear user session:', error)
      return false
    }
  })

  ipcMain.handle('login', async (_, credentials) => {
    try {
      // 这里可以添加实际的登录验证逻辑
      // 目前使用模拟验证
      const { username, password } = credentials

      // 从keytar获取用户列表
      const usersData = await keytar.getPassword('auto-gsql', 'users')
      const users = usersData
        ? JSON.parse(usersData)
        : [
            { username: 'admin', password: 'admin123', email: 'admin@example.com' },
            { username: 'user', password: 'user123', email: 'user@example.com' }
          ]

      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        const userData = JSON.stringify({
          id: Date.now().toString(),
          username: user.username,
          email: user.email
        })
        await keytar.setPassword('auto-gsql', 'current-user', userData)
        return true
      }

      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  })

  ipcMain.handle('register', async (_, userData) => {
    try {
      const { username, email, password } = userData

      // 从keytar获取现有用户列表
      const usersData = await keytar.getPassword('auto-gsql', 'users')
      const users = usersData
        ? JSON.parse(usersData)
        : [
            { username: 'admin', password: 'admin123', email: 'admin@example.com' },
            { username: 'user', password: 'user123', email: 'user@example.com' }
          ]

      // 检查用户名和邮箱是否已存在
      const existingUser = users.find((u) => u.username === username || u.email === email)

      if (existingUser) {
        return false // 用户已存在
      }

      // 添加新用户
      const newUser = {
        username,
        email,
        password
      }

      users.push(newUser)

      // 保存更新后的用户列表
      await keytar.setPassword('auto-gsql', 'users', JSON.stringify(users))

      return true
    } catch (error) {
      console.error('Registration failed:', error)
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
