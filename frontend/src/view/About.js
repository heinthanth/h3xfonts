import React from 'react';
import { Typography, Timeline, Avatar } from 'antd';

const { Title, Paragraph } = Typography;
const { shell } = window.require('electron');

class About extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Title>About App</Title>
				<Paragraph>Simple, Hackable, Cross-platform application to install Google Fonts easily!</Paragraph>
				<Title level={2}>Supported Platform</Title>
				<Paragraph><b>Linux</b> and <b>macOS</b> are currently supported. Windows is under development.</Paragraph>
				<Title level={2}>Technologies</Title>
				<Paragraph><b>React.js</b> with <b>Ant-design</b> for User Interface & <b>Electron</b> and <b>cURL</b> for backend!</Paragraph>
				<Title level={2} style={{ marginBottom: 25 }}>ChangeLog</Title>
				<Timeline pending="Recording...">
					<Timeline.Item>Start development at 2020-03-23</Timeline.Item>
					<Timeline.Item>Delete and rewrite project for 3 times</Timeline.Item>
					<Timeline.Item>First working project at 2020-03-29</Timeline.Item>
					<Timeline.Item>Rewrite project for more condensed, clean codes and better UI at 30-3-2020</Timeline.Item>
					<Timeline.Item>First beta release with Linux and macOS support at 2020-04-5</Timeline.Item>
				</Timeline>
				<Title level={2}>Developer Info</Title>
				<Avatar src="https://heinthanth.com/image/profile.jpg" />
				<span style={{ marginLeft: 10 }}>Hein Thanth</span>
				<div style={{ marginTop: 10 }}>
					<a href="https://heinthanth.com" onClick={e => {e.preventDefault(); shell.openExternal("https://heinthanth.com") }}>https://heinthanth.com</a>
				</div>
				<div style={{ marginTop: 10 }}>
					<a href="mailto:contact@heinthanth.com" onClick={e => {e.preventDefault(); shell.openExternal("mailto:contact@heinthanth.com") }}>contact@heinthanth.com</a>
				</div>
			</React.Fragment>
		)
	}
}

export default About;