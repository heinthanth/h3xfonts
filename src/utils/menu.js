const { shell } = require("electron");

exports.create = (main_window, app) => {
	let cross_platform_file_submenu = [
		{
			label: "Explore Fonts",
			accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
			click() {
				main_window.webContents.send("electron-route", "explore");
			},
		},
		{
			label: "Installed Fonts",
			accelerator: process.platform === "darwin" ? "Command+O" : "Ctrl+O",
			click() {
				main_window.webContents.send("electron-route", "installed");
			},
		},
	];

	if (process.platform !== "darwin") {
		cross_platform_file_submenu.unshift({
			label: "About",
			click() {
				main_window.webContents.send("electron-route", "about");
			},
		});
	}

	let main_menu_template = [
		{
			label: "File",
			submenu: cross_platform_file_submenu,
		},
		{
			label: "Help",
			submenu: [
				{ role: "reload" },
				{ role: "toggleDevTools" },
				{ type: "separator" },
				{
					label: "Visit Developer",
					click() {
						shell.openExternal("https://heinthanth.com");
					},
				},
			],
		},
	];

	if (process.platform === "darwin") {
		main_menu_template.unshift({
			label: "HexFonts",
			submenu: [
				{
					label: "About HexFonts",
					click() {
						main_window.webContents.send("electron-route", "about");
					},
				},
				{ type: "separator" },
				{
					label: "Quit HexFonts",
					accelerator: "Command+Q",
					click() {
						app.quit();
					},
				},
			],
		});
	}
	return main_menu_template;
};
