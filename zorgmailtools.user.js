// ==UserScript==
// @name         ZorgMail tools
// @namespace    https://gesp.zn-man.nl/
// @updateURL    https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/zorgmail/zorgmailtools.user.js
// @downloadURL  https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/zorgmail/zorgmailtools.user.js
// @version      2026.3.13.1
// @description  Diverse ZorgMail gerelateerde tools om het gebruik van Enovation Platform, M.Center, Passage ID en Adresboek allemaal wat makkelijker te maken.
// @author       Daniel
// @match        https://enovation.formstack.com/forms/untitled_form
// @match        https://adresboek.zorgmail.nl/*
// @match        https://enovationplatform.com/*
// @match        https://account.passageid.nl/auth/realms/passageid/login-actions/*
// @match        https://mcenter.zorgmail.nl/*
// @match        https://gesp.zn-man.nl/tools/plugins
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window.plugin !== 'function') window.plugin = function() {};
    window.plugin.zorgmailtools = function() {};
    let self = window.plugin.zorgmailtools;

    self.changelog = `
version 2026.3.13.1
- zorgmail adresboek kopieer animatie toegevoegd

version 2026.3.11.1
- zorgmail adresboek kopieer knoppen toegevoegd
- zorgmail adresboek aangeklikte details zichtbaar gemaakt in de pop-up

version 2026.2.18.1
- nieuwe functie, toon een knop om het mutatie formulier te vullen met nep gegevens >> helaas, dit werkt niet
  https://enovation.formstack.com/forms/untitled_form

version 2026.2.10.1
- samenvoeging van 7 eerder gemaakte plugins en code herschreven en aangepast waar nodig:

1. Zorgmail: admin M.Center buttons
Toon vorige/volgende buttons in M.Center detail weergave.
Hiermee kan eenvoudig door de gevonden lijst met berichten worden gebladerd vanuit de detail weergave.
Eenvoudig zoek resultaten kopiëren.

2. Zorgmail: admin M.Center keep alive
Zorgt ervoor dat het Zorgmail M.Center niet automatisch uitlogt.
Er komt een aftel tijd in beeld.
De pagina wordt na aftellen opnieuw geladen waardoor er niet wordt uitgelogd.
Klik op de tijd om de timer te resetten.

3. Zorgmail: Adresboek keep alive
Zorgt ervoor dat het Zorgmail Adresboek niet automatisch uitlogt.
In de achtergrond wordt er een zoek actie uitgevoerd, zodat het adresboek actief blijft.

4. ZorgMail: Enovation Platform keep alive

5. Zorgmail: Hosted Mail Password helper
Zodra het Hosted mail wachtwoord getoond wordt, worden automatisch de mailbox naam en het primaire e-mail adres er bij gezet.
Daarna is het eenvoudig om de resultaten te kopieren met 1 klik op de knop.

6. Zorgmail: List last visited mailboxes
Voeg laatst bezochte mailboxen toe aan de snelle selectie lijst.
De lijst wordt gewist als de hele pagina opnieuw wordt geladen.
EDI routering adres aanklikbaar om snel naar die mailbox te kunnen gaan.

7. ZorgMail: Passage ID- Vink automatisch het '30 dagen' vakje aan.
version 2.0.0.20230927.103500
- omgebouwd tot volwaardige plugin met showpluginstatus functionaliteit
version 1.0.0.20230516.144500
- eerste versie
`;
    self.observer = {};
    self.passwordstoragename = 'activatiecodes';

    self.keepalive = {
        adresboektime: 5 * 60 * 1000, // 5 minutes
        mcentertime: 5 * 60 * 1000, // 5 minutes
        platformtime: 20 * 60 * 1000, // 20 minutes
        time: 10 * 60 * 1000, // 10 minutes
        notifytime: 10 * 1000, // 10 seconds
        starttime: Date.now(),
        timerid: 0
    };

    self.arrowup = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvElEQVR4nJWQzUtUURjGf+fcexfZEJVJhYtatmgTKZHQygxmqHYZc6hACCoi+gvaRwsJhIiURr3DhLUbSRe36MOmL7QgWkWuNALpy2y66b3N22JmzJk5gr6rw3uer/eBVSYuiZfue5I7cu3BeBiXmlbDWUdE9OkbEzlMRjAZOXw1ePwtjFrWRI5L4p2//WoAkxGTnxWTnxVMRpK9j4I/fxuTqHrnM/0vs/7TD2nT3UlrcwKAT19/kbv7kFTb7iB7rsNs3eB9qXJ0jbP/5pZfmK4hA7Q2JzDdnYy9neky/S/urEyiquSewckhf+Jj+sTxDnZuSSCAQiHIMvDz9yL38gVSbbuC4Z72U9uavDk1H8abLo68u5ktTKePdu1nx+aNiNgOLM/cjyKjwRQH9myfun/hYFINPJ+5fNafvF4PPJlqh2UhxcjY68pbQMrKvWbfFVUS8bRSUQ370qgkD+1d0S6MP3sPfcfqS3fdBjKA6/IzXEJQFUMB122AKaXixm1FYP53VNuDRQDAvtUOC2EEqlKDAI6zDgHHYWGxnKDaI3o9AlpTXIr/348Cra1Qu0AUsWj9sHhZt563Rjr8A19jsoInL16BAAAAAElFTkSuQmCC';
    self.arrowdown = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0klEQVR4nJWRMWgUURCGv7d5S+5WYjw8UEF0TxGtbDzRiGnEwqQKWF0IHBIUT7GxNp29lrGx8M7CJsHCKmehiViIjYWiJtwqgoKKRMzu7e7b9yyyF9fLCmbKn/m/+WdGkFc3Fk2ufnNU9EsytzGOmTp1kD3lYQA+f1ul9eJjbms+wLbZuWOIKNEAlEtDuW3/BmhNqBIEYDLa/wOShCBSIAQbS+tkKwkSgig1iDRFshWAUvhRjNmYb0CpfIA2xraEiPsBv0K1Pr53hRyAMUbKu88/XaExf7sfsBaq1JreQSlozBuEAbOe7NbShxmxGqjtVx+8mm09W6lVDrsUncKfCWmGbAV+l85bjxNHdr181BgZk8NF+VNpUxc6obm4XNt9yGXQKWT+l5aA0O/y5b3HeHX/wr0Lx6fKjv1VAkhLxEqbuiMt/87jN9OlAy52sYDpUQyoMOTHise5Y/vac5dPThQGLB8yX5CWiI0xl/xu5DSfvqs5lQoDgzYgSMIIv9NhvOoutC6OTPbMfwEAhBBaaVPfJi1/tv16WrouAog9j7Gq2567NjqRNW8CZJOsdSOnubRcAzh7dO+T+43Tk/3mXEA2iUo034O49PD6mfNFudkM8BvdWMiMwwXJ+wAAAABJRU5ErkJggg==';
    self.lastclickedmcenterlabel = undefined;

    self.getDateTime = (time) => {
        let date = new Date(time);
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    self.shortTime = (time) => {
        if (time <= 0) {
            return '0:00:00';
        }
        time = time / 1000;
        // Setting and displaying hours, minutes, seconds
        var hours = (time / 3600) | 0;
        var minutes = ((time % 3600) / 60) | 0;
        var seconds = (time % 60) | 0;

        //hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    };

    self.getPasswords = () => {
        let data = {};
        try {
            data = localStorage[self.passwordstoragename] && JSON.parse(localStorage[self.passwordstoragename]) || {};
        } catch(e) {
            data = {};
        }
        return data;
    };

    self.storePassword = (username,password,textarea) => {
        let data = self.getPasswords();
        data[username] = {
            password: password,
            created: (new Date()).getTime(),
            textarea: textarea
        };
        localStorage[self.passwordstoragename] = JSON.stringify(data);
    };

    self.removePassword = (username) => {
        let data = self.getPasswords();
        if (data[username]) {
            delete(data[username]);
            localStorage[self.passwordstoragename] = JSON.stringify(data);
        }
    };

    self.applyStylesheet = () => {
        let stylesheet = document.head.querySelector('style.zorgmailtools');
        if (stylesheet) return;
        self.observer.disconnect();
        stylesheet = document.head.appendChild(document.createElement('style'));
        stylesheet.innerHTML = `
.zorgmailtoolslmslink {
    cursor: hand;
    text-decoration: underline;
}
#countdowntimer {
    display: inline;
    cursor: pointer;
    color: white;
}
.notifycolor {
    color: red !important;
}
#header\\.loginName.zorgmailtoolskeepalive {
    display: inline;
}
#mcentercountdowntimer {
    display: inline;
    cursor: hand;
}
.hidden {
    display: none;
}
.zorgmailtoolssearchradiobuttons label {
    display: block;
    cursor: hand;
}
`;
        self.observer.connect();
    };

    self.applyTrustMyDeviceCheckbox = () => {
        // https://account.passageid.nl/auth/realms/passageid/login-actions/*

		let trustMyDeviceCheckbox = document.querySelector('#trustMyDevice:not(.zorgmailtoolschecked)');
		if (trustMyDeviceCheckbox) {
            self.observer.disconnect();
            trustMyDeviceCheckbox.classList.add('zorgmailtoolschecked');
            trustMyDeviceCheckbox.checked = true;
            self.observer.connect();
        }
    };

    self.applyLMSlinks = () => {
        // https://mcenter.zorgmail.nl/*

        function updateMailboxSelector(fullmailbox) {
            let matches = fullmailbox.match(/([0-9]{9}@lms\.lifeline\.nl)/);
            if (!matches) return false;
            let mailbox = matches[1];

            let select = document.querySelector('.content-bar .gwt-ListBox');
            if (!select) return false;

            let option = [...select.options].find(option => option.value == mailbox);
            if (option && option.text == option.value && option.text != fullmailbox) {
                // update text
                self.observer.disconnect();
                option.text = fullmailbox;
            } else if (!option) {
                // add new option
                option = select.appendChild(document.createElement('option'));
                option.value = mailbox;
                option.text = fullmailbox;
                self.observer.disconnect();
            }
            self.observer.connect();

            return mailbox;
        }

        document.querySelectorAll('#selectedUser:not(.zorgmailtoolslmsname)').forEach(lmsname => {
            let matches = lmsname.innerText.match(/([0-9]{9}@lms\.lifeline\.nl)/);
            if (matches && lmsname.getAttribute('zorgmailtoolslmsname') != matches[0]) {
                self.observer.disconnect();
                lmsname.setAttribute('zorgmailtoolslmsname',matches[0]);
                updateMailboxSelector(lmsname.innerText);
                self.observer.connect();
            }
        });
        document.querySelectorAll('#archive\\.messageDetailView\\.message .gwt-Label:not(.zorgmailtoolslmslink), #archive\\.messageDetailView\\.sender .gwt-Label:not(.zorgmailtoolslmslink), #archive\\.messageDetailView\\.recipients .gwt-Label:not(.zorgmailtoolslmslink),#archive\\.messageHeader\\.headers .gwt-Label:not(.zorgmailtoolslmslink), #options\\.deliveryRules\\.viewMode\\.ediDeliveryAddressLabel:not(.zorgmailtoolslmslink)').forEach(lmslink => {
            let matches = lmslink.innerText.match(/([0-9]{9}@lms\.lifeline\.nl)/);
            if (!matches) return;
            self.observer.disconnect();
            lmslink.classList.add('zorgmailtoolslmslink');
            lmslink.addEventListener('click', e => {
                let select = document.querySelector('.content-bar .gwt-ListBox');
                if (!select) return;
                let mailboxvalue = updateMailboxSelector(matches[0]);
                if (mailboxvalue) {
                    select.value = mailboxvalue;
                    select.dispatchEvent(new Event("change"));
                }
            },false);
        });
        self.observer.connect();
    };

    self.applyPasswordHelper = () => {
        // https://mcenter.zorgmail.nl/*

        // add click event to newHMActivationCode label:
        document.querySelectorAll('#optionspasswords\\.newHMActivationCode\\.ok:not(.zorgmailtoolsclickadded)').forEach(okbutton => {
            let username = document.getElementById('optionspasswords.newHMActivationCode.username')?.innerText;
            if (!username) return;

            self.observer.disconnect();
            okbutton.classList.add('zorgmailtoolsclickadded');
            okbutton.addEventListener('click', e => {
                // console.log("setupListeners newHMActivationCode ok clicked",username,password);
                let username = document.getElementById('optionspasswords.newHMActivationCode.username')?.innerText;
                let password = document.getElementById('optionspasswords.newHMActivationCode.password')?.innerText;
                if (username && password) {
                    self.storePassword(username,password,document.getElementById('HWpassword').value);
                }
            },false);
        });

        document.querySelectorAll('#optionspasswords\\.newHMActivationCode\\.password:not(.zorgmailtoolsshowdetails)').forEach(password => {
            let username = document.getElementById('optionspasswords.newHMActivationCode.username')?.innerText;
            if (!username) return;

            self.observer.disconnect();
            password.classList.add('zorgmailtoolsshowdetails');

            let newRow = password.parentElement.parentElement.parentElement.insertRow(3);
            let leftCell = newRow.insertCell();
            leftCell.style.verticalAlign = 'top';

            leftCell.appendChild(document.createTextNode('Brief gegevens:'));

            let newCell = newRow.insertCell();

            let textarea = newCell.appendChild(document.createElement('textarea'));
            textarea.setAttribute("id", "HWpassword");
            textarea.cols = "50";
            textarea.rows = "5";

            newCell.appendChild(document.createElement('br'));

            let copyButton = newCell.appendChild(document.createElement('button'));
            copyButton.appendChild(document.createTextNode("Selecteer en kopieer"));
            copyButton.addEventListener("click", function () {
                textarea.focus();
                textarea.select();
                document.execCommand("Copy");
            }, false);

            let message = newCell.appendChild(document.createElement('span'));
            message.style.fontWeight = 'bold';
            message.textContent = 'Let op: De activatiecode wordt pas actief na een klik op OK';

            let selectedUser = document.getElementById('selectedUser')?.innerText;
            selectedUser = selectedUser.replace(' (' + username + '@lms.lifeline.nl)','').trim();
            let email = document.getElementById('options.myAddress.viewMode.defaultAddressBookSecureEmail')?.innerText;

            textarea.value = selectedUser + "\n" + username + "\n" + password.innerText + "\n" + email;
        });

        document.querySelectorAll('.gwt-ETable.credential-table.zorgmailtoolstable').forEach(passwordstable => {
            if (passwordstable.rows.length > 1) return;

            self.observer.disconnect();
            passwordstable.classList.remove('zorgmailtoolstable');
            self.observer.connect();
        });

        document.querySelectorAll('.gwt-ETable.credential-table:not(.zorgmailtoolstablewidth)').forEach(passwordstable => {
            self.observer.disconnect();
            passwordstable.classList.add('zorgmailtoolstablewidth');
            passwordstable.rows[0].cells[0].width = '';
            passwordstable.rows[0].cells[1].width = '25%';
        });

        document.querySelectorAll('.gwt-ETable.credential-table').forEach(passwordstable => {
            if (passwordstable.querySelector('.zorgmailtoolspassworddetected')) return;
            if (passwordstable.rows.length <= 1) return;

            self.observer.disconnect();
            passwordstable.rows[1].classList.add('zorgmailtoolspassworddetected');

            // find last row with an active Activatiecode
            let lastactiverow = undefined;
            let user;
            [...passwordstable.rows].forEach(row => {
                if (row.cells.length > 4 && row.cells[1].textContent.trim() == 'Activatiecode' && row.cells[4].querySelector('.badge.badge-success')) {
                    lastactiverow = row;
                    user = row.cells[2].textContent.replace(/[^0-9].*$/,'');
                }
            });

            let removepasswordrow = passwordstable.querySelector('.zorgmailtoolsremovepasswordrow');

            let storedpasswords = self.getPasswords();
            if (lastactiverow && storedpasswords[user]) {
                if (removepasswordrow) removepasswordrow.remove();
                let tdlist = lastactiverow.getElementsByTagName('td');
                console.log("display active password",user,storedpasswords[user].password,Date(storedpasswords[user].created));
                self.passwordtabletimerid = 'busy'; // needed to prevent DOMNodeInserted to get triggered again
                // tdlist[1].innerHTML = tdlist[1].textContent.trim() + ':<br><textarea cols="50" rows="5">' + storedpasswords[user].textarea + '</textarea>'; // this will trigger the DOMNodeInserted event again!

                tdlist[1].textContent = tdlist[1].textContent.trim() + ' (door jou aangemaakt en alleen voor jou zichtbaar):';

                let textarea = tdlist[1].appendChild(document.createElement('textarea'));
                textarea.cols = "50";
                textarea.rows = "5";

                textarea.value = storedpasswords[user].textarea;

                tdlist[1].appendChild(document.createElement('br'));

                let copyButton = tdlist[1].appendChild(document.createElement('button'));
                copyButton.appendChild(document.createTextNode("Selecteer en kopieer"));
                copyButton.addEventListener("click", function () {
                    textarea.focus();
                    textarea.select();
                    document.execCommand("Copy");
                }, false);

                self.passwordtabletimerid = undefined;
            } else {
                user = document.querySelector('#selectedUser').innerText.replace(/^.*([0-9]{9})@.*$/g,'$1');
                if (storedpasswords[user]) {
                    // if there is no active row found, then the stored password is inactive
                    if (removepasswordrow) removepasswordrow.remove();
                    removepasswordrow = passwordstable.insertRow();
                    removepasswordrow.classList.add('zorgmailtoolsremovepasswordrow');
                    let cell1 = removepasswordrow.insertCell();
                    let removebutton = cell1.appendChild(document.createElement('button'));
                    removebutton.innerText = 'Verwijder verlopen activatiecode';
                    let cell2 = removepasswordrow.insertCell();
                    cell2.innerText = 'Activatiecode: ' + storedpasswords[user].password;
                    let cell3 = removepasswordrow.insertCell();
                    cell3.innerText = user;
                    let cell4 = removepasswordrow.insertCell();
                    cell4.innerText = self.getDateTime(storedpasswords[user].created);

                    removebutton.addEventListener('click',e => {
                        self.removePassword(user);
                        removepasswordrow.remove();
                    },false);
                    // console.log("Tip: remove inactive password",user,storedpasswords[user].password);
                }
            }
        });

        self.observer.connect();
    };

    self.applyPlatformKeepalive = () => {
        // https://enovationplatform.com/*

        function reload() {
            console.log(`[${new Date()}] Voorkom automatisch uitloggen door een pagina reload`);
            location.reload();
        }

        function updateCountDownObject() {
            let countdownObj = document.getElementById('countdowntimer');
            if (!countdownObj) return;

            let timetogo = self.keepalive.time - (Date.now() - self.keepalive.starttime);
            let newtext = self.shortTime(timetogo);
            if (newtext != countdownObj.innerText) {
                self.observer.disconnect();
                countdownObj.innerText = newtext;
            }
            if (timetogo <= 0) {
                reload();
            }

            if (timetogo <= self.keepalive.notifytime) {
                if (!countdownObj.classList.contains('notifycolor')) {
                    self.observer.disconnect();
                    countdownObj.classList.add('notifycolor');
                }
            } else {
                if (countdownObj.classList.contains('notifycolor')) {
                    self.observer.disconnect();
                    countdownObj.classList.remove('notifycolor');
                }
            }
            self.observer.connect();
        }

        function resetCountDownTimer() {
            self.keepalive.time = self.keepalive.platformtime;
            self.keepalive.starttime = Date.now();
            updateCountDownObject();
        }

        document.querySelectorAll('.header-actions:not(.zorgmailtoolstimer)').forEach(header => {
            self.observer.disconnect();
            header.classList.add('zorgmailtoolstimer');

            let countdownObj = document.createElement('div');
            countdownObj.title = 'Tijd tot automatische pagina update. Klik voor handmatige update';
            countdownObj.id = 'countdowntimer';

            let countdownText = document.createTextNode('');
            countdownObj.appendChild(countdownText);
            countdownObj.onclick = function () {
                reload();
                resetCountDownTimer();
            };

            header.insertBefore(countdownObj, header.children[0]);
            resetCountDownTimer();

            if (self.keepalive.timerid) clearInterval(self.keepalive.timerid);
            self.keepalive.timerid = setInterval(updateCountDownObject,500);
        });

        self.observer.connect();
    };

    self.applyAdresboekKeepalive = () => {
        // https://adresboek.zorgmail.nl/*

        function timeraction(time) {
            let url = 'https://adresboek.zorgmail.nl/api/addressbook/search?q=justchecking&start=1&rows=100';

            if (typeof XMLHttpRequest !== 'function') {
                console.log(GM_info.script.name + ': WARNING no XMLHttpRequest support ' + window.location.href);
                clearInterval(self.keepalive.timerid);
                return;
            }

            if (!document.getElementById('header-user')) {
                console.log(GM_info.script.name + ': WARNING no header-user element found');
                clearInterval(self.keepalive.timerid);
                return;
            }

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    if (!this.responseText.match(/numFound/)) { // {"numFound":0,"addresses":null}
                        console.log(GM_info.script.name + ': keepalive after ' + parseInt(time / 1000) + ' seconds: FAILED ');
                        console.log('url:',url);
                        console.log('responseText:',this.responseText);
                        clearInterval(self.keepalive.timerid);
                        return;
                    }
                    console.log(GM_info.script.name + ': keepalive after ' + parseInt(time / 1000) + ' seconds: success');
                } else if (this.readyState === 1 && this.status !== 0 || this.readyState !== 1 && this.status !== 200) {
                    console.log(GM_info.script.name + ': keepalive after ' + parseInt(time / 1000) + ' seconds: ERROR');
                    console.log('url:',url);
                    console.log('readyState:',this.readyState);
                    console.log('status:',this.status);
                    console.log('responseText:',this.responseText);
                    clearInterval(self.keepalive.timerid);
                }
            };

            xhttp.open("GET", url, true);
            xhttp.send();
        }

        document.querySelectorAll('#header-user:not(.zorgmailtoolskeepalive)').forEach(header => {
            self.observer.disconnect();
            header.classList.add('zorgmailtoolskeepalive');

            self.keepalive.time = self.keepalive.adresboektime;

            if (self.keepalive.timerid) clearInterval(self.keepalive.timerid);

            console.log(GM_info.script.name + ': keepalive every ' + parseInt(self.keepalive.time / 1000) + ' seconds');
            setTimeout(() => { timeraction(2000); },2000); // try after 2 seconds
            self.keepalive.timerid = setInterval(() => { timeraction(self.keepalive.time); }, self.keepalive.time);
        });

        self.observer.connect();
    };

    self.applyAdresboekButtons = () => {
        // https://adresboek.zorgmail.nl/*
        if (!document.querySelector('style.zorgmailtoolsadresboek')) {
            self.observer.disconnect();
            let stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.className = 'zorgmailtoolsadresboek';
            stylesheet.innerHTML = `
.zorgmailtoolsresultclicked {
    border: 1px solid #107cb1;
}
.zorgmailtoolscard .card-text {
    padding-right: .5rem;
    padding-left: .5rem;
}
.zorgmailtoolscopyicon {
    width: 20px;
    height: 20px;
    display: inline-block;
}
.zorgmailtoolscopyicon::before {
    content: url('data:image/svg+xml;charset=UTF-8,<svg class="copyicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M480 400L288 400C279.2 400 272 392.8 272 384L272 128C272 119.2 279.2 112 288 112L421.5 112C425.7 112 429.8 113.7 432.8 116.7L491.3 175.2C494.3 178.2 496 182.3 496 186.5L496 384C496 392.8 488.8 400 480 400zM288 448L480 448C515.3 448 544 419.3 544 384L544 186.5C544 169.5 537.3 153.2 525.3 141.2L466.7 82.7C454.7 70.7 438.5 64 421.5 64L288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L368 496L368 512C368 520.8 360.8 528 352 528L160 528C151.2 528 144 520.8 144 512L144 256C144 247.2 151.2 240 160 240L176 240L176 192L160 192z"/></svg>');
}
.zorgmailtoolsdoneicon::before {
    content: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>');
}
.zorgmailtoolscopied {
    background-color: #b3edff;
}
.zorgmailtoolscopiedanimation {
    background-color: rgba(255, 0, 0, 0);
    transition: background-color 2s;
}
.result-title .muted {
    margin-left: 10px;
}
`;
        }

        document.querySelectorAll('a.addressbook-result:not(.zorgmailtoolsbuttons)').forEach(result => {
            let mailbox = result.querySelector('.result-title span[_ngcontent-c1]');
            if (!mailbox) return;

            self.observer.disconnect();

            result.classList.add('zorgmailtoolsbuttons');
            let resulttitle = document.createElement('span');
            //resulttitle.innerText = result.querySelector('.result-title').childNodes[0].textContent.replace(/^\s+/,'').replace(/\s+$/,'') + "\n";
            //result.querySelector('.result-title').removeChild(result.querySelector('.result-title').childNodes[0]);
            //result.querySelector('.result-title').prepend(resulttitle);

            [
                {text:'Mailbox', element: mailbox, alert:'Deze mailbox is gekopieerd:',copytext: mailbox.innerText },
                {text:'Klantnaam', element: resulttitle, alert:'Deze klantnaam is gekopieerd:',copytext: resulttitle.textContent },
                {text:'Details', element: result.querySelector('.result-info'), alert:'Deze details zijn gekopieerd:',copytext: result.querySelector('.result-info').innerText},
            ].forEach(buttondetails => {
                let copyicon = document.createElement('span');
                copyicon.className = 'zorgmailtoolscopyicon';

                let button = document.createElement('button');
                button.className = 'btn btn-primary btn-icon ng-star-inserted';
                button.textContent = buttondetails.text;
                button.prepend(copyicon);
                button.addEventListener('click',e => {
                    e.stopPropagation();

                    document.querySelectorAll('.zorgmailtoolsdoneicon').forEach(element => element.classList.remove('zorgmailtoolsdoneicon'));
                    copyicon.classList.add('zorgmailtoolsdoneicon');

                    document.querySelectorAll('.zorgmailtoolsresultclicked').forEach(element => element.classList.remove('zorgmailtoolsresultclicked'));
                    result.classList.add('zorgmailtoolsresultclicked');

                    document.querySelectorAll('.zorgmailtoolscopied').forEach(element => element.classList.remove('zorgmailtoolscopied'));
                    document.querySelectorAll('.zorgmailtoolscopiedanimation').forEach(element => element.classList.remove('zorgmailtoolscopiedanimation'));
                    buttondetails.element.classList.add('zorgmailtoolscopied');
                    setTimeout(() => {
                        buttondetails.element.classList.add('zorgmailtoolscopiedanimation');
                    },1000);

                    let text = buttondetails.copytext;
                    navigator.clipboard.writeText(text).then(() => {
                        // alert(`${buttondetails.alert}\n\n${text}\n\nDeze kun je nu ergens plakken.`);
                    }).catch(() => {
                        alert("Het kopieren werkt helaas niet.");
                    });
                });
                result.querySelector('.action-buttons').prepend(button);
            });
        });

        document.querySelectorAll('a.addressbook-result:not(.zorgmailtoolsresult)').forEach(result => {
            self.observer.disconnect();
            result.classList.add('zorgmailtoolsresult');
            result.addEventListener('click',e => {
                document.querySelectorAll('.zorgmailtoolsresultclicked').forEach(element => {
                    element.classList.remove('zorgmailtoolsresultclicked');
                });
                result.classList.add('zorgmailtoolsresultclicked');
            });
        });

        document.querySelectorAll('address-details-modal .modal-body').forEach(modal => {
            let clickedrow = document.querySelector('.zorgmailtoolsresultclicked');
            if (!clickedrow || !clickedrow.querySelector('.result-title span[_ngcontent-c1]')) return;

            let card = modal.querySelector('.zorgmailtoolscard');
            if (card && card.getAttribute('mailbox') == clickedrow.querySelector('.result-title span[_ngcontent-c1]').innerText) return;

            self.observer.disconnect();

            if (!card) {
                card = document.createElement('div');
                card.className = 'card';
                card.classList.add('zorgmailtoolscard');
                let cardblock = card.appendChild(document.createElement('div'));
                cardblock.className = 'card-block';
                modal.prepend(card);
                let cardtitle = cardblock.appendChild(document.createElement('div'));
                cardtitle.className = 'card-title';
                cardtitle.innerText = 'Details';
                let cardtext = cardblock.appendChild(document.createElement('div'));
                cardtext.className = 'card-text';
            }

            card.setAttribute('mailbox',clickedrow.querySelector('.result-title span[_ngcontent-c1]').innerText);
            let cardtext = card.querySelector('.card-text');
            cardtext.innerHTML = clickedrow.querySelector('.result-info').innerHTML;
            cardtext.querySelectorAll('button').forEach(button => button.remove());
        });

        document.querySelectorAll('address-details-modal .modal-footer').forEach(modalfooter => {
            if (modalfooter.classList.contains('zorgmailtoolsfooter')) return;

            self.observer.disconnect();

            modalfooter.classList.add('zorgmailtoolsfooter');
            let copybutton = document.createElement('button');
            copybutton.className = 'btn btn-primary btn-icon ng-star-inserted';
            copybutton.textContent = 'Kopieer details';
            copybutton.addEventListener('click',e => {
                e.stopPropagation();
                let text = document.querySelector('.zorgmailtoolsresultclicked .result-info').innerText;
                navigator.clipboard.writeText(text).then(() => {
                    alert(`Deze details zijn gekopieerd:\n\n${text}\n\nDeze kun je nu ergens plakken.`);
                }).catch(() => {
                    alert("Het kopieren werkt helaas niet.");
                });
            });
            modalfooter.prepend(copybutton);
        });
        self.observer.connect();
    };

    self.applyMCenterKeepalive = () => {
        // https://mcenter.zorgmail.nl/*

        function reload() {
            console.log('Voorkom automatisch uitloggen door een configuration request');

            let xhr = new XMLHttpRequest();

            xhr.onload = function() {
                if (xhr.status != 200) { // analyze HTTP status of the response
                    console.log(`ERROR - Request mislukt: ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
                } else { // show the result
                    console.log(`OK - Ontvangen ${xhr.response.length} bytes`); // response is the server response
                }
            };

            xhr.onprogress = function(event) {
                if (event.lengthComputable) {
                    console.log(`OK - Deel ontvangen ${event.loaded} van ${event.total} bytes`);
                } else {
                    console.log(`OK - Deel ontvangen ${event.loaded} bytes`); // no Content-Length
                }
            };

            xhr.onerror = function() {
                console.log('ERROR - Request mislukt');
                location.reload();
            };

            xhr.open('POST', 'https://mcenter.zorgmail.nl/services/configuration');
            xhr.setRequestHeader('Content-Type', 'text/x-gwt-rpc; charset=UTF-8');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('X-GWT-Module-Base', 'https://mcenter.zorgmail.nl/mcenter/');
            xhr.setRequestHeader('X-GWT-Permutation', 'FB7D0F7A3EB58512FC688329EADECA0A');
            xhr.send('7|0|4|https://mcenter.zorgmail.nl/mcenter/|9B5C05DC0AED1098D14F35522ED37973|nl.enovation.ems.mcenter.client.service.ConfigurationService|getConfigurationDTO|1|2|3|4|0|');
        }

        function updateCountDownObject() {
            let countdownObj = document.getElementById('mcentercountdowntimer');
            if (!countdownObj) return;

            let timetogo = self.keepalive.time - (Date.now() - self.keepalive.starttime);
            let newtext = self.shortTime(timetogo);
            if (newtext != countdownObj.innerText) {
                self.observer.disconnect();
                countdownObj.innerText = newtext;
            }
            if (timetogo <= 0) {
                reload();
            }

            if (timetogo <= self.keepalive.notifytime) {
                if (!countdownObj.classList.contains('notifycolor')) {
                    self.observer.disconnect();
                    countdownObj.classList.add('notifycolor');
                }
            } else {
                if (countdownObj.classList.contains('notifycolor')) {
                    self.observer.disconnect();
                    countdownObj.classList.remove('notifycolor');
                }
            }
            self.observer.connect();
        }

        function resetCountDownTimer() {
            if (self.keepalive.timerid) clearTimeout(self.keepalive.timerid);
            self.keepalive.time = self.keepalive.mcentertime;
            self.keepalive.starttime = Date.now();
            updateCountDownObject();
            self.keepalive.timerid = setInterval(updateCountDownObject,500);
        }

        function setupAjaxMonitor() {
            let oldXHR = window.XMLHttpRequest;
            // console.log(window.length,oldXHR);
            window.XMLHttpRequest = function newXHR() {
                let realXHR = new oldXHR();
                realXHR.addEventListener("readystatechange", () => {
                    if (realXHR.readyState == 1) {
                        resetCountDownTimer();
                        // console.log('server connection established');
                    }
                    /*
                if(realXHR.readyState==2){
                    console.log('request received');
                }
                if(realXHR.readyState==3){
                    console.log('processing request');
                }
                if(realXHR.readyState==4){
                    console.log('request finished and response is ready');
                }
                */
                }, false);
                return realXHR;
            };
        }

        document.querySelectorAll('#header\\.loginName:not(.zorgmailtoolskeepalive)').forEach(header => {
            self.observer.disconnect();
            header.classList.add('zorgmailtoolskeepalive');

            let countdownObj = document.createElement('div');
            countdownObj.title = 'Tijd tot automatische pagina update. Klik voor handmatige update';
            countdownObj.id = 'mcentercountdowntimer';

            let countdownText = document.createTextNode('');
            countdownObj.appendChild(countdownText);
            countdownObj.onclick = function () {
                reload();
            };

            header.parentElement.insertBefore(countdownObj, header.parentElement.children[0]);

            setupAjaxMonitor();
            updateCountDownObject();
            self.keepalive.timerid = setInterval(updateCountDownObject,500);
        });

        self.observer.connect();
    };

    self.applyMCenterButtons = () => {
        // https://mcenter.zorgmail.nl/*

        function isVisible(el) {
            if (!(el instanceof Element)) {
                return false;
                // throw new Error('Argument is not a DOM element.');
            }

            const style = window.getComputedStyle(el);
            // Check if element is hidden via CSS
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
            }

            // Check if element has dimensions in the layout
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }

        function selectlastclickedmcenterlabel() {
            if (!self.lastclickedmcenterlabel) return;

            if (isVisible(document.querySelectorAll('.toolbar')[0])) { // wait for toolbar 0 to be visible
                // console.log('click toolbar label',self.lastclickedmcenterlabel.id);
                self.lastclickedmcenterlabel.click();
            } else {
                setTimeout(() => {
                    selectlastclickedmcenterlabel();
                },100);
            }
        }

        function selectoffsetrow(offset) {
            let firstindex = 1;
            let lastindex = document.querySelectorAll('#archive\\.messageOverview\\.messageTable >tbody >tr').length - 1;
            let selectedindex = document.querySelector('.gwt-ETable-selected')?.rowIndex;
            if (selectedindex + offset < firstindex) {
                alert('bovenste regel bereikt');
            } else if (selectedindex + offset > lastindex) {
                alert('laatste regel bereikt');
            } else {
                [0,1].forEach(cnt => { document.querySelectorAll('#archive\\.messageOverview\\.messageTable >tbody >tr')[selectedindex + offset].querySelectorAll('td')[1].click(); });
                selectlastclickedmcenterlabel();
            }
        }

        // er is een toolbar per view - voor de weergave van berichten zijn er 3 afzonderlijke toolbars: details, headers, documenten
        // elke toolbar krijgt extra buttons en er wordt bijgehouden welke button er als laatste is geklikt om naar toe te herstellen
        document.querySelectorAll('.toolbar:not(.zorgmailtoolstoolbar)').forEach((toolbar,index) => {
            let buttontable = toolbar.querySelector('table');
            if (buttontable.querySelectorAll('.gwt-Label')[0].innerText != 'Berichtoverzicht') return;

            self.observer.disconnect();
            toolbar.classList.add('zorgmailtoolstoolbar');

            buttontable.querySelectorAll('.gwt-Label').forEach(label => {
                if (label.id) {
                    label.addEventListener('click',e => {
                        // console.log('click toolbar',index,label.id);
                        self.lastclickedmcenterlabel = label;
                    },false);
                }
            });


            [{icon:self.arrowup,text:'vorige',click:() => { selectoffsetrow(-1); }},{icon:self.arrowdown,text:'volgende',click:() => { selectoffsetrow(1); }}].forEach(button => {
                let cell = toolbar.querySelector('table').rows[0].insertCell();
                cell.align = 'left';
                cell.style.verticalAlign = 'top';
                cell.innerHTML = toolbar.querySelector('table').rows[0].cells[1].innerHTML;
                cell.querySelector('.gwt-Image').src = button.icon;
                cell.querySelector('.gwt-Label').innerText = button.text;
                cell.querySelectorAll('.gwt-Image, .gwt-Label').forEach(gwt => {
                    gwt.addEventListener('click',e => {
                        button.click();
                    },false);
                });
            });
        });;
        self.observer.connect();
    };

    self.applyMCenterCopySearchResults = () => {
        // https://mcenter.zorgmail.nl/*

        function copySearchResults() {
            let suggestionsrows = document.querySelectorAll('.suggestPopupMiddleCenter tr');
            if (!suggestionsrows.length) return;

            let lines = [...suggestionsrows].map(tr => (tr.querySelector('.disabled') ? 'X ' : '') + tr.innerText);
            prompt('Selecteer en kopieer de tekst:',lines.join('\r\n'));
        }

        document.querySelectorAll('.suggestPopupMiddleCenter:not(.zorgmailsuggestions)').forEach(suggestions => {
            self.observer.disconnect();
            suggestions.classList.add('zorgmailsuggestions');
            let copybutton = document.createElement('i');
            copybutton.className = 'content-bar-small';
            copybutton.innerText = 'Kopieer resultaten';
            copybutton.addEventListener('click',e => {
                copySearchResults();
            },false);
            suggestions.append(copybutton);
        });

        self.observer.connect();
    };

    self.applyMCenterSearchForm = () => {
        // https://mcenter.zorgmail.nl/*

        document.querySelectorAll('select#archive\\.searchMessage\\.addressTypes:not(.zorgmailtoolssearch)').forEach(select => {
            self.observer.disconnect();
            select.classList.add('zorgmailtoolssearch');
            select.classList.add('hidden');

            let div = select.parentElement.appendChild(document.createElement('div'));
            div.className = 'zorgmailtoolssearchradiobuttons';
            for (let option of select.options) {
                let label = div.appendChild(document.createElement('label'));
                let radio = label.appendChild(document.createElement('input'));
                radio.type = 'radio';
                radio.value = option.value;
                radio.name = 'addressTypes';
                radio.checked = option.value == select.value;
                label.append(option.value);
                radio.addEventListener('click',e => {
                    e.stopPropagation();
                    select.value = e.target.value;
                },false);
            }
        });

        let checkedradio = document.querySelector("input[name='addressTypes']:checked");
        let select = document.querySelector('select#archive\\.searchMessage\\.addressTypes.zorgmailtoolssearch');
        if (checkedradio && select && select.value != checkedradio.value) {
            select.value = checkedradio.value;
        }

        self.observer.connect();
    };

    self.applyFormFillerButton = () => {
        return; // helaas, dit werkt niet

        // https://enovation.formstack.com/forms/untitled_form
        document.querySelectorAll('#fsHeaderImage:not(.zorgmailtoolsbutton)').forEach(header => {
            self.observer.disconnect();
            header.classList.add('zorgmailtoolsbutton');
            let button = header.appendChild(document.createElement('button'));
            button.textContent = 'Vul het formulier';
            button.addEventListener('click', e => {
                document.querySelectorAll('input[required]').forEach(input => {
                    let value = undefined;
                    switch (input.name) {
                        case 'field154041193':
                            value = 'GERRIT Servicedesk TEST formulier'; // Organisatienaam
                            break;
                    }
                    if (value) {
                        input.focus();
                        setTimeout(() => {
                            input.value = value;
                            input.setAttribute('value',value);
                        });
                    }
                });
            },false);
        });
        self.observer.connect();
    };

    self.applyChanges = function() {
        //console.log('applyChanges');
        self.applyStylesheet();
        self.applyTrustMyDeviceCheckbox();
        self.applyLMSlinks();
        self.applyPasswordHelper();
        self.applyPlatformKeepalive();
        self.applyAdresboekKeepalive();
        self.applyAdresboekButtons();
        self.applyMCenterKeepalive();
        self.applyMCenterButtons();
        self.applyMCenterCopySearchResults();
        self.applyMCenterSearchForm();
        self.applyFormFillerButton();
    };

    self.setupObserver = function(target,callback) {
        // then run when changes are detected:
        self.observer = new MutationObserver(() => {
            callback();
        });

        // add extra function:
        self.observer.target = target;
        self.observer.config = {
            subtree: true,
            childList: true,
        }
        self.observer.isconnected = false;
        self.observer.original_disconnect = self.observer.disconnect.bind(self.observer);
        self.observer.disconnect = function() {
            if (!this.isconnected) return;
            this.isconnected = false;
            this.original_disconnect();
        }
        self.observer.connect = function() {
            if (this.isconnected) return;
            this.isconnected = true;
            this.observe(this.target,this.config);
        }
        // activate monitoring
        callback();
        self.observer.connect();
    };

    self.restoreconsole = function() {
        if (!console.log?.toString().match(/native code/)) {
            let iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            window.console = iframe.contentWindow.console;
            // console.log("console is hersteld");
        }
    };

    self.setup = function () {
        self.setupObserver(document.documentElement || document.body,self.applyChanges);
    };

    self.restoreconsole();
    console.log('plugin loaded: ' + GM_info.script.name + ' version ' + GM_info.script.version);
    if (typeof window.showpluginstatus == 'function') {
        window.showpluginstatus(GM_info.script.name,GM_info.script.version);
    } else {
        self.setup();
    }
})();
