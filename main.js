const {app, globalShortcut, Menu, Tray} = require('electron')
const path = require('path')
const jsonfile = require('jsonfile')

const icon_path = path.join(__dirname, 'assets', 'icon.ico')
const settings_path = path.join(__dirname, 'settings.json')

let tray = null
let settings = jsonfile.readFileSync(settings_path)

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

  for (let setting of settings) {
    globalShortcut.register(setting['key'], () => {
        console.log(setting['key'] + ' is pressed')
    })
  }
})
