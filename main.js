const {
  app, 
  globalShortcut, 
  clipboard, 
  Menu, 
  MenuItem, 
  Tray
} = require('electron')

const path = require('path')
const jsonfile = require('jsonfile')

const icon_ico_path = path.join(__dirname, 'assets', 'icon.ico')
const icon_off_ico_path = path.join(__dirname, 'assets', 'icon_off.ico')
const icon_png_path = path.join(__dirname, 'assets', 'icon.png')
const settings_path = path.join(__dirname, 'settings.json')

let tray = null
let menuItem_enable = null

const settings = jsonfile.readFileSync(settings_path)  

let setIcon = function() {
  if (menuItem_enable.checked) {
    tray.setImage(icon_ico_path)
  } else {
    tray.setImage(icon_off_ico_path)
  }
}

app.on('ready', () => {
  tray = new Tray(icon_ico_path)

  let menu = new Menu()
  menuItem_enable = new MenuItem({label: 'Enable', type: 'checkbox', checked: true, click() {setIcon()}})
  menu.append(menuItem_enable)
  menu.append(new MenuItem({label: 'Exit', click() {
    app.quit()
  }}))

  tray.setToolTip('RegEx Clipboard')
  tray.setContextMenu(menu)

  tray.on('click', () => {
    menuItem_enable.checked = !menuItem_enable.checked
    setIcon()
  })  

  for (const setting of settings) {
    globalShortcut.register(setting['key'], () => {
      if (menuItem_enable.checked) {
        const buffer = clipboard.readText()
        let expression = new RegExp(setting['regex'], setting['modifier'])
        const result = buffer.replace(expression, setting['result'])
        clipboard.writeText(result)
        tray.displayBalloon({
            icon:icon_png_path,
            title:'RegEx Clipboard',
            content:result
        })
      }
    })
  }
})
