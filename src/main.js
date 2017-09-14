const {electron, app, BrowserWindow, ipcMain, Menu} = require('electron')
const path = require('path')
const url  = require('url')

const io = require('./app-helpers/io.js')

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({show: false})

  mainWindow.maximize()
  mainWindow.show()

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}, {
        label: "Grammar",
        submenu: [
          { label: "Open Nearley grammar", accelerator: "CommandOrControl+Shift+1", click: function() { mainWindow.webContents.send('load-grammar', io.open_file_dialog() ) } },
          { label: "Show grammar", accelerator: "CommandOrControl+1", click: function() { mainWindow.webContents.executeJavaScript('ux.show_grammar()') } },
          { label: "Compile grammar", accelerator: "CommandOrControl+B", click: function() { mainWindow.webContents.executeJavaScript('$("#compile-button").click()') } }
        ]},
        {
        label: "Data",
        submenu :[
          { label: "Open data file", accelerator: "CommandOrControl+Shift+2", click: function() { mainWindow.webContents.send('load-data', io.open_file_dialog() ) }  },
          { label: "Show test data", accelerator: "CommandOrControl+2", click: function() { mainWindow.webContents.executeJavaScript('ux.show_data()') } },
          { label: "Test data", accelerator: "CommandOrControl+T" }
        ]
        }
    ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () { mainWindow = null })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
let compiled_grammar

const nearleyer = require('./app-helpers/nearleyer')

ipcMain.on('compile-grammar', function(event, grammar_string) {
  console.log(grammar_string)

  compiled_grammar = nearleyer(grammar_string)

  event.returnValue = true

})
