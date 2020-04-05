// to load from electron.js on boot
// bootstrap.js to set GLOBAL Variables

const { log } = require("electron-log");
const path = require("path");
const fs = require("fs");

let setting = {
	SYS_FONT_DIR: undefined,
	APP_DIR: undefined,
	FONT_DB: undefined,
	TEMP_FONT_DIR: undefined
};

const user_home_dir = process.env.HOME;

// log if no user home directory found!
if(!user_home_dir) {
	log.error("Unable to find User's Home directory. Please set Environment variable \"HOME\" respectively.");
}

function Config() {
	if (process.platform === "darwin") {
		// if macOS
		setting["SYS_FONT_DIR"] = path.join(user_home_dir, 'Library', 'Fonts');
		setting["APP_DIR"] = path.join(user_home_dir, '.h3xfonts');
	} else if (process.platform === "linux") {
		// if linux
		setting["SYS_FONT_DIR"] = path.join(user_home_dir, '.local', 'share', 'fonts');
		setting["APP_DIR"] = path.join(user_home_dir, '.h3xfonts');
	} else {
		log.error(
			`Unsupported platform. expect ['darwin', 'linux'], found ${process.platform}.`
		);
	}
	setting["FONT_DB"] = path.join(setting["APP_DIR"], 'db.txt');
	setting["TEMP_FONT_DIR"] = path.join(setting["APP_DIR"], 'fonts');
};

function CreateEssential() {
	if(!fs.existsSync(setting["APP_DIR"])) {
		fs.mkdirSync(setting["APP_DIR"]);
	}
	if(!fs.existsSync(setting["TEMP_FONT_DIR"])) {
		fs.mkdirSync(setting["TEMP_FONT_DIR"]);
	}
	if(!fs.existsSync(setting["SYS_FONT_DIR"])) {
		fs.mkdirSync(setting["SYS_FONT_DIR"]);
	}
	if(!fs.existsSync(setting["FONT_DB"])) {
		fs.closeSync(fs.openSync(setting["FONT_DB"], 'w'));
	}
}

function Boot() {
	Config();
	CreateEssential();
	// can be access from other components
	// remote.getGlobal("setting") from React;
	global.setting = setting;
}

exports.Boot = Boot;