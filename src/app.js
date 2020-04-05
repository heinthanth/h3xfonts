// main electron process

const { app, BrowserWindow, Menu, shell } = require("electron");
const { log } = require("electron-log");
const bootstrap = require("./utils/bootstrap");
const menu = require("./utils/menu");
const url = require("url");
const path = require("path");
const FontController = require("./controller/FontController");

// config application
bootstrap.Boot();

let main_window;

const main_window_start_url =
	process.env.ELECTRON_START_URL ||
	url.format({
		pathname: path.join(__dirname, "../frontend/build/index.html"),
		protocol: "file:",
		slashes: true,
	});

if (!main_window_start_url) {
	log.error("Cannot find starting URL.");
}

function create_main_window() {
	main_window = new BrowserWindow({
		width: 800,
		height: 400,
		titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: true,
		},
	});
	let main_menu = Menu.buildFromTemplate(menu.create(main_window, app));
	Menu.setApplicationMenu(main_menu);
	main_window.loadURL(main_window_start_url);
}

app.whenReady().then(create_main_window).then(FontController.Listen());

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		create_main_window();
	}
});
