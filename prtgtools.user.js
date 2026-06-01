// ==UserScript==
// @name         PRTG tools
// @version      2026.6.1.2
// @updateURL    https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/prtg/prtgtools.meta.js
// @downloadURL  https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/prtg/prtgtools.user.js
// @description  Add page numbers, a countdown timer and clock (by replacing element <id=pagenumbers> and optionally <id=clock>)), and current Enovation status (OK or ERROR), and proxy status
// @author       Daniel
// @match        https://prtg.ddfr.nl/public/mapshow_simple.htm?id=*
// @match        https://gesp.zn-man.nl/tools/plugins
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';

    if (typeof window.plugin !== 'function') window.plugin = () => {};
    let self = window.plugin.prtgtools = () => {};

	self.namespace = 'window.plugin.prtgtools.';

    self.settings = {
        debug: false,
        intervaltimerid: 0,
        clocktimerid: 0,
        interval: 0
    };

	// example top URL: https://prtg.ddfr.nl/public/mapshow.htm?ids=9239:A99876C9-6175-4E7F-B569-17AD721E3C0B,9367:5ABE2F74-6B1C-4267-AF76-5C5CA09120B8,9337:0620931F-2F5C-403D-93A4-07641E352D60,9342:A02520F3-F5ED-4D85-92E2-1D527115B7CC&interval=30
	// example inner URL: https://prtg.ddfr.nl/public/mapshow_simple.htm?id=9337&mapid=0620931F-2F5C-403D-93A4-07641E352D60

	self.getTopURLinterval = () => {
		try {
			if (!window || !window.top || !window.top.document || !window.top.document.location) return false;
		} catch(e) {
			return false;
		}
		let topurl = window.top.document.location.href;
		let urlmatches = topurl.match(/interval=(\d+)/i);
		if (!urlmatches || urlmatches.length < 1) {
			if (self.settings.debug) console.log('NO TOP URL INTERVAL found',topurl);
			return false;
		}
		let interval = urlmatches[1];
		if (self.settings.debug) console.log('TOP URL INTERVAL found:',interval);

		return interval;
	};

	self.getTopURLidPages = () => {
		try {
			if (!window || !window.top || !window.top.document || !window.top.document.location) return false;
		} catch(e) {
			return false;
		}
		let topurl = window.top.document.location.href;

		let urlmatches = topurl.match(/ids=([^&]+)/);
		if (!urlmatches || urlmatches.length < 1) {
			if (self.settings.debug) console.log('NO TOP URL IDS found',topurl);
			return false;
		}
		let ids = urlmatches[1].split(',');
		if (self.settings.debug) console.log('TOP URL IDS found:',ids);

		return ids;
	};

	self.getCurrentURLidPageNumber = () => {
		let ids = self.getTopURLidPages();
		if (!ids) return false;
		if (self.settings.debug) console.log('IDs count:',ids.length);

		let url = window.document.location.href;
		let urlmatches = url.match(/id=([0-9]+)&mapid=([^&]+)/);
		if (!urlmatches || urlmatches.length < 1) {
			if (self.settings.debug) console.log('NO URL ID found',url);
			return false;
		}
		let id = urlmatches[1] + ':' + urlmatches[2];
		let currentPageNumber = (ids.indexOf(id) + 1);
		if (self.settings.debug) console.log('Current ID and PageNumber:',id,currentPageNumber);

		return currentPageNumber;
	};

	self.updateIntervalCountdown = () => {
		if (self.settings.interval <= 0) {
			clearInterval(self.settings.intervaltimerid);
			return;
		}
		self.settings.interval--;
		document.getElementById('interval').innerText = self.settings.interval;
	};

	self.loadpage = (pagenumber) => {
		let ids = self.getTopURLidPages();
		if (!ids) return false;

		// wrap around
		if (pagenumber <= 0) {
			pagenumber = ids.length;
		}
		if (pagenumber > ids.length) {
			pagenumber = 1;
		}

		let idmapid = ids[pagenumber-1];
		let id = idmapid.split(':')[0]
		let mapid = idmapid.split(':')[1];
		if (self.settings.debug) console.log('load page number ' + pagenumber + ': ','mapshow_simple.htm?id=' + id + '&mapid=' + mapid);
		//$('.mapshowiframe').attr("src", 'mapshow_simple.htm' + '?id=' + id + '&mapid=' + mapid);
		document.location.href = 'mapshow_simple.htm?id=' + id + '&mapid=' + mapid;
	};

	self.clock = () => {
		var date = new Date();
		var h = date.getHours(); // 0 - 23
		var m = date.getMinutes(); // 0 - 59
		var s = date.getSeconds(); // 0 - 59

		h = (h < 10) ? "0" + h : h;
		m = (m < 10) ? "0" + m : m;
		s = (s < 10) ? "0" + s : s;

		return h + ":" + m; // + ":" + s;
	};

	self.updateClock = () => {
		if (!document.getElementById('clock')) return;
		document.getElementById('clock').innerText = self.clock();
	};

	self.updateProxyStatus = () => {
        let proxystatus = document.querySelector('#proxystatus');
		if (!proxystatus) return;

        let stylesheet = document.body.appendChild(document.createElement('style'));
        stylesheet.innerHTML = `
#proxystatus {
    font-size: 20px;
    color: #FFF;
    border-radius: 6px;
    padding: 10px 12px;
    background-color: #c1a418;
    transition: 1s;
}
#proxystatus.ok {
    background-color: #2fac66;
}
#proxystatus.failed {
    background-color: #e6332a;
}
`;
        console.log('proxystatus ophalen');
        proxystatus.innerHTML = 'Proxy status ophalen...';

		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let response = JSON.parse(xmlhttp.responseText);
                proxystatus.innerHTML = `Proxy status: ${response.statustext}`;
                if (response.status == true) {
                    proxystatus.classList.add('ok');
                } else {
                    proxystatus.classList.add('failed');
                }
	        } else if (xmlhttp.readyState != 4) {
                proxystatus.innerHTML = `Proxy status wordt opgehaald`;
			} else if (xmlhttp.status != 200) {
                proxystatus.innerHTML = `Proxy status ophalen mislukt`;
                proxystatus.classList.add('failed');
            }
        };
		xmlhttp.open("GET","https://gesp.zn-man.nl/proxy/?json=1",true);
		xmlhttp.send();
    };

	self.updateEnovationStatus = () => {
        let enovationstatus = document.getElementById('enovationstatus');
		if (!enovationstatus) return;

		enovationstatus.style.fontSize = '20px';
		enovationstatus.style.color = '#FFF';
		enovationstatus.style.borderRadius = '6px';
		enovationstatus.style.padding = '10px 12px';

		enovationstatus.style.backgroundColor = '#c1a418'; // bruin-oranje
		enovationstatus.innerHTML = 'Enovation status ophalen...';

		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				if (self.settings.debug) console.log(xmlhttp.responseText);
				let page = document.createElement('html');
				page.innerHTML = xmlhttp.responseText;
                let statustext = page.querySelector('h1,p.text-brand-header-contrast\\/60,.border-state-investigating,.border-state-underway,.text-lg')?.innerText.trim();
                if (self.settings.debug) console.log(statustext);

				if (!statustext) {
					enovationstatus.style.backgroundColor = '#93224c'; // paars-rood
					enovationstatus.innerHTML = 'Enovation status niet gevonden';
					console.log("Enovation status leeg (geen h1)",page);
                } else if (statustext.match(/everything under control|alles onder controle/s)) {
					enovationstatus.style.backgroundColor = '#2fac66'; // groen
					enovationstatus.innerHTML = 'Enovation status: OK';
				} else if (statustext.match(/we are having issues/s)) {
					enovationstatus.style.backgroundColor = '#e6332a'; // rood
					enovationstatus.innerHTML = 'Enovation having ISSUES';
				} else if (statustext.match(/Ongoing/s)) {
                    let notice = page.querySelector('h3.notice-subject')?.innerText || "Ongoing";
                    enovationstatus.style.backgroundColor = '#2980b9'; // blauw
					enovationstatus.innerHTML = 'Enovation status: ' + notice;
				} else if (statustext.match(/In onderzoek/s)) {
                    enovationstatus.style.backgroundColor = '#2980b9'; // blauw
					enovationstatus.innerHTML = 'Enovation status: In onderzoek';
				} else if (statustext.match(/Underway/s)) {
                    enovationstatus.style.backgroundColor = '#2980b9'; // blauw
					enovationstatus.innerHTML = 'Enovation status: Underway';
				} else if (statustext.match(/(Scheduled maintenance|We have planned maintenance)/s)) {
					enovationstatus.style.backgroundColor = '#2980b9'; // blauw
					enovationstatus.innerHTML = 'Enovation onderhoud';
				} else {
					enovationstatus.style.backgroundColor = '#93224c'; // paars-rood
					enovationstatus.innerHTML = statustext;
					console.log("Enovation status onbekend",statustext);
				}
			} else if (xmlhttp.readyState != 4) {
				enovationstatus.style.backgroundColor = '#e9cd43'; // oranje
				enovationstatus.innerHTML = 'Enovation status wordt opgehaald';
			} else if (xmlhttp.status != 200) {
				enovationstatus.style.backgroundColor = '#b718c1'; // paars
				enovationstatus.innerHTML = 'Enovation status ophalen mislukt';
			}
		}

		xmlhttp.open("GET","https://status.enovationgroup.com/",true);
		xmlhttp.send();
	};

	self.setup = () => {
		if (typeof window.showpluginstatus == 'function') {
			window.showpluginstatus(GM_info.script.name,GM_info.script.version);
			return;
		}

        let stylesheet = document.head.appendChild(document.createElement('style'));
        stylesheet.innerHTML = `
.smallclock {
    font-family: courier;
    letter-spacing: 7px;
}
.bigclock {
    font-family: courier;
    letter-spacing: 7px;
    font-size: 600%;
    color: white;
    font-weight: bold;
}
#interval {
    font-size: large;
    color: white;
    font-weight: bold;
}
#pagenumbers {
    font-size: large;
    color: white;
    font-weight: bold;
}
#pagenumbers a {
    color: white;
}
`;
		self.settings.interval = self.getTopURLinterval();
		if (self.settings.interval === false) {
			self.settings.interval = 60;
			if (self.settings.debug) console.log('DEFAULT interval:',self.settings.interval);
		}
		let currentidpagenumber = self.getCurrentURLidPageNumber();
		if (currentidpagenumber === false) {
			if (self.settings.debug) console.log('NO currentidpagenumber FOUND');
		}

		let pagenumberstarget = document.getElementById('pagenumbers');
		let intervalspan = document.getElementById('interval');
		if (!intervalspan && pagenumberstarget) {
			intervalspan = pagenumberstarget.appendChild(document.createElement('span'));
		}
		if (intervalspan) {
			if (self.settings.debug) console.log("DEBUG PRTG intervalspan setup");
			intervalspan.id = 'interval';
			intervalspan.innerText = self.settings.interval;
		} else {
			if (self.settings.debug) console.log('NO interval id FOUND');
		}
		if (pagenumberstarget) {
			let ids = self.getTopURLidPages();
			if (currentidpagenumber) {
				pagenumberstarget.appendChild(document.createTextNode(' [' + currentidpagenumber + '/' + ids.length + ']'));
				pagenumberstarget.innerHTML += '<br /><a href="#" onclick="' + self.namespace + 'loadpage(' + (currentidpagenumber - 1) + '); return false;">&lt;&lt;</a>';
				for (let cnt = 1; cnt < ids.length + 1; cnt++) {
					pagenumberstarget.innerHTML += ' <a href="#" onclick="' + self.namespace + 'loadpage(' + cnt + '); return false;">&nbsp;' + cnt + '&nbsp;</a>';
				}
				pagenumberstarget.innerHTML += ' <a href="#" onclick="' + self.namespace + 'loadpage(' + (currentidpagenumber + 1) + '); return false;">&gt;&gt;</a>';
			}
			if (!document.getElementById('clock')) {
				pagenumberstarget.innerHTML += '<br /><span class="smallclock" id="clock"></span>';
			}
		} else {
			if (self.settings.debug) console.log('NO pagenumbers object id FOUND');
		}
		if (intervalspan) {
			self.settings.intervaltimerid = setInterval(self.updateIntervalCountdown, 1000);
		}

		let clocktarget = document.getElementById('clock');
		if (clocktarget) {
			clocktarget.append(self.clock());
            if (!document.querySelector('.smallclock')) {
                clocktarget.classList.add('bigclock');
            }
			self.settings.clocktimerid = setInterval(self.updateClock, 1000);
		} else {
			if (self.settings.debug) console.log('NO clock object id FOUND');
		}

		self.updateEnovationStatus();
        self.updateProxyStatus();
	}

	self.setup();
})();
