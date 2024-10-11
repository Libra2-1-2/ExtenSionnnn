import "../css/Footer.css";
import React from "react";

function Footer() {
	return (
		<footer className="copyright">
			Made by&nbsp;&nbsp;
			<a
				
				target="_blank"
				rel="noreferrer"
			>
				longnguyen
			</a>
			&nbsp; with &nbsp;
			<a
				href="https://www.virustotal.com"
				target="_blank"
				rel="noreferrer"
			>
				Virus Total API
			</a>
		</footer>
	);
}

export default Footer;
