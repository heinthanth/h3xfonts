// main js to control fonts
const { ipcMain } = require("electron");
const { execSync } = require("child_process");
const { removeSpace, space2dashLow } = require("../utils/helper");
const fs = require("fs");

exports.Listen = () => {
	ipcMain.on("install-request", Install);
	ipcMain.on("uninstall-request", Uninstall);
};

const Install = (event, item) => {
	const files = item.files;
	const tempF = removeSpace(item.family);
	for (var k in files) {
		let url = files[k];
		let tempN = `${space2dashLow(item.family)}-${k}-h3xfonts.ttf`;
		execSync(`mkdir -p ${global.setting["TEMP_FONT_DIR"]}/${tempF}/`);
		execSync(
			`curl -s "${url}" -o ${global.setting["TEMP_FONT_DIR"]}/${tempF}/${tempN}`
		);
	}
	execSync(
		`mv ${global.setting["TEMP_FONT_DIR"]}/${tempF}/*.ttf ${global.setting["SYS_FONT_DIR"]}`
	);
	execSync(`rm -rf ${global.setting["TEMP_FONT_DIR"]}/${tempF}/`);
	if (process.platform === "linux") {
		execSync("fc-cache -f -v");
	}
	add2db(item.family);
	event.reply("install-complete", item.family);
};

const Uninstall = (event, item) => {
	execSync(
		`rm -rf ${global.setting["SYS_FONT_DIR"]}/${space2dashLow(
			item.family
		)}-*-h3xfonts.ttf`
	);
	if (process.platform === "linux") {
		execSync("fc-cache -f -v");
	}
	removeFromdb(item.family);
	event.reply("uninstall-complete", item.family);
};

const add2db = fam => {
	let installed = [];
	let raw = fs.readFileSync(global.setting["FONT_DB"], "utf8");
	if (raw.trim() !== "") {
		installed = raw.split(":");
	}
	// put family to installed list
	installed.push(fam);
	// rewrite to file
	let str = installed.join(":");
	fs.writeFileSync(global.setting["FONT_DB"], str);
};

const removeFromdb = fam => {
	let installed = [];
	let NewInstalledList = [];
	let raw = fs.readFileSync(global.setting["FONT_DB"], "utf8");
	if (raw.trim() !== "") {
		installed = raw.split(":");
	}
	for (var i = 0; i < installed.length; i++) {
		if (installed[i] !== fam) {
			NewInstalledList.push(installed[i]);
		}
	}
	let str = NewInstalledList.join(":");
	fs.writeFileSync(global.setting["FONT_DB"], str);
};
