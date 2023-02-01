const windowStateManager = require('electron-window-state');
const contextMenu = require('electron-context-menu');
const { app, BrowserWindow, ipcMain } = require('electron');
const nativeImage = require('electron').nativeImage
const { autoUpdater } = require("electron-updater");
const serve = require('electron-serve');
const path = require('path');
const open = require('open');
const { execFile } = require('child_process');
const { auto } = require('@popperjs/core');
const { updateLocale } = require('moment');

if (process.env.NODE_ENV === 'development') {
	global.__static = path.join(__dirname, '../static');
} else {
	global.__static = path.join(__dirname, '..');

}

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const dev = !app.isPackaged;
let mainWindow;

const backend = execFile(path.join(__static, (process.platform === "linux") ? "/backend/backend" : (process.platform === "win32") ? "/backend/backend.exe" : "/backend/backend"));

function createWindow() {
	let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	const mainWindow = new BrowserWindow({
		backgroundColor: 'whitesmoke',
		//titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		title: "Better Lectio",
		trafficLightPosition: {
			x: 17,
			y: 32,
		},
		minHeight: 450,
		minWidth: 500,
		webPreferences: {
			enableRemoteModule: true,
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			devTools: true, //dev,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
		icon: nativeImage.createFromPath(__static + '/icon.png')
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Discord',
			click: function() {open("https://betterlectio.dk/discord");}
		},
	],
});

function loadVite(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


app.once('ready', createMainWindow);
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}

	autoUpdater.checkForUpdates();
});

let updateAvailable = false;
autoUpdater.on("update-available", (info) => {
	console.log("Update available");
	autoUpdater.downloadUpdate();
	updateAvailable = true;
})

process.on('exit', () => {
	backend.stdin.pause();
	backend.kill();
	if (updateAvailable) {
		console.log("Installing update");
		autoUpdater.quitAndInstall();//app.quit();
	} else {
		app.quit();
	}
});
  

ipcMain.on('to-main', (event, count) => {
	return mainWindow.webContents.send('from-main', `next count is ${count + 1}`);
});
