import React from "react";
import { Input, Typography, List, BackTop, Button } from "antd";

const { Search } = Input;
const { Title } = Typography;
const { ipcRenderer } = window.require("electron");
const utils = require("../utils/helper");

class Explore extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fonts: this.props.fonts,
			lists: this.props.fonts,
			loadingButton: {},
			buttonStatus: {},
			disabledButton: {},
			filterWord: ""
		};
		this.filterFont = this.filterFont.bind(this);
		this.updateLocalList = this.updateLocalList.bind(this);
		this.installFont = this.installFont.bind(this);
	}
	filterFont(input) {
		let filter = input.toUpperCase();
		this.setState({ filterWord: input });
		if(this.state.fonts.length !== 0) {
			let list = [];
			for (var i = 0; i < this.state.fonts.length; i++) {
				if (this.state.fonts[i].family.toUpperCase().indexOf(filter) > -1) {
					list.push(this.state.fonts[i]);
				}
				this.setState({
					lists: list
				});
			}
		} else {
			this.setState({
				lists: []
			});
		}
	}
	updateLocalList(name) {
		let NewFontList = [];
		for (var i = 0; i < this.state.fonts.length; i++) {
			if (this.state.fonts[i].family !== name) {
				NewFontList.push(this.state.fonts[i]);
			}
		}
		this.setState({
			fonts: NewFontList
		}, () => { this.filterFont(this.state.filterWord) });
	}
	installFont(item) {
		let name = utils.removeSpace(item.family);
		// set button to loading state
		let NewButtonStatus = this.state.buttonStatus;
		let NewLoadingButton = this.state.loadingButton;
		NewButtonStatus[name] = "Installing ... ";
		NewLoadingButton[name] = true;
		this.setState({
			loadingButton: NewLoadingButton,
			buttonStatus: NewButtonStatus
		});
		ipcRenderer.send("install-request", item);
		ipcRenderer.on("install-complete", (event, fam) => {
			this.props.SendNotification("Font installed successfully!");
			this.updateLocalList(fam);
		});
	}
	render() {
		return (
			<div>
				<div className="h3x-explore-header">
					<Title level={2}>Explore Fonts</Title>
					<Search
						value={this.state.filterWord}
						placeholder="Search fonts"
						onChange={e => this.filterFont(e.target.value)}
					/>
				</div>
				<div className="h3x-explore-font-list-container">
					<BackTop className="h3x-back-to-top" />
					<List
						dataSource={this.state.lists}
						renderItem={item => (
							<List.Item>
								<span>{item.family}</span>
								<Button
									loading={
										this.state.loadingButton[utils.removeSpace(item.family)]
									}
									onClick={this.installFont.bind(this, item)}
								>
									{utils.exists2default(
										this.state.buttonStatus[utils.removeSpace(item.family)],
										"Install"
									)}
								</Button>
							</List.Item>
						)}
					/>
				</div>
			</div>
		);
	}
}

export default Explore;
