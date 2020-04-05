import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
	SearchOutlined,
	DownloadOutlined,
	InfoCircleOutlined
} from "@ant-design/icons";

import Explore from "./Explore";
import Installed from "./Installed";
import About from "./About";
import { inArray } from "../utils/helper";

const { Sider, Content, Header } = Layout;
const { remote, ipcRenderer } = window.require("electron");
const { log } = remote.require("electron-log");
const fs = remote.require("fs");

// set global setting
global.setting = remote.getGlobal("setting");

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			origin: [],
			fonts: [],
			installed: []
		};
		this.updateList = this.updateList.bind(this);
		this.listenForElectronRoute = this.listenForElectronRoute.bind(this);
	}
	componentDidMount() {
		var s3cr3t = process.env.REACT_APP_GOOGLE_WEBFONT_API;
		fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${s3cr3t}`)
			.then(res => res.json())
			.then(
				data => {
					this.setState({
						origin: data.items,
						fonts: data.items,
						installed: []
					});
				},
				err => {
					log.error(err);
					this.componentDidMount();
				}
			)
			.then(this.listenForElectronRoute)
			.then(this.updateList);
	}
	updateList() {
		let installedList = [];
		let fonts = [];
		let installed = [];
		let raw = fs.readFileSync(global.setting["FONT_DB"], "utf8");
		if (raw.trim() !== "") {
			installedList = raw.split(":");
		}
		for (var i = 0; i < this.state.origin.length; i++) {
			if (!inArray(this.state.origin[i].family, installedList)) {
				fonts.push(this.state.origin[i]);
			} else {
				installed.push(this.state.origin[i]);
			}
		}
		this.setState({
			fonts: fonts,
			installed: installed
		});
	}
	listenForElectronRoute() {
		ipcRenderer.on("electron-route", (event, route) => {
			document.getElementById(`h3x-electron-to-${route}`).click();
		});
	}
	SendNotification(msg) {
		new Notification("HexFonts", { body: msg });
	}
	render() {
		return (
			<Router>
				<Layout className="h3x-main-layout">
					<Header className="h3x-app-title-bar"></Header>
					<Sider collapsed className="h3x-sider" theme="light">
						<Menu
							className="h3x-main-menu"
							theme="light"
							mode="inline"
							defaultSelectedKeys={[
								`${window.location.href.split("#")[1]}`
							]}
						>
							<Menu.Item key="/">
								<SearchOutlined />
								<span>Explore</span>
								<Link
									id="h3x-electron-to-explore"
									to="/"
									onClick={this.updateList}
								/>
							</Menu.Item>
							<Menu.Item key="/installed">
								<DownloadOutlined />
								<span>Installed</span>
								<Link
									id="h3x-electron-to-installed"
									to="/installed"
									onClick={this.updateList}
								/>
							</Menu.Item>
							<Menu.Item key="/about">
								<InfoCircleOutlined />
								<span>About App</span>
								<Link
									id="h3x-electron-to-about"
									to="/about"
									onClick={this.updateList}
								/>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Content className="h3x-main-content">
							<Route
								exact
								path="/"
								component={() => (
									<Explore
										SendNotification={this.SendNotification}
										fonts={this.state.fonts}
									/>
								)}
							/>
							<Route
								exact
								path="/installed"
								component={() => (
									<Installed
										SendNotification={this.SendNotification}
										fonts={this.state.installed}
									/>
								)}
							/>
							<Route exact path="/about" component={About} />
						</Content>
					</Layout>
				</Layout>
			</Router>
		);
	}
}

export default Main;
