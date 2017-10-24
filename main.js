const {app, Menu, Tray} = require('electron')
const path = require('path')

const icon_path = path.join(__dirname, 'assets', 'icon.ico')
let tray = null

app.on('ready', () => {
  tray = new Tray(icon_path)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Enable', type: 'checkbox', checked: true},
    {label: 'Exit', click() {
        app.quit()
    }}
  ])
  tray.setToolTip('RegEx Clipboard')
  tray.setContextMenu(contextMenu)
})
