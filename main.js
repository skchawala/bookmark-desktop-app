const { app, BrowserWindow,ipcMain } = require('electron')
const WindowStateKeeper = require('electron-window-state')
const readItem =  require('./readItem')
const appMenu = require('./menu')

let mainWindow


ipcMain.on('new-item',(e,itemUrl)=>{
    readItem(itemUrl,(item)=>{
        e.sender.send('new-item-success',item)
    })

})

function createWindow () {

    let state = WindowStateKeeper({
        defaultWidth:500,defaultHeight:650
    })

    mainWindow = new BrowserWindow({
        x:state.x,
        y:state.y,
        width: state.width,
        height: state.height,
        minWidth:350,
        maxWidth:650,
        minHeight:300,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('renderer/main.html')

    //mainWindow.webContents.openDevTools()

    mainWindow.on('close',()=>{
        mainWindow = null
    })
    state.manage(mainWindow)
    appMenu(mainWindow)
}

//app.whenReady().then(createWindow)
app.on('ready',createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})