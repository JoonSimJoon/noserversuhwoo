const { app, BrowserWindow, Menu } = require('electron') 
const path = require('path') 
const isDev = require('electron-is-dev')


function createWindow () { 
  const win = new BrowserWindow({ 
    width: 1280, 
    height: 900,
    resizable: false, 
    center: true,
    backgroundColor: 'black',
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation : false
    } 
  }) 
    win.loadURL(
      isDev
      ? 'http://localhost:3000'
      :`file://${path.join(__dirname,'../build/index.html')}`)
  
} 
const template= [];
const menu = Menu.buildFromTemplate(template); 
Menu.setApplicationMenu(menu);

app.whenReady().then(() => { 
  createWindow() 
}) 
app.on('window-all-closed', function () { 
  if (process.platform !== 'darwin') app.quit() 
})