const { BrowserWindow,screen } = require('electron');
const path = require('path');

exports.createSessionWindow = (isShow) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const sessionWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      // preload: path.join(__dirname, '../../preload/preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#064f32',
      symbolColor: 'white',
      height: 40,
    },
    title: 'main',
    show: isShow,
    icon: path.join(__dirname, '../../renderer/public/images/dlsms2.png'),
    
  });
  sessionWindow.loadFile(
    path.join(__dirname, '../../renderer/public/index.html')
  );

  return sessionWindow;
};
