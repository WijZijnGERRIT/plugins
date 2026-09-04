// ==UserScript==
// @name         Tribe CRM tools
// @namespace    https://gesp.zn-man.nl/
// @updateURL    https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/tribe/tribecrmtools.user.js
// @downloadURL  https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/tribe/tribecrmtools.user.js
// @version      2026.9.4.1
// @description  Dankzij deze plugin zijn er diverse tools om Tribe een beetje beter te maken. De instellingen en keuzes voor deze tools worden alleen opgeslagen in deze browser sessie en worden niet bewaard in Tribe.
// @author       Daniel
// @match        https://app.tribecrm.nl/*
// @match        https://auth.tribecrm.nl/login*
// @match        https://gesp.zn-man.nl/tools/plugins
// @run-at       document-end
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    if (typeof window.plugin !== 'function') window.plugin = () => {};
    const self = window.plugin.tribetools = () => {};

    self.changelog = `
Changelog:

versie 2026.9.4.1
- nieuwe aanpassing:
30. (admins) Toon SMTP Error logging herzend details

versie 2026.8.25.1
- nieuwe aanpassing:
29. (admins) Gebruikerslijst header vast zetten en kleuren en filters voor beheerders en geblokkeerde gebruikers toevoegen

versie 2026.8.17.1
- aanpassing omgebouwd:
28. Toon knoppen om bepaalde zoek resultaten te verbergen

versie 2026.8.14.1
- kleur van switches aangepast naar GERRIT kleur
- fix voor spaties verwijderen bij gekopieerde tekst
- nieuwe aanpassing:
28. Verberg de Fase logging in de zoek resultaten

versie 2026.7.3.1
- fix voor stylesheet tribetoolshidenotitie, die werd oneindig vaak ingevoegd
- plugin update link toegevoegd
- aanpassing gewijzigd, verberg de tabs alleen als ze leeg zijn:
27. Verberg altijd deze lege tabs: Uren, Kilometers

versie 2026.7.1.1
- nieuwe aanpassing:
27. Verberg altijd deze tabs: Uren, Kilometers

versie 2026.6.29.1
- kleine aanpassing voor zoek knoppen detectie bij 3. Geef de keuze om een zoek tab altijd als eerste te tonen

versie 2026.6.23.1
- kleine aanpassing voor de label breedte bij 23. Toon zoek resultaat details onder elkaar

versie 2026.6.22.3
- kleine aanpassing voor de label breedte bij 23. Toon zoek resultaat details onder elkaar

versie 2026.6.22.2
- kleine aanpassing voor de label breedte bij 23. Toon zoek resultaat details onder elkaar

versie 2026.6.22.1
- grote verbetering aangebracht voor 25. Verplaats bij de tabel Automations de kolom Naam naar het einde
- opties die alleen nuttig zijn voor beheerders gemarkeerd met: (admins)

versie 2026.6.17.2
- kleine aanpassing in de hoogte van de Rollen rechten
- verbetering aangebracht voor het kopieren van de automations lijst

versie 2026.6.17.1
- betere tabel detectie voor 25. Verplaats bij de tabel Automations de kolom Naam naar het einde
- nieuwe aanpassing:
26. Houdt bij de Rollen de kolom kop in beeld

versie 2026.6.16.1
- herstructurering van functies in de plugin
- volledige aanpassing van de techniek voor 7. Bewaar en herstel de status van opengeklapte velden lijstjes
- nieuwe aanpassing:
25. Verplaats bij de tabel Automations de kolom Naam naar het einde

versie 2026.6.15.2
- nieuwe aanpassing:
24. Selecteer na terugkeer het eerder geselecteerde submenu

- nieuwe aanpassing:
23. Toon zoek resultaat details onder elkaar
- grote script opmaak aanpassingen door opties in een object te plaatsen

versie 2026.6.8.1
- fix voor detectie beheerders configuratie menu

versie 2026.6.1.2
- toevoeging aan admin config om automations lijst te kopieren

versie 2026.6.1.1
- aanpassing voor 16. wis gekopieerde spaties alleen bij focus op het zoek vak

versie 2026.5.26.1
- fix voor detectie beheerders configuratie menu

versie 2026.5.21.1
- achtergrondkleur ingesteld voor de Tribe CRM tools instellingen
- extra menu knop toegevoegd om de Tribe CRM tools instellingen te vinden
- fix voor detectie beheerders configuratie menu

versie 2026.5.20.2
- nieuwe aanpassing:
22. Verberg de AI button

versie 2026.5.20.1
- nieuwe aanpassing:
21. Aangepaste (opvallende) weergave voor beheerders configuratie menu
- fix voor titel weergave voor bovenliggende overflow elementen

versie 2026.5.15.1
- fix voor maximale breedte bij voorkomen popup sluiten

versie 2026.5.12.3
- debug melding verwijderd

versie 2026.5.12.2
- fix voor zoek tab activatie bij geen resultaat (trim de spaties weg)

versie 2026.5.12.1
- nieuwe aanpassing:
20. Verberg knop Notitie toevoegen bij een Organisatie
- fix voor de scroll hoogte voor een popup dialoog (19.)

versie 2026.4.24.1
- nieuwe aanpassing:
19. Voorkom het sluiten van een popup door naast de popup te klikken
- aanpassing in clipboard toegang setup om uitschakeling te voorkomen
- aanpassing in popupmessage code die dubbel werd aangemaakt
- pagina titel element prioriteit volgorde aangepast, input vooraan gezet

versie 2026.4.21.1
- nieuwe aanpassingen:
17. Maak de breedte passend voor de weergave keuzelijst
18. Herstel de scroll positie na terugkeer naar een eerder geopend scherm
- header regel toegevoegd om te zorgen dat de clipboard check niet te vroeg wordt uitgevoerd: run-at document-end
- meer snelle opties toegevoegd aan profiel menu
- verbetering voor wijziging van lange teksten als titel weergeven

versie 2026.4.10.2
- nieuwe aanpassing:
16. Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)
- in de code de function term overal vervangen door haakjes
- observer functie vernieuwd

versie 2026.4.10.1
- pagina titel element check verwijder elk ZeroWidthSpace teken

versie 2026.4.8.2
- pagina titel element prioriteit volgorde aangepast

versie 2026.4.8.1
- wis de two factor invoer als daar een e-mail adres in staat

versie 2026.4.7.1
- nieuwe aanpassing:
15. Herstel de stand van de checkbox voor Geavanceerd (bij velden toevoegen)

versie 2026.3.23.1
- fix voor geselecteerd list item in een lijst in beeld brengen

versie 2026.3.20.2
- toon de Onder elkaar switch alleen als er velden zijn waarvoor dit van toepassing is

versie 2026.3.20.1
- fix voor achtergrond kleur element aanduiding

versie 2026.3.18.3
- fix voor geselecteerd list item in beeld brengen

versie 2026.3.18.2
- fix voor selectie streep bij verplaatste +Notitie knop

versie 2026.3.18.1
- nieuwe aanpassing:
14. Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)

versie 2026.3.17.1
- nieuwe aanpassing:
13. Breng een geselecteerd list item in een lijst in beeld (handig bij uren en minuten)

versie 2026.3.12.1
- fix voor de versie menu aanpassingen

versie 2026.3.9.2
versie 2026.3.9.1
- basis opties in het profiel menu gezet

versie 2026.3.3.1
- updateURL gelijk gemaakt aan downloadURL

versie 2026.3.2.1
- vaste hoogte van de datum prikker aan de aangepaste weergave toegevoegd

versie 2026.2.25.2
- kleine fout verholpen

versie 2026.2.25.1
- nieuwe optie:
11. Plaats de +Notitie knop als laatste knop
12. Pas een aangepaste weergave toe (onder andere lijntjes rond de notitie kaders)

versie 2026.2.17.1
- versie weergave toegevoegd in profiel menu
- achtergrond kleuren keuze verbeterd

versie 2026.2.3.1
- kleine verbeteringen

versie 2026.2.2.3
- checkbox voor optie 10 toegevoegd aan sectie headers
- fix voor Asset om goed te tonen als pagina titel

versie 2026.2.2.2
- Update voor optie 10: Toon de checboxes voor de tekst ipv er onder

versie 2026.2.2.1
10. Toon labels en tekst velden onder elkaar ipv naast elkaar

versie 2026.1.30.1
- code omgezet naar plugin opmaak
- mogelijkheid voor afwijkende sandbox kleur ingericht

versie 2026.1.13.3
- minor fix voor de zoek tabs

versie 2026.1.13.2
- plugin versie geschikt gemaakt voor github

versie 2026.1.13.1
- fix voor meerdere varianten van de tribe opmaak

versie 2026.1.12.1
- fix voor zoek voorkeur
- fix voor aangepaste instellingen opmaak
- fix voor openen van het instellingen scherm

versie 2025.12.22.1
- fix voor weergave werkomgeving vanwege aangepaste avatar iconen

versie 2025.10.29.1
- Optie 1 uitgebreid om de Tribe mededeling onderaan het scherm ook voortaan altijd automatisch te sluiten.

versie 2025.9.30.1
- nieuwe tool toegevoegd:
9. Bewaar en herstel de status van aangevinkte opties bij een export

versie 2025.9.9.1
- nieuwe tool toegevoegd:
8. Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel

versie 2025.7.23.1
- diverse technische aanpassingen gemaakt in de mutationobserver
- nieuwe tool toegevoegd:
7. Bewaar en herstel de status van opengeklapte velden lijstjes

versie 2025.7.9.1
- eerste versie, samenvoeging van een aantal tools:
1. Geef een optie om de Tribe mededeling bovenaan het scherm voortaan altijd automatisch te sluiten.
2. Geef de gebruiker de keuze om de achtergrond kleur in te stellen.
3. Toon een titel (zodra de muis over de naam beweegt) bij lange namen die niet volledig in beeld passen.
4. Geef de keuze om een zoek tab altijd als eerste te tonen.
5. Zodra er een foutmelding komt bij het inloggen, geef dan het advies om cookies te verwijderen en een knop om opnieuw de Tribe app site te openen.
6. Toon de naam van de werkomgeving Productie of Sandbox.
`;

    self.defaultcolors = ["#e6fbef","#fdf3fd","#def6fe"];
    self.copiedColor = undefined;
    self.settings = {
        enableautoclosemessages: true,
        enableoverflowtitles: true,
        enablesearchtabselect: true,
        enablelogontips: true,
        enablepacknamedisplay: false,
        enablebackgroundcolors: true,
        enableopensubheaders: true,
        enablepagetitles: true,
        enableexportcheckboxes: true,
        enablelabeltextvertical: false,
        bekendemededelingen: [], // Voeg nieuwe mededelingen toe, door de letterlijke tekst over te nemen naar de array
        searchtab: '',
        colors: ["#e6fbef","#fdf3fd","#def6fe"],
        colorssandbox: ["#e6fbef","#fdf3fd","#def6fe"],
        colorfavorites: [["#e6fbef","#fdf3fd","#def6fe"]],
        undocolors: [],
        redocolors: [],
        undocolorssandbox: [],
        redocolorssandbox: [],
        opensubheaders: {},
        exportcheckboxes: [],
        enablebuttonorder: false,
        enablemystyle: false,
        enablescrollcenter: true,
        enablelistblur: true,
        advancedswitchchecked: false,
        enabletrimclipboard: false,
        enablecombowidth: false,
        enablescrollrestore: true,
        enablenoclickarea: true,
        scrollrestore: [],
        enablehidenotitie: false,
        enableconfigurationstyle: true,
        enablehideai: false,
        enablesearchresultformatting: false,
        enablerestoresubmenu: true,
        restoresubmenu: {},
        enableautomationscolumns: true,
        enablestickyroleheaders: true,
        enablehidetabs: false,
        enablesearchfilters: false,
        enablesearchfilter_faselogging: false,
        enablesearchfilter_wachttijd: false,
        enablesearchfilter_omzetverdeling: false,
        enablesearchfilter_bijlage: false,
        enablesearchfilter_email: false,
        enablesearchfilter_notitie: false
    };

    self.searchfilters = [
        {
            id: 'faselogging',
            text: "Fase logging"
        },
        {
            id: 'wachttijd',
            text: "Wachttijd"
        },
        {
            id: 'omzetverdeling',
            text: "Omzetverdeling"
        },
        {
            id: 'bijlage',
            text: "Bijlage"
        },
        {
            id: 'email',
            text: "E-mail"
        },
        {
            id: 'notitie',
            text: "Notitie"
        }
    ];

    self.background = { // pointer to settings.colors or settings.colorsssandbox
        colors: [],
        undocolors: [],
        redocolors: []
    };

    self.zoekmijninstellingen = false;
    self.observer = {};

    self.utils = {};

    self.utils.clickMySettings = () => {
        if (!self.zoekmijninstellingen) return;
        let menuitemmijninstellingen = Array.from(document.body.querySelectorAll("[role=menuitem]")).filter(el=>el.innerText.match(/(Mijn account|My account)/));
        if (!menuitemmijninstellingen.length) return;
        self.zoekmijninstellingen = false;
        menuitemmijninstellingen[0].click();
    };
    self.utils.openMySettings = () => {
        if (window.location.href.match(/\/user-settings/)) {
            self.zoekmijninstellingen = false;
            return;
        }
        let accountbutton = document.body.querySelector('.MuiAvatar-root'); // document.body.querySelector("[aria-label=Account]");
        if (!accountbutton) return;
        accountbutton.click();
        self.zoekmijninstellingen = true;
        setTimeout(() => {
            if (!self.zoekmijninstellingen) return;
            console.log(GM_info.script.name + " - Menu item Mijn account/My account niet gevonden");
            self.zoekmijninstellingen = false;
        },500);
        self.utils.clickMySettings();
    };

    self.utils.storeSettings = () => {
        localStorage.setItem('tribecrmtools',JSON.stringify(self.settings));
    };
    self.utils.restoreSettings = () => {
        let data = localStorage.getItem('tribecrmtools');
        if (data) data = JSON.parse(data);
        if (!data || typeof data != 'object' || data instanceof Array) {
            if (window.location.href.match(/\/user-settings/)) {
                self.utils.storeSettings();
            } else {
                // self.utils.openMySettings();
            }
            return;
        };
        for (let key in self.settings) {
            if (Object.keys(data).includes(key) && typeof self.settings[key] == typeof data[key]) {
                self.settings[key] = data[key];
            }
        }
    };

    self.utils.sandboxEnvironment = () => {
        let avatars = document.body.querySelectorAll('.MuiStack-root.css-1uwrsdx .MuiAvatar-root');
        if (!avatars.length) return undefined;
        let sandboxavatar = [...avatars].find(avatar => avatar.innerText == 'S');
        return sandboxavatar ? true : false;
    };

    self.utils.prepareColors = () => {
        // references to settings:
        let environment = self.utils.sandboxEnvironment() ? 'sandbox' : '';
        self.background = {
            colors: self.settings[`colors${environment}`],
            undocolors: self.settings[`undocolors${environment}`],
            redocolors: self.settings[`redocolors${environment}`]
        };
    };

    // 1. Geef een optie om de Tribe mededeling bovenaan het scherm voortaan altijd automatisch te sluiten
    self.applyInfoButton = () => {
        const addInfoButton = () => {
            let popupmessage = document.body.querySelector('.popupmessage');
            if (!popupmessage) {
                self.observer.disconnect();

                let popupmessage = document.body.appendChild(document.createElement('div'));
                popupmessage.className = 'popupmessage';
                popupmessage.innerHTML = `
<div class="popupmessage-window">
    <div class="popupmessage-titlebar"><span class="popupmessage-title"></span><span class="material-icons-outlined popupmessage-close" title="close">close</span></div>
    <div class="popupmessage-content"></div>
</div>
`;
                popupmessage.querySelector('span.popupmessage-close').addEventListener('click', e => {
                    popupmessage.classList.remove('tribetoolsdisplay');
                },false);
            }

            let infobutton = document.body.querySelector('.tribetoolsinfo');
            let timerbutton = [...document.body.querySelectorAll('.MuiIconButton-root')].filter((el)=>{return el.innerText == 'timer'});
            if (!infobutton && timerbutton.length) {
                //let buttonarea = document.body.querySelector("[aria-label=Omgeving]")?.parentElement?.parentElement;
                self.observer.disconnect();

                timerbutton = timerbutton[0];
                let infobutton = document.createElement('button');
                infobutton.className = timerbutton.className;
                infobutton.classList.add("tribetoolsinfo");
                let span = infobutton.appendChild(document.createElement('span'));
                span.className = timerbutton.querySelector('span').className;
                span.setAttribute('aria-hidden',"true");
                span.innerText = `info`;
                span.title = `Toon opgeslagen mededelingen`;

                infobutton.addEventListener('click', e => {
                    // console.log(GM_info.script.name + " - Klik info button");
                    popupmessage.querySelector('.popupmessage-title').innerText = `${GM_info.script.name} - Mededelingen`;
                    if (!self.settings.bekendemededelingen.length) {
                        popupmessage.querySelector('.popupmessage-content').innerHTML = `
<p>Er zijn geen mededelingen opgeslagen die automatisch mogen worden gesloten.</p>
<p align="center"><button class="settings">Instellingen</button> <button class="closedialog">Sluiten</button></p>
`;
                    } else {
                        popupmessage.querySelector('.popupmessage-content').innerHTML = `
<p>Opgeslagen mededelingen die automatisch worden gesloten:</p>

<p>${self.settings.bekendemededelingen.map(el => { return el.replace(/\nSluiten/,'').replace(/\nMeer lezen/,'').replace(/\n\n+/gs,"\n").replace(/\n$/gs,"\n"); }).join("</p><p>").replace(/\n/g,"<br>\n")}
<p align="center"><button class="removeallmessages">Alles wissen</button> <button class="settings">Instellingen</button> <button class="closedialog">Sluiten</button></p>
`;
                        popupmessage.querySelector('button.removeallmessages').addEventListener('click', e => {
                            if (confirm(`Mededelingen zullen opnieuw getoond worden als ze nog actief zijn.\n\nAlles wissen?`)) {
                                self.settings.bekendemededelingen = [];
                                self.utils.storeSettings();
                                popupmessage.classList.remove('tribetoolsdisplay');
                            }
                        },false);
                    }
                    popupmessage.querySelector('button.settings').addEventListener('click', e => {
                        popupmessage.classList.remove('tribetoolsdisplay');
                        self.utils.openMySettings();
                    },false);
                    popupmessage.querySelector('button.closedialog').addEventListener('click', e => {
                        popupmessage.classList.remove('tribetoolsdisplay');
                    },false);
                    popupmessage.classList.add('tribetoolsdisplay');
                },false);

                timerbutton.before(infobutton);
                console.log(GM_info.script.name + " - Mededelingen info button toegevoegd");
            }

            let stylesheet = document.head.querySelector('style.tribetoolspopupmessage');
            if (!stylesheet) {
                self.observer.disconnect();

                stylesheet = document.head.appendChild(document.createElement('style'));
                stylesheet.type = "text/css";
                stylesheet.className = 'tribetoolspopupmessage';
                stylesheet.innerHTML = `
div.popupmessage {
    display: none;
    position: fixed;
    z-index: 10000;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    overscroll-behavior: contain;
}
div.popupmessage.tribetoolsdisplay {
    display: block;
}
.popupmessage-window {
    background-color: rgba(255, 255, 255, 0.97);
    margin: auto;
    padding: 0px;
    border: 1px solid #20A8B1;
    width: 80%;
    max-width: 1000px;
    max-height: calc(100vh - 200px);
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: rgb(242, 244, 247);
    box-shadow: rgba(102, 112, 133, 0.2) 0px 5px 5px -3px, rgba(102, 112, 133, 0.14) 0px 8px 10px 1px, rgba(102, 112, 133, 0.12) 0px 3px 14px 2px;
}
.popupmessage-titlebar {
    font-weight: 600;
    font-family: inter;
    font-size: 18px;
    line-height: 28px;
    text-align: center;
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: rgb(255, 255, 255);
}
.popupmessage-title {
    color: rgb(16, 24, 40);
    font-weight: bold;
}
.popupmessage-close {
    float: right;
    width: 30px;
    height: 30px;
    top: 3px;
    cursor: pointer;
    color: rgb(47, 71, 94);
    border: 1px solid rgb(255, 255, 255);
    background-color: rgba(255, 255, 255, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
}
.popupmessage-content {
    color: rgb(102, 112, 133);
    font-size: 13px;
    line-height: 15px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px;
    height: auto;
    max-height: calc(100vh - 300px) !important;
}
.popupmessage-content p {
    margin-top: 15px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgb(102, 112, 133);
}
.popupmessage-content button {
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    font-weight: 700;
    line-height: 1.71429;
    font-size: 0.875rem;
    text-transform: unset;
    font-family: inter;
    min-width: 64px;
    color: rgb(251, 21, 118);
    box-shadow: none;
    outline: 0px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    margin: 0px;
    text-decoration: none;
    padding: 6px 8px;
    border-radius: 6px;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1), color 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.popupmessage-content button:hover {
    text-decoration: none;
    background-color: rgba(251, 21, 118, 0.08);
}
`;
            }

            // restart monitoring
            self.observer.connect();
        };

        const removeKnownInfo = () => {
            let message = document.body.querySelector('.MuiAlert-message')?.innerText;
            let closebutton = document.body.querySelector('.MuiAlert-message')?.parentElement?.querySelector("[data-testid=CloseIcon]")?.closest('button');
            if (message && closebutton) {
                if (self.settings.bekendemededelingen.includes(message)) {
                    // apply changes
                    console.log(GM_info.script.name + " - Auto sluit deze bekende mededeling:",message);
                    closebutton.click();
                } else if (closebutton.closest('div') && !closebutton.closest('div').querySelector('.autoclose')) {
                    // stop monitoring
                    self.observer.disconnect();

                    // voeg een checkbox toe voor permanent automatisch sluiten
                    let checkbox = closebutton.closest('div').appendChild(document.createElement('input'));
                    checkbox.type = 'checkbox';
                    checkbox.className = 'autoclose';
                    checkbox.title = 'Deze mededeling altijd automatisch sluiten';
                    checkbox.addEventListener('click', e => {
                        e.stopPropagation();
                    });

                    closebutton.addEventListener('click',e => {
                        let index = self.settings.bekendemededelingen.indexOf(message);
                        if (checkbox.checked && index == -1) {
                            self.settings.bekendemededelingen.push(message);
                            self.utils.storeSettings();
                            console.log(GM_info.script.name + " - Auto sluit (voortaan) deze bekende mededeling:",message);
                        } else if (checkbox.checked && index != -1) {
                            self.settings.bekendemededelingen.splice(index,1);
                            self.utils.storeSettings();
                        }
                    });

                    // restart monitoring
                    self.observer.connect();
                }
            }
        };

        const removeKnownFooter = () => {
            let message = document.body.querySelector('#pendo-base')?.innerText;
            if (!message) return;

            let closebutton = document.body.querySelector("#pendo-base button._pendo-close-guide");
            if (!closebutton) return;

            if (self.settings.bekendemededelingen.includes(message)) {
                // apply changes
                console.log(GM_info.script.name + " - Auto sluit deze bekende mededeling:",message);
                closebutton.click();
            } else if (!closebutton.nextSibling || closebutton.nextSibling.className != 'autoclose') {
                // stop monitoring
                self.observer.disconnect();

                // voeg een checkbox toe voor permanent automatisch sluiten
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'autoclose';
                checkbox.title = 'Deze mededeling altijd automatisch sluiten';
                checkbox.style.position = 'absolute';
                checkbox.style.right = '10px';
                checkbox.addEventListener('click', e => {
                    e.stopPropagation();
                });

                closebutton.parentElement.insertBefore(checkbox, closebutton.nextSibling)
                closebutton.addEventListener('click', e => {
                    let index = self.settings.bekendemededelingen.indexOf(message);
                    if (checkbox.checked && index == -1) {
                        self.settings.bekendemededelingen.push(message);
                        self.utils.storeSettings();
                        console.log(GM_info.script.name + " - Auto sluit (voortaan) deze bekende mededeling:",message);
                    } else if (checkbox.checked && index != -1) {
                        self.settings.bekendemededelingen.splice(index,1);
                        self.utils.storeSettings();
                    }
                });

                // restart monitoring
                self.observer.connect();
            }
        };

        const removeInfoButton = () => {
            let button = document.body.querySelector('.tribetoolsinfo');
            if (!button) return;

            self.observer.disconnect();
            button.remove();
            self.observer.connect();
        };

        if (self.settings.enableautoclosemessages) {
            addInfoButton();
            removeKnownInfo();
            removeKnownFooter();
        } else {
            removeInfoButton();
        }
    };

    // 2. Toon een titel (zodra de muis over de naam beweegt) bij lange namen die niet volledig in beeld passen
    self.applyOverflowtitles = () => {
        if (self.settings.enableoverflowtitles) {
            let textelements = [...document.body.querySelectorAll('*')].filter(el => el.childElementCount === 0 && el.innerText);
            let overflowtextelementswithouttitle = textelements.filter(el => (el.offsetWidth < el.scrollWidth || el.parentElement?.offsetWidth < el.parentElement?.scrollWidth) && el.title != el.innerText);
            if (overflowtextelementswithouttitle.length) {
                self.observer.disconnect();

                console.log(GM_info.script.name + " - Geef lange teksten een titel:",overflowtextelementswithouttitle.length);
                overflowtextelementswithouttitle.forEach(element => {
                    element.setAttribute('title',element.innerText);
                    element.classList.add('tribetoolstitle');
                });
            }
        } else {
            let titleelements = document.body.querySelectorAll('.tribetoolstitle');
            if (titleelements.length) {
                self.observer.disconnect();

                console.log(GM_info.script.name + " - Herstel lange teksten, verwijder de titel:",titleelements.length);
                titleelements.forEach(element => {
                    element.removeAttribute('title');
                    element.classList.remove('tribetoolstitle');
                });
            }
        }
        self.observer.connect();
    };

    // 3. Geef de keuze om een zoek tab altijd als eerste te tonen
    self.applySearchTab = () => {
        if (self.settings.enablesearchtabselect) {
            let searchinput = document.body.querySelector('div[data-test-id="search-bar"] input');
            let searchtablist = document.body.querySelector('[class*=content] > div.MuiStack-root .MuiBox-root [role=tablist]');
            let searchtabbuttons = searchtablist?.querySelectorAll('button') || [];
            let searchtabbuttontarget = [...searchtabbuttons].find(button => button.innerText == self.settings.searchtab);
            let searchtabbuttonselected = [...searchtabbuttons].find(button => button.classList.contains('Mui-selected'));
            let searchbuttonsvisible = searchtabbuttons.length > 2 && ([...searchtabbuttons].filter(el => el.innerText.match(/Relaties|Relations|Activiteiten|Activities/)).length == 2);
            let progressbar = document.body.querySelector('div[data-test-id="search-bar"] [role="progressbar"]');
            let searchresultsrelations = [...document.body.querySelectorAll('[class*=card] [class*=header]')].filter(header => header.innerText.match(/(Klanten|Prospects|Medewerkers|Contactpersonen)/)).length >= 1;
            let searchresultsnothing = [...document.body.querySelectorAll('.MuiBox-root > div > strong')].find(strong => strong.innerText.trim() == searchinput.value.trim());
            // er komen resultaten, eerst onder Relaties, dit kunnen zijn: Klanten, Prospects, Medewerkers, Contactpersonen
            // of:
            // Géén zoekresultaten gevonden voor zoekopdracht: <strong>zoektekst</strong>

            // document.body.querySelectorAll('[class*=SearchItemBucket_header]')

            // setup radio buttons:
            if (searchbuttonsvisible && !searchtabbuttons[0].querySelector('input[type=radio]')) {
                self.observer.disconnect();

                console.log(GM_info.script.name + " - Zoektabs gevonden en radio buttons toegevoegd");
                let firstbutton;
                let checkedbutton;
                searchtabbuttons.forEach((button,buttoncnt) => {
                    let radiobutton = button.appendChild(document.createElement("input"));
                    radiobutton.type = "radio";
                    radiobutton.name = "tribesearchhelpradio";
                    radiobutton.value = button.innerText;
                    radiobutton.title = `${radiobutton.value} als eerste weergeven`;
                    if (radiobutton.value == self.settings.searchtab) {
                        radiobutton.checked = true;
                        if (!checkedbutton) checkedbutton = radiobutton;
                    }
                    radiobutton.addEventListener('click',e => {
                        self.settings.searchtab = e.target.value;
                        self.utils.storeSettings();
                    });
                    if (!firstbutton) firstbutton = radiobutton;
                });
                // activeer de eerste radiobutton als er nog geen actief is
                if (!checkedbutton) {
                    firstbutton.checked = true;
                    self.settings.searchtab = firstbutton.value;
                    self.utils.storeSettings();
                }

                self.observer.connect();
            }

            if (searchbuttonsvisible && searchtabbuttonselected && !progressbar && searchtablist && !searchtablist.classList.contains('tribetoolssearchactivated') && (searchresultsnothing || searchresultsrelations)) {
                if (searchtabbuttonselected.innerText != self.settings.searchtab && searchtabbuttontarget) {
                    console.log(GM_info.script.name + " - Zoektab voorkeur geselecteerd: " + self.settings.searchtab);

                    self.observer.disconnect();
                    searchtablist.classList.add('tribetoolssearchactivated');
                    self.observer.connect();

                    searchtabbuttontarget.click();
                    searchtabbuttontarget.scrollIntoView(searchtabbuttons[0],{
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                    });
                }
            }
        }
    };

    // 4. Zodra er een foutmelding komt bij het inloggen, geef dan het advies om cookies te verwijderen en een knop om opnieuw de Tribe app site te openen
    self.applyLogonTips = () => {
        if (self.settings.enablelogontips) {
            let messageobject = document.body.querySelector('p.MuiTypography-root');
            if (messageobject?.innerText == "Het is ons niet gelukt om je aan te melden. Je inloggegevens zijn onjuist." && !document.body.querySelector('.advice')) {
                self.observer.disconnect();

                console.log(GM_info.script.name + " - Toon inlog hulp");
                let messagediv = messageobject.closest('div');
                let advicediv = messagediv.appendChild(document.createElement('div'));
                advicediv.className = 'advice';
                advicediv.style.textAlign = 'center';
                advicediv.style.color = 'white';
                advicediv.innerHTML = 'Tip: Wis de cookies voor deze site en/of <button>probeer opnieuw</button>';
                advicediv.querySelector('button').addEventListener('click', e => {
                    e.preventDefault();
                    window.location.href = "https://app.tribecrm.nl";
                },false);
            }
        }

        let logincheckbox = document.body.querySelector('#loginForm input[type=checkbox]');
        if (logincheckbox && !logincheckbox.checked && window.location.host == 'auth.tribecrm.nl') {
            self.observer.disconnect();
            // apply changes
            logincheckbox.click();
        }

        // wis de two factor invoer als daar een e-mail adres in staat
        let twofactorinput = document.body.querySelector('input[name=two_factor_token]:not(.tribetoolstwofactorinput)');
        if (twofactorinput) {
            self.observer.disconnect();
            twofactorinput.classList.add('tribetoolstwofactorinput');
            let starttime = new Date().getTime();
            let intervalid = setInterval(() => {
                if (twofactorinput.value.match(/@/)) {
                    // console.log('clear twofactorinput',new Date().getTime() - starttime,twofactorinput.value);
                    twofactorinput.value = '';
                }
            },10);
        }
        self.observer.connect();
    };

    // 5. Toon de naam van de werkomgeving Productie of Sandbox
    self.applyPackName = () => {
        if (typeof self.utils.sandboxEnvironment() != 'boolean') return;

        let packname = document.body.querySelector('.tribetoolspackname');
        if (self.settings.enablepacknamedisplay && !packname) {
            let buttonarea = document.body.querySelector(".MuiStack-root.css-1uwrsdx"); // document.body.querySelector("[aria-label=Omgeving],[aria-label=Environment]");
            if (buttonarea) {
                // stop monitoring
                self.observer.disconnect();

                packname = document.createElement('div');
                packname.className = 'tribetoolspackname';

                if (self.utils.sandboxEnvironment()) {
                    console.log(GM_info.script.name + " - Sandbox omgeving");
                    packname.innerText = 'Sandbox';
                } else {
                    console.log(GM_info.script.name + " - Productie omgeving");
                    packname.innerText = 'Productie';
                }

                buttonarea.after(packname);
            }
        } else if (!self.settings.enablepacknamedisplay && packname) {
            // stop monitoring
            self.observer.disconnect();
            packname.remove();
        }
        self.observer.connect();
    };

    // 6. Geef de gebruiker de keuze om de achtergrond kleur in te stellen
    self.applyColorStylesheet = () => {
        // Maak een nieuwe stylesheet en vergelijk daarna met bestaande stylesheet of die vervangen moet worden
        let stylesheet = document.createElement('style');
        stylesheet.type = "text/css";
        stylesheet.className = "tribetoolscolors";

        if (self.settings.enablebackgroundcolors) {
            self.utils.prepareColors();
            stylesheet.innerHTML = `
#root > div.MuiBox-root[class*=css-] > .MuiBox-root.css-0, div[style*=linear-gradient] {
    background-image: linear-gradient(235deg, ${self.background.colors[0]}, ${self.background.colors[1]}, ${self.background.colors[2]}) !important;
}
`;
        }
        self.settings.colorfavorites.forEach((colors,index) => {
            stylesheet.innerHTML += `
.tribetoolsexample${index} {
    background-image: linear-gradient(235deg, ${self.settings.colorfavorites[index][0]}, ${self.settings.colorfavorites[index][1]}, ${self.settings.colorfavorites[index][2]}) !important;
}
`;
        });

        let existingstylesheet = document.head.querySelector('style.tribetoolscolors');
        if (!existingstylesheet || existingstylesheet.innerHTML != stylesheet.innerHTML) {
            console.log(GM_info.script.name + " - Update color stylesheet",self.settings.enablebackgroundcolors);

            self.observer.disconnect();
            if (existingstylesheet) {
                existingstylesheet.innerHTML = stylesheet.innerHTML;
            } else {
                document.head.appendChild(stylesheet);
            }
            self.observer.connect();
        }
    };

    // 7. Bewaar en herstel de status van opengeklapte velden lijstjes
    self.applyCollapsedSubHeaders = () => {
        let subheaders = document.body.querySelectorAll('.MuiBox-root:has(> .tribe-header-variant-subheader h6)');
        if (!subheaders.length) return;

        subheaders.forEach(subheader => {
            let headertext = subheader.querySelector('h6')?.innerText;
            if (!headertext) return;

            let headeropen = !!subheader.nextSibling?.classList.contains('MuiCollapse-root');
            if (!subheader.classList.contains('tribetoolssubheaderrestored')) {
                self.observer.disconnect();
                subheader.classList.add('tribetoolssubheaderrestored');
                if (self.settings.enableopensubheaders && (headertext in self.settings.opensubheaders) && self.settings.opensubheaders[headertext] != headeropen) {
                    // restore state
                    subheader.querySelector('h6').click();
                }
            } else {
                // store current state
                self.settings.opensubheaders[headertext] = headeropen;
                self.utils.storeSettings();
            }
        });
        self.observer.connect();
    };

    // 8. Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel
    self.applyPageTitle = () => {
        let restoretitle = document.body.getAttribute('restoretitle');
        if (self.settings.enablepagetitles) {
            let asset = document.body.querySelector('.MuiStack-root.textContent p');
            if (asset?.innerText == 'Asset') {
                while (asset && !asset.querySelector('.MuiBox-root.css-0')) {
                    asset = asset.parentElement;
                }
            }
            let newtitle = document.body.querySelector('[placeholder="Geen titel"]')?.value || document.body.querySelector('[data-test-id="label-entity-name"]')?.innerText.replace(/\u200B/,'') || document.body.querySelector('[data-test-id="text-my-workplace"]')?.innerText.replace(/\u200B/,'') || asset?.querySelector('.MuiBox-root.css-0')?.innerText.replace(/\u200B/,'') || document.body.querySelector('.MuiCard-root h6')?.innerText.replace(/\u200B/,'') || restoretitle;
            if (newtitle != document.title) {
                self.observer.disconnect();

                if (newtitle && !restoretitle) {
                    document.body.setAttribute('restoretitle',document.title);
                } else if (newtitle == restoretitle) {
                    document.body.removeAttribute('restoretitle');
                }

                if (newtitle) {
                    document.title = newtitle;
                }
            }
        } else if (!self.settings.enablepagetitles && !restoretitle) {
            self.observer.disconnect();
            document.title = restoretitle;
            document.body.removeAttribute('restoretitle');
        }
        self.observer.connect();
    };

    // 9. Bewaar en herstel de status van aangevinkte opties bij een export
    self.applyExportChekboxes = () => {
        let exportbutton = Array.from(document.body.querySelectorAll('button')).find(btn => btn.textContent.trim().match(/^(Start export taak|Export)$/));
        if (!exportbutton) return;

        if (exportbutton.classList.contains('tribetoolsrestoreExportChekboxes')) return;

        let popup = exportbutton.closest('.MuiPaper-root');
        if (!popup) return;
        if (!popup.querySelectorAll('input').length) return;

        self.observer.disconnect();
        exportbutton.classList.add('tribetoolsrestoreExportChekboxes');
        Array.from(popup.querySelectorAll('input')).forEach((input,index) => {
            if ((input.type == 'checkbox' || input.type == 'radio') && typeof self.settings.exportcheckboxes[index] == 'boolean') {
                if (self.settings.enableexportcheckboxes && self.settings.exportcheckboxes[index] && input.checked !== self.settings.exportcheckboxes[index]) {
                    input.click();
                }
            }
        });
        exportbutton.addEventListener('click', e => {
            let popup = exportbutton.closest('.MuiPaper-root');
            if (!popup) return;
            self.settings.exportcheckboxes = [];
            Array.from(popup.querySelectorAll('input')).forEach((input,index) => {
                if (input.type == 'checkbox' || input.type == 'radio') {
                    self.settings.exportcheckboxes[index] = input.checked;
                }
            });
            self.utils.storeSettings();
        },false);
        self.observer.connect();
    };

    // 10. Toon labels en tekst velden onder elkaar ipv naast elkaar
    self.applyLabelTextVertical = () => {
        // .root-UtSA0c.labelLeft-LtqMCq display: flex
        let stylesheet = document.head.querySelector('style.tribetoolsformatvertical');
        if (self.settings.enablelabeltextvertical && !stylesheet) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsformatvertical';
            stylesheet.innerHTML = `
[class*=section]:first-child [class*=root][class*=labelLeft]:not(:has(input[type=checkbox])) {
    display: block;
}
[class*=section]:first-child [class*=root][class*=labelLeft]:has(input[type=checkbox]) {
    display: grid;
    grid-template-columns: 55px 1fr;
}
[class*=section]:first-child [class*=root][class*=labelLeft]:has(input[type=checkbox]) [class*=labelContainer-] {
    order: 2;
}
[class*=section]:first-child [class*=root][class*=labelLeft]:has(input[type=checkbox]) [class*=viewContainer-] {
    order: 1;
}
[class*=section]:first-child [class*=root][class*=labelLeft]:not([class*=labelFullWidth]):not([class*=inline])>[class*=labelContainer] {
    width: 100%;
    max-width: unset;
}
`;
        } else if (!self.settings.enablelabeltextvertical && stylesheet) {
            self.observer.disconnect();
            stylesheet.remove();
        }

        let sectionheader = document.body.querySelector("[class*='section']:first-child h6")?.parentElement;
        if (sectionheader && !sectionheader.querySelector('.tribeverticalcheckbox')) {
            //if (document.body.querySelector("[class*='section']:first-child [class*='root'][class*='labelLeft']:has(input[type=checkbox]) [class*='labelContainer-']")) {
                let div = document.createElement('div');
                div.classList.add('tribeverticalcheckbox');
                div.appendChild(self.addCheckbox('enablelabeltextvertical', e => {
                    // console.log('click checkbox enablelabeltextvertical');
                    self.applyLabelTextVertical();
                }));
                let label = div.appendChild(document.createElement('label'));
                label.classList.add('tribepointer');
                label.classList.add('css-oqtjxi');
                label.append('Onder elkaar');
                label.setAttribute('for',`id_enablelabeltextvertical`);

                div.title = 'Toon de labels en tekstvelden onder elkaar';
                div.addEventListener('click',e => {
                    e.stopPropagation();
                },false);

                self.observer.disconnect();
                sectionheader.appendChild(div);
            //}
        }

        self.observer.connect();
    };

    self.updateCheckboxes = () => {
        document.body.querySelectorAll('input[type=checkbox][name^=tribetools]').forEach(checkbox => {
            let settingsname = checkbox.name.replace(/^tribetools/,'');
            if (!(settingsname in self.settings)) return;
            checkbox.checked = self.settings[settingsname];
            if (self.settings[settingsname]) {
                checkbox.closest('.MuiSwitch-switchBase').classList.add('Mui-checked');
            } else {
                checkbox.closest('.MuiSwitch-switchBase').classList.remove('Mui-checked');
            }
        });
    };

    self.addCheckbox = (settingsname,clickevent,idbase = 'id_',tristate) => {
        let checkboxarea = document.createElement('span');
        checkboxarea.className = 'MuiSwitch-root MuiSwitch-sizeMedium outercheckbox';
        checkboxarea.setAttribute('data-component','n');
        checkboxarea.setAttribute('data-store','n');
        checkboxarea.innerHTML = `
  <span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary PrivateSwitchBase-root">
    <input class="PrivateSwitchBase-input MuiSwitch-input" type="checkbox">
    <span class="MuiSwitch-thumb"></span>
    <span class="MuiTouchRipple-root"></span>
  </span>
  <span class="MuiSwitch-track"></span>
`;
        let checkbox = checkboxarea.querySelector('input');
        checkbox.id = `${idbase}${settingsname}`;
        checkbox.name = `tribetools${settingsname}`;
        checkbox.checked = self.settings[settingsname] || false;
        checkbox.indeterminate = self.settings[settingsname] === undefined && !checkbox.checked;
        if (checkbox.checked) checkboxarea.querySelector('.MuiSwitch-switchBase').classList.add('Mui-checked');
        checkbox.addEventListener('click',e => {
            e.stopPropagation();

            if (tristate) {
                if (self.settings[settingsname] === undefined && checkbox.checked) {
                    checkbox.checked = false;
                    self.settings[settingsname] = false;
                } else if (self.settings[settingsname] === false && checkbox.checked) {
                    self.settings[settingsname] = true;
                } else if (self.settings[settingsname] === true && !checkbox.checked) {
                    checkbox.checked = false;
                    self.settings[settingsname] = undefined;
                }
            } else {
                self.settings[settingsname] = checkbox.checked;
            }
            checkbox.indeterminate = self.settings[settingsname] === undefined && !checkbox.checked;

            self.utils.storeSettings();
            // sync same named checkboxes, value and visual
            document.body.querySelectorAll(`input[type=checkbox][name=tribetools${settingsname}]`).forEach(othercheckbox => {
                othercheckbox.checked = self.settings[settingsname];
                if (self.settings[settingsname]) {
                    othercheckbox.closest('.MuiSwitch-switchBase').classList.add('Mui-checked');
                } else {
                    othercheckbox.closest('.MuiSwitch-switchBase').classList.remove('Mui-checked');
                }
            });
            if (typeof clickevent == 'function') {
                clickevent(e);
            }
        },false);
        checkboxarea.addEventListener('click',e => {
            e.stopPropagation();
            checkbox.click();
        },false);

        return checkboxarea;
    };

    self.addTribeToolsStylesheet = () => {
        let stylesheet = document.head.querySelector('style.tribetoolsmysettings');
        if (stylesheet) return;

        stylesheet = document.createElement('style');
        stylesheet.type = "text/css";
        stylesheet.className = 'tribetoolsmysettings';
        stylesheet.innerHTML = `
.tribetoolsoptions > div.MuiPaper-root {
    background-color: #f3faf8;
}
.tribetoolsoptions label, .tribepointer {
    cursor: pointer;
}
.tribetoolsoptions button {
    cursor: pointer;
}
.tribetoolsoptions input {
    cursor: pointer;
}
label[for*=idmenu] {
    cursor: pointer;
}
span.outercheckbox {
    transition: all 0.5s;
}
span.outercheckbox {
    cursor: pointer;
    display: inline-flex;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    flex-shrink: 0;
    z-index: 0;
    vertical-align: middle;
    width: 58px;
    height: 38px;
    padding: 9px 13px 9px 12px;
}
span.outercheckbox .MuiSwitch-switchBase:has(input:indeterminate) .MuiSwitch-thumb {
    color: #665252;
}
span.outercheckbox:has(input:indeterminate) .MuiSwitch-track {
    background-color: rgb(210, 13, 13);
}
span.outercheckbox .MuiSwitch-switchBase {
    left: 3px;
    padding: 12px;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    position: absolute;
    top: 0px;
    z-index: 1;
    color: rgb(255, 255, 255);
    outline: 0px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    margin: 0px;
    text-decoration: none;
    border-radius: 50%;
    transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
span.outercheckbox input {
    left: -100%;
    width: 300%;
}
span.outercheckbox input {
    cursor: inherit;
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    margin: 0px;
    padding: 0px;
    z-index: 1;
}
span.outercheckbox .MuiSwitch-thumb {
    width: 14px;
    height: 14px;
    box-shadow: none;
    color: rgb(255, 255, 255);
}
span.outercheckbox .MuiSwitch-thumb {
    background-color: currentcolor;
    border-radius: 50%;
}
span.outercheckbox .MuiTouchRipple-root {
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    z-index: 0;
    inset: 0px;
    border-radius: inherit;
}
span.outercheckbox .MuiSwitch-track {
    border-radius: 14px;
    height: 100%;
    width: 100%;
    z-index: -1;
    background-color: rgb(0, 0, 0);
    opacity: 0.38;
    transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

span.outercheckbox .MuiSwitch-switchBase.Mui-checked {
    transform: translateX(13px);
    color: rgb(251, 21, 118);
}
span.outercheckbox .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    opacity: 1;
}
span.outercheckbox .Mui-checked + .MuiSwitch-track {
    background-color: #38c499; /* rgb(251, 21, 118); */
}
.tribetoolsversion {
    color: rgb(21, 94, 239);
}
.tribetoolsoptions a {
    color: #630000;
}
.tribetoolsoptions a:hover {
    text-decoration: underline;
}
.tribetoolsmenu {
    display: grid;
    background-color: #f3faf8;
    border-radius: 15px;
}
.tribetoolshiderow {
    display: none;
}
`;
        self.observer.disconnect();
        document.head.appendChild(stylesheet);
        self.observer.connect();
    };

    self.applySettings = () => {
        // toon de mogelijke opties op het user-settings scherm:

        if (!window.location.href.match(/\/user-settings/)) return; // wrong page
        if (document.body.querySelector('.tribetoolsoptions')) return; // already added
        if (!document.body.querySelector('[class*=lastRow]')) return; // required element not ready

        const createContainer = () => {
            let div = document.body.querySelector('.MuiPaper-rounded')?.parentElement;
            if (!div) return;

            let newdiv = document.createElement('div');
            newdiv.className = div.className;
            newdiv.classList.add('tribetoolsoptions');

            let elevation = newdiv.appendChild(document.createElement('div'));
            elevation.className = div.querySelector('.MuiPaper-elevation')?.className;

            let container = elevation.appendChild(document.createElement('div'));
            container.className = div.querySelector('.MuiGrid-container')?.className;
            container.classList.add('tribetoolsoptionscontainter');
            container.style.flexWrap = "nowrap"; // maak de regels compacter

            let titlerow = container.appendChild(document.createElement('div'));
            titlerow.className = div.querySelector('.MuiGrid-item').className;
            titlerow.innerHTML = div.querySelector('.MuiGrid-item').innerHTML;
            titlerow.querySelector('h6').innerText = `${GM_info.script.name} - instellingen`;

            let lastrow = container.appendChild(document.createElement('div'));
            lastrow.className = div.querySelector('[class*=lastRow]').className;
            lastrow.classList.add('tribetoolslastrow');

            let firsitemrow = div.querySelectorAll('.MuiGrid-item')[1];

            let inforow = document.createElement('div');
            inforow.className = firsitemrow.className;
            inforow.innerHTML = firsitemrow.innerHTML;

            inforow.querySelectorAll('.MuiGrid-item').forEach((el)=>{el.remove();});
            let info = inforow.querySelector('.MuiGrid-container').appendChild(document.createElement('div'));
            info.style.paddingLeft = '16px';
            info.style.paddingRight = '16px';
            info.innerHTML = GM_info.script.description.replace(/([^0-9])\./g,"$1.<br>\n");
            info.innerHTML += `<p>Versie: <span class="tribetoolsversion">${GM_info.script.name} versie ${GM_info.script.version}</span> (<a href="https://github.com/WijZijnGERRIT/plugins/tree/tribe" target="_blank">Plugin website</a>, <a href="${GM_info.script.downloadURL}" target="_blank">Check update</a>)</p>`;

            lastrow.before(info);

            return newdiv;
        };

        const addChekboxOption = (settingsname,description,callback) => {
            let idbase = 'id_';
            // neem de opmaak over van de eerste regel met instelligen:
            let firsitemrow = document.body.querySelectorAll('.MuiPaper-rounded .MuiGrid-container .MuiGrid-item')[1];

            let option = document.createElement('div');
            option.className = firsitemrow.className;
            option.classList.add(`tribetools${settingsname}`);
            option.innerHTML = firsitemrow.innerHTML;
            option.querySelectorAll('.MuiGrid-item')[0].classList.add('tribetoolscolumn1');
            option.querySelectorAll('.MuiGrid-item')[1].classList.add('tribetoolscolumn2');
            option.querySelector('.tribetoolscolumn1').innerHTML = `<label for="${idbase}${settingsname}">${description}</label>`;
            option.querySelector('.tribetoolscolumn2').innerHTML = ''; // clear content
            option.querySelector('.tribetoolscolumn2').appendChild(self.addCheckbox(settingsname, e => {
                // console.log(GM_info.script.name + " - Checkbox aangepast",settingsname,checkbox.checked);
                if (typeof callback == 'function') {
                    callback();
                }
            },idbase));

            return document.body.querySelector('.tribetoolsoptionscontainter').appendChild(option);
        };

        const updateColorpickerTable = () => {
            const storeColor = (index,selectedColor) => {
                self.background.colors[index] = selectedColor;
                self.utils.storeSettings();
                self.applyColorStylesheet();
            };

            // colorpicker
            //  undobutton
            //  redobutton
            //  defaultbutton
            //  copybutton
            //  pastebutton

            const updateColorButtons = (index,undobutton,redobutton) => {
                undobutton.querySelector('.text').innerText = self.background.undocolors[index].length;
                redobutton.querySelector('.text').innerText = self.background.redocolors[index].length;

                undobutton.disabled = self.background.undocolors[index].length == 0;
                redobutton.disabled = self.background.redocolors[index].length == 0;

                colorpickertable.querySelectorAll('button.defaultbutton').forEach((el,index) => {
                    el.disabled = self.defaultcolors[index] == self.background.colors[index];
                });
                colorpickertable.querySelectorAll('button.pastebutton').forEach((el,index) => {
                    el.disabled = !self.copiedColor || self.copiedColor == self.background.colors[index];
                });
                colorpickertable.querySelectorAll('button.copybutton').forEach((el,index) => {
                    el.disabled = self.copiedColor == self.background.colors[index];
                });
            };

            let colorpickertable = document.body.querySelector('table.tribetoolscolorpicker');
            if (!colorpickertable) return;
            [...colorpickertable.rows].reverse().forEach(row => row.remove()); // remove all table rows

            self.utils.prepareColors();
            self.background.colors.forEach((color,index) => {
                if (!(self.background.undocolors[index] instanceof Array)) {
                    self.background.undocolors[index] = [];
                    self.utils.storeSettings();
                }
                if (!(self.background.redocolors[index] instanceof Array)) {
                    self.background.redocolors[index] = [];
                    self.utils.storeSettings();
                }

                let row = colorpickertable.appendChild(document.createElement('tr'));
                row.innerHTML += `
<td colspan="6">${['Kleur rechtsboven','Kleur schuin midden','Kleur linksonder'][index]}:</td>
`;
                let colorrow = colorpickertable.appendChild(document.createElement('tr'));
                colorrow.innerHTML += `
<td><input type="color"></td>
<td><button class="undobutton" title="Herstel naar vorige waarde"><span class="icon">↶</span><span class="text"></span></button></td>
<td><button class="redobutton" title="Redo"><span class="icon">↷</span><span class="text"></span></button></td>
<td><button class="defaultbutton" title="Herstel naar default waarde"><span class="icon">D</span></button></td>
<td><button class="copybutton" title="Kopieer deze waarde"><span class="icon">C</span></button></td>
<td><button class="pastebutton" title="Plak de gekopieerde waarde"><span class="icon">P</span></button></td>
`;
                let colorpicker = colorrow.querySelector(`input[type=color]`);
                let undobutton = colorrow.querySelector(`button.undobutton`);
                let redobutton = colorrow.querySelector(`button.redobutton`);
                let defaultbutton = colorrow.querySelector(`button.defaultbutton`);
                let copybutton = colorrow.querySelector(`button.copybutton`);
                let pastebutton = colorrow.querySelector(`button.pastebutton`);

                updateColorButtons(index,undobutton,redobutton);

                colorpicker.value = color;
                colorpicker.addEventListener('input', e => { // kleur in dialog wordt aangepast
                    const selectedColor = e.target.value;
                    storeColor(index,selectedColor);
                    updateColorButtons(index,undobutton,redobutton);
                },false);
                colorpicker.addEventListener('change', e => { // dialog wordt gesloten
                    const selectedColor = e.target.value;
                    self.background.undocolors[index].push(self.background.colors[index]);
                    self.background.redocolors[index].length = 0;
                    storeColor(index,selectedColor);
                    updateColorButtons(index,undobutton,redobutton);
                },false);
                undobutton.addEventListener('click', e => {
                    if (!self.background.undocolors[index].length) return;
                    self.background.redocolors[index].push(self.background.colors[index]);
                    const selectedColor = self.background.undocolors[index].pop();
                    colorpicker.value = selectedColor;
                    storeColor(index,selectedColor);
                    updateColorButtons(index,undobutton,redobutton);
                },false);
                redobutton.addEventListener('click', e => {
                    if (!self.background.redocolors[index].length) return;
                    self.background.undocolors[index].push(self.background.colors[index]);
                    const selectedColor = self.background.redocolors[index].pop();
                    colorpicker.value = selectedColor;
                    storeColor(index,selectedColor);
                    updateColorButtons(index,undobutton,redobutton);
                },false);
                defaultbutton.addEventListener('click', e => {
                    const selectedColor = self.defaultcolors[index];
                    if (self.background.colors[index] == selectedColor) return;
                    self.background.undocolors[index].push(self.background.colors[index]);
                    self.background.redocolors[index].length = 0;
                    colorpicker.value = selectedColor;
                    storeColor(index,selectedColor);
                    updateColorButtons(index,undobutton,redobutton);
                },false);
                copybutton.addEventListener('click', e => {
                    self.copiedColor = self.background.colors[index];
                    updateColorButtons(index,undobutton,redobutton);
                },false);
                pastebutton.addEventListener('click', e => {
                    if (!self.copiedColor) return;
                    const selectedColor = self.copiedColor;
                    if (self.background.colors[index] == selectedColor) return;
                    self.background.undocolors[index].push(self.background.colors[index]);
                    self.background.redocolors[index].length = 0;
                    colorpicker.value = selectedColor;
                    storeColor(index,selectedColor);
                    updateColorButtons(index,undobutton,redobutton);
                },false);
            });
            self.applyColorStylesheet();
        };

        const updateColorFavorites = (parent) => {
            let table = parent.querySelector('table.colorfavorites');
            if (!table) {
                table = parent.appendChild(document.createElement('table'));
                table.className = 'colorfavorites';
            } else {
                table.innerHTML = '';
            }

            self.utils.prepareColors();
            self.settings.colorfavorites.forEach((colorset,favindex) => {
                let row = table.appendChild(document.createElement('tr'));
                row.innerHTML = `
<td><div class="tribetoolsexample${favindex} selectbutton" style="width: 50px; height: 50px; display: inline-block; cursor: pointer; border: 1px solid black;"></div></td>
<td><button class="removebutton">Verwijder</button></td>
`;
                let selectbutton = row.querySelector(`div.selectbutton`);
                let removebutton = row.querySelector(`button.removebutton`);
                let example = row.querySelector('.tribetoolsexample');
                selectbutton.addEventListener('click', (event) => {
                    self.background.colors.forEach((color,index) => {
                        if ((!self.background.undocolors[index].length || self.background.undocolors[index][self.background.undocolors[index].length - 1] != color) && color != self.settings.colorfavorites[favindex][index]) self.background.undocolors[index].push(color);
                        self.background.redocolors[index].length = 0;
                        self.background.colors[index] = self.settings.colorfavorites[favindex][index];
                    });
                    self.utils.storeSettings();
                    updateColorpickerTable();
                },false);
                removebutton.addEventListener('click', (event) => {
                    if (!confirm('Weet je zeker dat je deze favoriete kleuren combinatie wilt verwijderen?')) return;
                    self.settings.colorfavorites.splice(favindex, 1);
                    self.utils.storeSettings();
                    updateColorFavorites(parent);
                },false);
            });
        };

        // stop monitoring
        self.observer.disconnect();
        document.body.querySelector('.MuiPaper-rounded').parentElement.parentElement.appendChild(createContainer());

        let backgroundcolorsoption = addChekboxOption('enablebackgroundcolors','Achtergrondkleur', self.applyColorStylesheet);

        let backgroundcolorscolumn2 = backgroundcolorsoption.querySelector('.tribetoolscolumn2');
        let label = backgroundcolorscolumn2.appendChild(document.createElement('label'));
        label.innerHTML = 'Activeer';
        label.setAttribute('for',"id_enablebackgroundcolors");
        backgroundcolorscolumn2.appendChild(document.createElement('br'));
        backgroundcolorscolumn2.appendChild(document.createTextNode('Kleuren overgang:'));
        let colorpickertable = backgroundcolorscolumn2.appendChild(document.createElement('table'));
        colorpickertable.className = 'tribetoolscolorpicker';
        let colorstorage = backgroundcolorscolumn2.appendChild(document.createElement('div'));
        colorstorage.innerHTML = `
<button class="eraseundohistory">Wis undo/redo historie</button><br>
<button class="storefavorite">Bewaar als favoriete combinatie</button>
`;

        self.utils.prepareColors();
        updateColorpickerTable();
        updateColorFavorites(backgroundcolorscolumn2);

        colorstorage.querySelector(`button.storefavorite`).addEventListener('click', (event) => {
            if (self.settings.colorfavorites.filter((favorite) => favorite.join("\t") == self.background.colors.join("\t")).length) return;
            self.settings.colorfavorites.push([...self.background.colors]);
            self.utils.storeSettings();
            updateColorFavorites(backgroundcolorscolumn2);
            self.applyColorStylesheet();
        },false);
        colorstorage.querySelector(`button.eraseundohistory`).addEventListener('click', (event) => {
            if (!confirm('Weet je zeker dat je de kleuren keuze undo/redo historie wilt verwijderen?')) return;
            self.background.undocolors.forEach(colors => { colors.length = 0; });
            self.background.redocolors.forEach(colors => { colors.length = 0; });
            self.utils.storeSettings();
            updateColorpickerTable();
        },false);

        Object.keys(self.options).forEach(key => {
            if (self.options[key].description && `enable${key}` in self.settings) {
                addChekboxOption(`enable${key}`,self.options[key].description,typeof self.options[key].check == 'function' ? self.options[key].check : self.options[key].apply);
            }
        });

        // restart monitoring
        self.observer.connect();
    };

    // 11. Plaats de +Notitie knop als laatste knop
    self.applyButtonOrder = () => {
        let stylesheet = document.head.querySelector('style.tribetoolsbuttonorder');
        if (!self.settings.enablebuttonorder && stylesheet) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (self.settings.enablebuttonorder && !stylesheet) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsbuttonorder';
            stylesheet.innerHTML = `
.tribetoolsbuttonorder .Mui-selected {
    border-bottom: 3px solid rgb(186, 11, 75);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
.tribetoolsbuttonorder .MuiTabs-indicator {
    display: none;
}
`;
        }

        if (self.settings.enablebuttonorder && !self.notitiehidden() && !document.body.querySelector('div.tribetoolsbuttonorder')) {
            document.body.querySelectorAll('.MuiTabs-scroller').forEach(buttonarea => {
                let buttonlist = buttonarea.querySelectorAll('button[role=tab]');
                let buttonnotitieindex = [...buttonlist].findIndex(button => button.querySelector('p')?.innerText == 'Notitie');
                if (buttonnotitieindex == -1 || buttonnotitieindex == buttonlist.length - 1) return;

                let buttonnotitie = buttonlist[buttonnotitieindex];
                let lastbutton = buttonlist[buttonlist.length - 1];

                self.observer.disconnect();
                buttonarea.classList.add('tribetoolsbuttonorder');
                buttonnotitie.setAttribute('tribetoolsindex',buttonnotitieindex);
                lastbutton.after(buttonnotitie);
            });
        } else if ((!self.settings.enablebuttonorder || self.notitiehidden()) && document.body.querySelector('div.tribetoolsbuttonorder [tribetoolsindex]')) {
            let buttonarea = document.body.querySelector('div.tribetoolsbuttonorder');
            let buttonlist = buttonarea.querySelectorAll('button[role=tab]');
            let buttonnotitie = buttonarea.querySelector('[tribetoolsindex]');
            let buttonnotitieindex = parseInt(buttonnotitie.getAttribute('tribetoolsindex'));

            self.observer.disconnect();
            if (buttonnotitieindex >= 1) {
                buttonlist[buttonnotitieindex - 1].after(buttonnotitie);
            } else { // before first button:
                buttonlist[0].before(buttonnotitie);
            }
            buttonarea.classList.remove('tribetoolsbuttonorder');
        }

        self.observer.connect();
    };

    // 12. Pas een aangepaste weergave toe (lijntjes rond de notitie kaders)
    self.applyMyStyle = () => {
        let stylesheet = document.head.querySelector('style.tribetoolsmystyle');
        if (!self.settings.enablemystyle && stylesheet) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (self.settings.enablemystyle && !stylesheet) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsmystyle';
            stylesheet.innerHTML = `
.section-DUA6cC:last-child div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root {
    border: 1px solid #80808061;
}
.section-DUA6cC:last-child div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation0.MuiCard-root > div:first-child {
    border-bottom: 1px solid #80808061;
}
.DayPicker { /* voorkom resizen van de datum prikker */
    min-height: 350px;
}
.section-DUA6cC:last-child .ql-editor {
    background-color: white;
    border: 1px solid #80808061;
    border-radius: 4px;
    padding: 4px !important;
}
`;
        }
        self.observer.connect();
    };

    // 13. Breng een geselecteerd list item in een lijst in beeld (handig bij uren en minuten)
    self.applyScrollCenter = () => {
        if (!self.settings.enablescrollcenter) return;
        document.body.querySelectorAll('li.Mui-selected').forEach(selected => {
            let list = selected.closest('[class^=root-]');
            if (!list || list.classList.contains('tribetoolsscroll') || !selected.innerText) return;
            self.observer.disconnect();
            list.classList.add('tribetoolsscroll');
            selected.scrollIntoView({behavior: "smooth", block: "center"})
        });
        self.observer.connect();
    };

    // 14. Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)
    self.setupBlur = () => {
        window.addEventListener('blur', () => {
            if (self.settings.enablelistblur) {
                if (document.activeElement?.getAttribute('aria-autocomplete') == 'list') {
                    console.log(`${GM_info.script.name} - Wis de focus van het actieve list element (om uitklappen te voorkomen)`); // ,document.activeElement);
                    document.activeElement.blur();
                }
            }
        },false);
    };

    // 15. Herstel de stand van de checkbox voor Geavanceerd (bij velden toevoegen)
    self.applyAdvancedFields = () => {
        let advancedswitch = document.body.querySelector('p:has(span[data-test-label="Generic.Advanced"])')?.previousSibling?.querySelector('input[type=checkbox]:not(.tribetoolsadvanced)');
        if (!advancedswitch) return;
        self.observer.disconnect();
        advancedswitch.classList.add('tribetoolsadvanced');
        if (!advancedswitch.checked && self.settings.advancedswitchchecked) {
            advancedswitch.click();
        }
        advancedswitch.addEventListener('click', e => {
            self.settings.advancedswitchchecked = advancedswitch.checked;
            self.utils.storeSettings();
        },false);
        self.observer.connect();
    };

    // 16. Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)
    self.applyTrimClipboard = () => {
        let searchinput = document.body.querySelector('header input[type=text],header input[type=search]');
        if (!searchinput) return;

        if (searchinput.classList.contains('tribetoolsfocus')) return;
        self.observer.disconnect();

        searchinput.classList.add('tribetoolsfocus');
        searchinput.addEventListener('focus',async (e) => {
            if (!self.settings.enabletrimclipboard) return;

            try {
                let items = await navigator.clipboard.read();
                //console.log("read clipboard length:",items.length);
                for (const item of items) {
                    if (item.types.includes("text/html")) {
                        //console.log("skip clipboard rich-text");
                        // doe niks met rich-text
                        const blob = await item.getType("text/html");
                        const blobText = await blob.text();
                        // console.log(blob);
                        // console.log(blobText);
                    } else {
                        //console.log("read clipboard item:",item);
                        // check clipboard, trim spaces
                        navigator.clipboard.readText().then((text) => {
                            //console.log("read clipboard text:",text);
                            if (text.trim() != text) {
                                navigator.clipboard.writeText(text.trim()).then(() => {
                                    console.log(`${GM_info.script.name} - Spaties gewist voor en achter de gekopieerde platte tekst`,text.trim());
                                }).catch(e => {
                                    console.warn(`${GM_info.script.name} - Schrijf toegang tot het clipboard is mislukt`,e.toString());
                                    // self.settings.enabletrimclipboard = false;
                                    // self.utils.storeSettings();
                                });
                            };
                        }).catch(e => {
                            console.warn(`${GM_info.script.name} - Lees toegang (readText) van het clipboard is mislukt`,e.toString());
                            // self.settings.enabletrimclipboard = false;
                            // self.utils.storeSettings();
                        });
                    }
                }
            } catch(e) {
                console.warn(`${GM_info.script.name} - Lees toegang (read) van het clipboard is mislukt`,e.toString());
            }
        },false);

        self.observer.connect();
    };

    // 16. Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)
    self.setupClipboardAccess = () => {
        if (!self.settings.enabletrimclipboard) return;

        let disableClipboardAccess = () => {
            self.settings.enabletrimclipboard = false;
            self.utils.storeSettings();
            self.updateCheckboxes();
        };

        // trigger clipboard access
        navigator.clipboard.readText().then(text => {
            console.log(`${GM_info.script.name} - Clipboard lees toegang is mogelijk`);
            setTimeout(() => {
                navigator.clipboard.writeText(text).then(() => {
                    console.log(`${GM_info.script.name} - Clipboard schrijf toegang is mogelijk`);
                }).catch(e => {
                    console.log(`${GM_info.script.name} - Clipboard writeText error`,e.toString());
                    if (!e.toString().match(/Document is not focused/i)) {
                        alert("Test clipboard toegang\n\nSchrijf toegang tot het clipboard is mislukt.\nDeze optie wordt uitgeschakeld.");
                        disableClipboardAccess();
                    }
                });
            },1000);
        }).catch(e => {
            console.log(`${GM_info.script.name} - Clipboard readText error`,e.toString());
            if (!e.toString().match(/Document is not focused/i)) {
                alert("Test clipboard toegang\n\nLees toegang van het clipboard is mislukt.\nDeze optie wordt uitgeschakeld.");
                disableClipboardAccess();
            }
        });
    };

    // 17. Maak de breedte passend voor de weergave keuzelijst
    self.applyComboWidth = () => {
        let stylesheet = document.head.querySelector('style.tribetoolscombowidth');
        if (stylesheet && !self.settings.enablecombowidth) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablecombowidth) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolscombowidth';
            // remove style display:flex from this element
            stylesheet.innerHTML = `
.MuiInputBase-root:has([role=combobox]) .MuiBox-root {
    display: block !important;
}
`;
        }
        self.observer.connect();
    };

    // 18. Herstel de scroll positie na terugkeer naar een eerder geopend scherm
    self.applyScrollRestore = () => {
        // clean up old restore details (24 hours)
        let keepactiverestores = self.settings.scrollrestore.filter(restore => restore.timestamp > new Date().getTime() - 1000 * 60 * 60 * 24);
        if (keepactiverestores.length < self.settings.scrollrestore.length) {
            self.settings.scrollrestore = keepactiverestores;
            self.utils.storeSettings();
        }

        if (!self.settings.enablescrollrestore) return;

        let scrollarea = document.body.querySelector('.MuiBox-root.css-1jt5h62');
        if (!scrollarea) return;

        let restore = self.settings.scrollrestore.find(restore => restore.url == location.href);
        if (!scrollarea.classList.contains('tribetoolsscrollrestored') && restore && scrollarea.scrollHeight >= restore.height) {
            self.observer.disconnect();
            console.log('Herstel de scroll positie voor deze pagina: ' + restore.title);
            scrollarea.classList.add('tribetoolsscrollrestored');
            scrollarea.scrollTop = restore.top;
        }
        if (!scrollarea.classList.contains('tribetoolsscrollrestore')) {
            self.observer.disconnect();
            scrollarea.classList.add('tribetoolsscrollrestore');
            scrollarea.addEventListener('scroll', e => {
                let restore = {
                    url: location.href,
                    title: document.title,
                    top: scrollarea.scrollTop,
                    height: scrollarea.scrollHeight,
                    timestamp: new Date().getTime()
                };
                let restoreindex = self.settings.scrollrestore.findIndex(restore => restore.url == location.href);
                if (restoreindex >= 0) {
                    self.settings.scrollrestore[restoreindex] = restore;
                } else {
                    self.settings.scrollrestore.push(restore);
                }
                self.utils.storeSettings();
            },false);
        }
        self.observer.connect();
    };

    // 19. Voorkom het sluiten van een popup door naast de popup te klikken
    self.applyNoClickArea = () => {
        let stylesheet = document.head.querySelector('style.tribetoolsnoclickarea');
        if (stylesheet && !self.settings.enablenoclickarea) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablenoclickarea) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsnoclickarea';
            // remove style display:flex from this element
            stylesheet.innerHTML = `
[role=presentation].MuiDialog-root .MuiDialog-container:has([role=dialog].tribetoolsnoclickarea) {
    display: grid !important;
    height: 100%;
    justify-content: normal;
    align-items: normal;
}
[role=presentation].MuiDialog-root .MuiDialog-container [role=dialog].tribetoolsnoclickarea {
    cursor: default;
}
[role=presentation].MuiDialog-root .MuiDialog-container:has([role=dialog].tribetoolsnoclickarea) > div.tribetoolsnoclickareadiv {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eef5f35c;
    height: 100vh;
    width: 100vw;
    cursor: not-allowed;
}
.tribetoolsnoclickareadiv > div[role=dialog].tribetoolsnoclickarea {
    max-height: 100vh;
    max-width: 100vh;
}
`;
        }

        if (self.settings.enablenoclickarea) {
            //let popup = document.body.querySelector('[role=presentation].MuiDialog-root:has(.MuiDialog-container:has([role=dialog]):not(.tribetoolsnoclickarea))');
            //let popup = document.body.querySelector('[role=presentation].MuiDialog-root .MuiDialog-container:has([role=dialog]):not(.tribetoolsnoclickarea)');
            let popup = document.body.querySelector('[role=presentation].MuiDialog-root:has(.MuiDialog-container)');
            let container = popup?.querySelector('.MuiDialog-container:has([role=dialog]');
            let dialog = popup?.querySelector('[role=dialog]:not(.tribetoolsnoclickarea)');
            let closebutton = dialog ? [...dialog?.querySelectorAll('button')].filter(button => [...button.children].find(child => child.innerText == 'close'))[0] : undefined;
            if (container && dialog && closebutton) {
                self.observer.disconnect();
                dialog.classList.add('tribetoolsnoclickarea');
                let noclickcontainer = document.createElement('div');
                noclickcontainer.className = 'tribetoolsnoclickareadiv';
                container.append(noclickcontainer);
                noclickcontainer.append(dialog);

                noclickcontainer.addEventListener('click',e => {
                    if (e.target == noclickcontainer) {
                        e.stopPropagation();
                    }
                },false);

                closebutton.addEventListener('click',e => {
                    e.stopPropagation();
                    let backdrop = dialog.querySelector('button[data-test-id=button-wizard-cancel]') || popup.querySelector('.MuiBackdrop-root');
                    backdrop.click();
                },false);
            }
        }

        self.observer.connect();
    };

    // 20. Verberg knop Notitie toevoegen bij een Organisatie
    self.notitiehidden = () => {
        return document.body.querySelector('button.tribetoolshidenotitie');
    };
    self.applyHideNotitie = () => {
        let stylesheet = document.head.querySelector('style.tribetoolshidenotitie');
        if (stylesheet && !self.settings.enablehidenotitie) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablehidenotitie) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolshidenotitie';
            stylesheet.innerHTML = `
button.tribetoolshidenotitie {
    display: none;
}
`;
        }

        let relationshipbutton = document.body.querySelector('[data-test-id="label-entity-type"][data-test-label^="Relationship.Organization."]');
// Relationship.Organization.CommercialRelationship.Prospect > Prospect
// Relationship.Organization.CommercialRelationship.Customer > Klant
// Relationship.Organization.Identity > GERRIT
// Activity.SupportTicket > Support Ticket
// 1cdcf8e0-e5a1-4d12-939e-f4b9ac00cf98 > Wijziging
        if (self.settings.enablehidenotitie && !self.notitiehidden() && relationshipbutton) {
            document.body.querySelectorAll('.MuiTabs-scroller').forEach(buttonarea => {
                buttonarea.querySelectorAll('button[role=tab]').forEach(button => {
                    if (button.querySelector('p')?.innerText == 'Notitie') {
                        self.observer.disconnect();
                        button.classList.add('tribetoolshidenotitie');
                    }
                });
            });
        } else if (!self.settings.enablehidenotitie && self.notitiehidden() && !relationshipbutton) {
            self.observer.disconnect();
            self.notitiehidden().classList.remove('tribetoolshidenotitie');
        }

        self.observer.connect();
    };

    // 21. Aangepaste (opvallende) weergave voor beheerders configuratie menu
    self.applyConfigurationStyle = () => {
        let stylesheet = document.head.querySelector('style.tribetoolsconfiguration');
        if (stylesheet && !self.settings.enableconfigurationstyle) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enableconfigurationstyle) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsconfiguration';
            stylesheet.innerHTML = `
div.tribetoolsconfiguration {
    background-color: #faa;
    padding-right: 12px;
}
div.tribetoolsconfiguration > div:has(div > button) {
    padding-bottom: 35px;
}
`;
        }

        let configelement = document.body.querySelector('.MuiBox-root.tribetoolsconfiguration');
        if (configelement && !self.settings.enableconfigurationstyle) {
            self.observer.disconnect();
            configelement.classList.remove('tribetoolsconfiguration');
        } else if (!configelement && self.settings.enableconfigurationstyle) {
            configelement = document.body.querySelector('[data-test-label="Generic.Configuration"]')?.parentElement?.parentElement?.parentElement?.parentElement;
            if (configelement && !configelement.querySelector('header') && configelement.classList.contains('MuiBox-root') && configelement.querySelector('[data-test-id="configuration-back-button"]')) {
                self.observer.disconnect();
                configelement.classList.add('tribetoolsconfiguration');
            }
        }

        let getautomationsbutton = document.body.querySelector('.tribetoolsgetautomations');
        if (getautomationsbutton && !self.settings.enableconfigurationstyle) {
            self.observer.disconnect();
            getautomationsbutton.remove();
        } else if (!getautomationsbutton && self.settings.enableconfigurationstyle) {
            let automationbutton = [...document.body.querySelectorAll('button:has(span.MuiBox-root)')].find(button => button.querySelector('span.MuiBox-root').innerText == 'Automation');
            let addbutton = [...document.body.querySelectorAll('button:has(span[data-test-label])')].find(button => button.querySelector('span[data-test-label]').innerText == 'Toevoegen');
            let entity = document.body.querySelector('h4 span')?.innerText;
            if (automationbutton || addbutton && entity == 'Automations') {
                self.observer.disconnect();
                getautomationsbutton = document.createElement('button');
                getautomationsbutton.className = automationbutton?.className || addbutton.className;
                getautomationsbutton.classList.add('tribetoolsgetautomations');
                getautomationsbutton.innerHTML = automationbutton?.innerHTML || addbutton.innerHTML;
                getautomationsbutton.querySelector('span.material-icons-outlined,i.material-icons,span.material-symbols-outlined').innerText = 'content_copy';
                getautomationsbutton.querySelector('span.MuiBox-root,span[data-test-label]').innerText = 'Kopieer lijst';

                if (automationbutton) {
                    automationbutton.after(getautomationsbutton);
                } else {
                    document.body.querySelector('h4').appendChild(getautomationsbutton);
                }
                getautomationsbutton.addEventListener('click',e => {
                    let loadmore = document.body.querySelector('[data-test-label="LoadMore"]');
                    if (loadmore) {
                        getautomationsbutton.loadmore = true;
                        if (confirm('Er is nog meer data. Wil je eerst meer laden?')) {
                            loadmore.click();
                            return;
                        }
                    }

                    let columns = undefined;
                    let text = ['entiteit','type','fail','actief','naam','beschrijving','trigger'].join("\t") + "\n";
                    text += [...document.body.querySelectorAll('input[type=checkbox]')].filter(checkbox => checkbox.closest('tr') && checkbox.closest('tr').querySelector('td') && (checkbox.closest('tr').cells.length == 4 || checkbox.closest('tr').cells.length == 5)).map(checkbox => {
                        let tr = checkbox.closest('tr');
                        if (!columns) {
                            // find columns
                            columns = {
                                icon: -1,
                                entity: -1,
                                title: -1,
                                description: -1,
                                trigger: -1,
                                failicon: -1
                            };
                            [...tr.cells].forEach((cell,index) => {
                                console.log(cell.outerHTML);
                                if (cell.querySelector('span.material-icons') && columns.icon < 0) {
                                    columns.icon = index;
                                } else if (cell.innerHTML == cell.innerText) {
                                    columns.entity = index;
                                } else if (cell.querySelector('div[class^=root] > div[class^=item]')) {
                                    columns.title = index;
                                    columns.description = index;
                                    columns.trigger = index;
                                } else if (cell.querySelector('div > span.material-icons')) {
                                    columns.failicon = index;
                                }
                            });
                        }

                        if (tr.cells.length == 5) {
                            let icon = columns.icon >= 0 ? tr.cells[columns.icon].querySelector('span.material-icons').innerText : '';
                            let entity = columns.entity >= 0 ? tr.cells[columns.entity].innerText : '';
                            let title = columns.title >= 0 ? tr.cells[columns.title].querySelectorAll('[class^=item]')[0].innerText : '';
                            let trigger = columns.trigger >= 0 ? tr.cells[columns.trigger].querySelectorAll('[class^=item]')[1].innerText : '';
                            let description = columns.description >= 0 ? tr.cells[columns.description].querySelectorAll('[class^=item]')[2].innerText : '';
                            let failicon = columns.failicon >= 0 ? tr.cells[columns.failicon].querySelector('span.material-icons')?.innerText || '' : '';
                            return [entity,icon,failicon,checkbox.checked,title,description,trigger].join("\t");
                        } else if (tr.cells.length == 4) {
                            let icon = columns.icon >= 0 ? tr.querySelector('td span.material-icons').innerText : '';
                            let entity = document.body.querySelector('h4').innerText;
                            let title = columns.title >= 0 ? tr.cells[columns.title].querySelectorAll('[class^=item]')[0].innerText : '';
                            let trigger = columns.trigger >= 0 ? tr.cells[columns.trigger].querySelectorAll('[class^=item]')[1].innerText : '';
                            let description = columns.description >= 0 ? tr.cells[columns.description].querySelectorAll('[class^=item]')[2].innerText : '';
                            let failicon = columns.failicon >= 0 ? tr.cells[columns.failicon].querySelector('span.material-icons').innerText || '' : '';
                            return [entity,icon,failicon,checkbox.checked,title,description,trigger].join("\t");
                        } else {
                            console.log('Skip row',tr.querySelectorAll('td').length,tr);
                        }
                    }).join("\n");
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Lijst is gekopieerd naar het clipboard');
                    }).catch(e => {
                        alert('Kopieren van de lijst is mislukt');
                    });
                },false);
            }
        }

        self.observer.connect();
    };

    // 22. Verberg de AI button
    self.applyHideAI = () => {
        let aibutton = document.body.querySelector('button.tribe-ai-button');
        if (!aibutton) return;

        let stylesheet = document.head.querySelector('style.tribetoolshideai');
        if (stylesheet && !self.settings.enablehideai) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablehideai) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolshideai';
            stylesheet.innerHTML = `
button.tribetoolshideai {
    display: none;
}
`;
        }

        if (aibutton.classList.contains('tribetoolshideai') && !self.settings.enablehideai) {
            self.observer.disconnect();
            aibutton.classList.remove('tribetoolshideai');
        } else if (!aibutton.classList.contains('tribetoolshideai') && self.settings.enablehideai) {
            self.observer.disconnect();
            aibutton.classList.add('tribetoolshideai');
        }

        self.observer.connect();
    };

    // 23. Toon zoek resultaat details onder elkaar
    self.applySearchResultFormatting = () => {
        let stylesheet = document.head.querySelector('style.tribetoolsearchresultformatting');
        if (stylesheet && !self.settings.enablesearchresultformatting) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablesearchresultformatting) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsearchresultformatting';
            stylesheet.innerHTML = `
[class*=listCard] div.MuiStack-root:has(> .tribe-size-md) {
    flex-direction: column;
}
`;
        }

        self.observer.connect();
    };

    // 24. Selecteer na terugkeer het eerder geselecteerde submenu
    self.applySubmenuRestore = () => {
        document.body.querySelectorAll('[class^=body] .MuiPaper-root .MuiTabs-scroller button:has(span[data-test-label]):not(.tribetoolssubmenubutton)').forEach(button => {
            button.classList.add('tribetoolssubmenubutton');
            if (self.settings.restoresubmenu[location.pathname] && button.querySelector('span[data-test-label]').getAttribute('data-test-label') == self.settings.restoresubmenu[location.pathname]) {
                button.focus();
                button.click();
            }
            button.addEventListener('click', e => {
                self.settings.restoresubmenu[location.pathname] = button.querySelector('span[data-test-label]').getAttribute('data-test-label');
                self.utils.storeSettings();
            },false);
        });
    };

    // 25. Plaats de kolom Naam als laatste bij de Automations
    self.applyAutomationsColumns = () => {
        if (self.settings.enableautomationscolumns && location.pathname.match(/^\/configuration\/automations/)) {
            let tables = [...document.body.querySelectorAll('table')].filter(table => table.querySelectorAll('thead > tr > th').length == 5 && (table.querySelectorAll('tbody > tr > td')[2]?.querySelector('[class^=root] > [class^=item]') || table.querySelectorAll('thead > tr > th')[2]?.innerText == 'Naam'));
            tables.forEach(table => {
                [...table.rows].forEach((row,index) => {
                    if (index > 0 && row.cells[2]?.querySelector('[class^=root] > [class^=item]') || index == 0 && row.cells[2]?.innerText == 'Naam') {
                        self.observer.disconnect();
                        row.cells[4].after(row.cells[2]);
                    }
                });
            });
            self.observer.connect();
        } else if (self.settings.enableautomationscolumns && location.pathname.match(/^\/.*\/configuration\/automations/)) {
            let tables = [...document.body.querySelectorAll('table')].filter(table => table.querySelectorAll('thead > tr > th').length == 4 && (table.querySelectorAll('tbody > tr > td')[1]?.querySelector('[class^=root] > [class^=item]') || table.querySelectorAll('thead > tr > th')[1]?.innerText == 'Naam'));
            tables.forEach(table => {
                [...table.rows].forEach((row,index) => {
                    if (index > 0 && row.cells[1]?.querySelector('[class^=root] > [class^=item]') || index == 0 && row.cells[1]?.innerText == 'Naam') {
                        self.observer.disconnect();
                        row.cells[3].after(row.cells[1]);
                    }
                });
            });
            self.observer.connect();
        }

        if (location.pathname.match(/^\/.*\/configuration\/automations/)) {
            document.body.querySelectorAll('table').forEach(table => {
                let checkboxcolumn = [...table.querySelector('tbody tr').querySelectorAll('td')].findIndex(td => td.querySelector(':has(span[data-test-checked] input[type=checkbox])'));
                if (checkboxcolumn >= 0 && !table.querySelector('.tribetoolsautomationsfilter')) {
                    let checkboxarea = document.createElement('div');
                    checkboxarea.className = 'tribetoolsautomationsfilter';
                    let checkbox = checkboxarea.appendChild(document.createElement('input'));
                    checkbox.type = 'checkbox';
                    checkbox.addEventListener('change',e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (checkbox.checked) {
                            [...table.rows].forEach(row => {
                                if (row.querySelector('span[data-test-checked=false]') && row.querySelector('input[type=checkbox]')?.checked == false) {
                                    row.classList.add('tribetoolshiderow');
                                }
                            });
                        } else {
                            table.querySelectorAll('.tribetoolshiderow').forEach(element => element.classList.remove('tribetoolshiderow'));
                        }
                    },false);
                    checkboxarea.appendChild(document.createTextNode('filter'));
                    self.observer.disconnect();
                    table.rows[0].cells[checkboxcolumn].appendChild(checkboxarea);
                    self.observer.connect();
                }
            });
        }
    };

    self.highlightLastClickedItem = () => {
        return;
        if (!document.body.querySelector('#root').classList.contains('tribetoolslastclicked')) {
            console.log('SETUP last click');
            document.body.querySelector('#root').classList.add('tribetoolslastclicked');
            document.body.querySelector('#root').addEventListener('click',e => {
                e.target.style.border = '1px solid red';
                console.log('last licked',e.target);
            },false);
        }
    };

    self.applyStickyroleheaders = () => {
        let header = document.body.querySelector('[class^=root] > [class^=item]:has(> .MuiBox-root > [class*=header] button > span.material-icons)');
        if (!header) return;

        let stylesheet = document.head.querySelector('.tribetoolsstickyroleheaders');
        if (stylesheet && !self.settings.enablestickyroleheaders) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablestickyroleheaders) {
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.className = 'tribetoolsstickyroleheaders';
            stylesheet.innerHTML = `
.MuiGrid-root:has(> .MuiPaper-root > [class^=root] > [class^=item] > .MuiBox-root > [class*=header] button > span.material-icons) {
    height: calc(100vh - 53px);
}
.MuiGrid-root > .MuiPaper-root:has(> [class^=root] > [class^=item] > .MuiBox-root > [class*=header] button > span.material-icons) {
    height: calc(100vh - 53px - 17px);
}
.MuiGrid-root > .MuiPaper-root > [class^=root]:has( > [class^=item] > .MuiBox-root > [class*=header] button > span.material-icons) {
    position: absolute;
}
[class^=root] > [class^=item]:has(> .MuiBox-root > [class*=header] button > span.material-icons) {
    position: sticky;
    top: 0px;

    background-color: rgba(255,255,255,0.9);
}
`;
        }
    };

    // 27. Verberg altijd deze tabs: Uren, Kilometers
    self.hideTabs = () => {
        let stylesheet = document.head.querySelector('.tribetoolshidetabs');
        if (stylesheet && !self.settings.enablehidetabs) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablehidetabs) {
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.className = 'tribetoolshidetabs';
            stylesheet.innerHTML = `
.MuiTabs-flexContainer > button.tribetoolshidetabs {
    width: 2px;
    margin: 0;
    min-width: 2px;
    border-left: 1px dashed #ff000036;
}
.MuiTabs-flexContainer > button.tribetoolshidetabs > div {
    display: none;
}
`;
        }

        if (self.settings.enablehidetabs) {
            document.body.querySelectorAll('.MuiTabs-flexContainer > button:not(.tribetoolshidetabs):has(div.MuiBox-root)').forEach(button => {
                if (!button.querySelector('div.MuiBox-root').textContent.match(/^(Uren|Kilometers)$/) || button.textContent != button.querySelector('div.MuiBox-root').textContent) return;
                self.observer.disconnect();
                button.classList.add('tribetoolshidetabs');
            });
            self.observer.connect();
        } else {
            document.body.querySelectorAll('button.tribetoolshidetabs').forEach(button => {
                button.classList.remove('tribetoolshidetabs');
            });
        }
    };

    // 28. Toon knoppen om bepaalde zoek resultaten te verbergen
    self.applyHideSearchResults = () => {
        let stylesheet = document.head.querySelector('.tribetoolssearchfilter');
        if (stylesheet && !self.settings.enablesearchfilters) {
            self.observer.disconnect();
            stylesheet.remove();
        } else if (!stylesheet && self.settings.enablesearchfilters) {
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.className = 'tribetoolssearchfilter';
            stylesheet.innerHTML = `
.tribetoolssearchbuttons .outercheckbox {
    zoom: 0.6;
}
div.tribetoolssearchfilter {
    display: none;
}
`;
        }

        if (self.settings.enablesearchfilters) {
            self.searchfilters.filter(filter => self.settings[`enablesearchfilter_${filter.id}`]).forEach(filter => {
                let searchrows = [...document.body.querySelectorAll('div[data-test-id=generic-search-content] div.MuiButtonBase-root:not(.tribetoolssearchfilter)')].filter(row => row.querySelector('div.textContent > p')?.innerText == filter.text);
                searchrows.forEach(row => {
                    self.observer.disconnect();
                    row.classList.add('tribetoolssearchfilter');
                });
            });
            self.searchfilters.filter(filter => !self.settings[`enablesearchfilter_${filter.id}`]).forEach(filter => {
                let searchrows = [...document.body.querySelectorAll('div[data-test-id=generic-search-content] div.MuiButtonBase-root.tribetoolssearchfilter')].filter(row => row.querySelector('div.textContent > p')?.innerText == filter.text);
                searchrows.forEach(row => {
                    self.observer.disconnect();
                    row.classList.remove('tribetoolssearchfilter');
                });
            });
        }

        if (self.settings.enablesearchfilters) {
            // voeg switches toe in het zoek scherm
            let searchfooter = document.body.querySelector('div[data-test-id=generic-search-footer]:not(:has(.tribetoolssearchbuttons))');
            if (searchfooter) {
                let searchbuttons = document.createElement('div');
                searchbuttons.append('Verberg:');
                searchbuttons.classList.add('tribetoolssearchbuttons');
                searchbuttons.addEventListener('click',e => {
                    e.stopPropagation();
                },false);

                self.searchfilters.forEach(filter => {
                    let searchbutton = searchbuttons.appendChild(self.addCheckbox(`enablesearchfilter_${filter.id}`, e => {
                        self.applyHideSearchResults();
                    }));
                    let label = searchbuttons.appendChild(document.createElement('label'));
                    label.classList.add('tribepointer');
                    label.classList.add('css-oqtjxi');
                    label.append(filter.text);
                    label.setAttribute('for',`id_enablesearchfilter_${filter.id}`);
                });

                self.observer.disconnect();
                searchfooter.prepend(searchbuttons);
            }
        } else {
            document.body.querySelector('.tribetoolssearchbuttons')?.remove();
        }

        self.observer.connect();
    };

    // 29. (admins) Gebruikerslijst header vast zetten en kleuren en filters voor beheerders en geblokkeerde gebruikers toevoegen
    self.applyHighlightUsers = () => {
        let enablehighlighter = window.location.href.match(/configuration\/employees/);

        let stylesheet = document.head.querySelector('.tribetoolshighlightusers');
        if (stylesheet && !enablehighlighter) {
            self.observer.disconnect();
            stylesheet.remove();
            self.observer.connect();
        } else if (!stylesheet && enablehighlighter) {
            document.querySelectorAll('div[class^=item] > div:has(>table):not(.tribetoolsuserstable)').forEach(div => {
                let columnheaders = [...div.querySelectorAll('table > thead > tr > th')].map(th => th.querySelector('span[data-test-label]')?.innerText);
                if (columnheaders.find(header => header == 'Gebruikersnaam')) {
                    self.observer.disconnect();
                    div.classList.add('tribetoolsuserstable');
                    self.observer.connect();
                }
            });
            let columnheaders = [...document.querySelectorAll('div.tribetoolsuserstable table > thead > tr > th')].map(th => th.querySelector('span[data-test-label]')?.innerText);
            let usercolumn = columnheaders.findIndex(header => header == 'Gebruikersnaam') + 1;
            let admincolumn = columnheaders.findIndex(header => header == 'Beheerder') + 1;
            let blockedcolumn = columnheaders.findIndex(header => header == 'Geblokkeerd') + 1;
            if (!columnheaders.length || !usercolumn || !admincolumn || !blockedcolumn) return;

            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.className = 'tribetoolshighlightusers';

            let updateStylsheet = () => {
                self.observer.disconnect();
                stylesheet.innerHTML = `
div.tribetoolsuserstable {
    overflow-y: auto;
    height: calc(100dvh - 374px);
    scrollbar-gutter: stable;
}
div.tribetoolsuserstable > table > thead > tr {
    top: 0;
    position: sticky;
    z-index: 1;
}
div.tribetoolsuserstable > table > thead > tr > th {
    box-shadow: inset 0 -1px #ccc;
}
div.tribetoolsuserstable > table > tbody > tr:has(td:nth-of-type(${admincolumn}) input[type=checkbox]:checked) {
    background-color: #38c4992b;
}
div.tribetoolsuserstable > table > tbody > tr:has(td:nth-of-type(${blockedcolumn}) input[type=checkbox]:checked) {
    background-color: #ff8e8e;
}
`;
                if (self.settings.enablefilteradmincolumn === false) {
                    stylesheet.innerHTML += `
div.tribetoolsuserstable > table > tbody > tr:has(td:nth-of-type(${admincolumn}) input[type=checkbox]:checked) {
    display: none;
}`;
                } else if (self.settings.enablefilteradmincolumn === true) {
                    stylesheet.innerHTML += `
div.tribetoolsuserstable > table > tbody > tr:has(td:nth-of-type(${admincolumn}) input[type=checkbox]:not(:checked)) {
    display: none;
}`;
                }
                if (self.settings.enablefilterblockedcolumn === false) {
                    stylesheet.innerHTML += `
div.tribetoolsuserstable > table > tbody > tr:has(td:nth-of-type(${blockedcolumn}) input[type=checkbox]:checked) {
    display: none;
}`;
                } else if (self.settings.enablefilterblockedcolumn === true) {
                    stylesheet.innerHTML += `
div.tribetoolsuserstable > table > tbody > tr:has(td:nth-of-type(${blockedcolumn}) input[type=checkbox]:not(:checked)) {
    display: none;
}`;
                }
                self.observer.connect();
            };

            let checkboxareaadmincolumn = document.querySelector(`table > thead > tr > th:nth-of-type(${admincolumn})`).appendChild(document.createElement('div'));
            checkboxareaadmincolumn.appendChild(self.addCheckbox('enablefilteradmincolumn', e => {
                updateStylsheet();
            },'id_enablefilteradmincolumn',true));
            let checkboxareablockedcolumn = document.querySelector(`table > thead > tr > th:nth-of-type(${blockedcolumn})`).appendChild(document.createElement('div'));
            checkboxareablockedcolumn.appendChild(self.addCheckbox('enablefilterblockedcolumn', e => {
                updateStylsheet();
            },'id_enablefilterblockedcolumn',true));
            updateStylsheet();
            self.observer.connect();
        }
    };

    // 30. (admins) Toon SMTP Error logging herzend details
    self.applySmtpLogging = () => {
        if (!document.querySelector('div[data-test-id=log-events-viewer]')) return;

        let updateLogging = () => {
            self.observer.disconnect();
            if (self.settings.filtersmtperrors === true) {
                //tribetoolssmtphide
                let logrows = [...document.querySelectorAll('div[data-test-id=log-events-viewer] tbody > tr.MuiTableRow-root')].filter(tr => tr.querySelector('td > div')?.textContent.match(/Error|Info/));
                logrows.forEach(tr => {
                    if (tr.classList.contains('tribetoolserrorfixed') || tr.querySelector('td > div')?.textContent == 'Info') {
                        tr.classList.add('tribetoolssmtphide');
                    } else {
                        tr.classList.remove('tribetoolssmtphide');
                    }
                });
            } else if (self.settings.filtersmtperrors === false) {
                //tribetoolssmtphide
                let logrows = [...document.querySelectorAll('div[data-test-id=log-events-viewer] tbody > tr.MuiTableRow-root')].filter(tr => tr.querySelector('td > div')?.textContent.match(/Error|Info/));
                logrows.forEach(tr => {
                    if (tr.querySelector('td > div')?.textContent == 'Info') {
                        tr.classList.add('tribetoolssmtphide');
                    } else {
                        tr.classList.remove('tribetoolssmtphide');
                    }
                });
            } else if (self.settings.filtersmtperrors === undefined) {
                document.querySelectorAll('.tribetoolssmtphide').forEach(tr => tr.classList.remove('tribetoolssmtphide'));
            }
            self.observer.connect();
        };

        let headerrow = document.querySelector('div[data-test-id=log-events-viewer] [class^=item] [class^=view-]');
        if (headerrow && !document.querySelector('.tribetoolssmtpinfo')) {
            self.observer.disconnect();
            self.settings.filtersmtperrors = undefined;
            headerrow.appendChild(self.addCheckbox('filtersmtperrors',updateLogging,'id_filtersmtperrors',true));
            let smtpinfo = headerrow.appendChild(document.createElement('div'))
            smtpinfo.classList.add('tribetoolssmtpinfo');
            updateLogging();
        }

        let stylesheet = document.head.querySelector('.tribetoolssmtplogging');
        if (!stylesheet) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.className = 'tribetoolssmtplogging';
            stylesheet.innerHTML = `
.tribetoolserrorfixed {
    background-color: #0080006e;
}
.tribetoolssmtphide {
    display: none;
}
`;
        }

        // zoek vanaf elke Error naar een Info row met hetzelfde onderwerp
        // als het er meer dan 1 is, geef dat dan ook aan
        let logrows = [...document.querySelectorAll('div[data-test-id=log-events-viewer] tbody > tr.MuiTableRow-root')].filter(tr => tr.querySelector('td > div')?.textContent.match(/Error|Info/));
        let errortitle = '';
        let unresolvedcount = 0;
        let fixedcount = 0;
        logrows.forEach((tr,index) => {
            if (tr.querySelector('td > div')?.textContent == 'Error') {
                errortitle = tr.querySelector('td > div > div > span > span')?.textContent.replace(/^Failed sending email with subject /,'');
                if (errortitle) {
                    let errorinfo = tr.querySelector('.tribetoolserrorinfo');
                    if (!errorinfo) {
                        self.observer.disconnect();
                        errorinfo = tr.querySelectorAll('td')[1].appendChild(document.createElement('div'));
                        errorinfo.className = 'tribetoolserrorinfo';
                    }
                    let sendmailcount = 0;
                    let errornumber = 0;
                    let sameerrorcount = 0;
                    let startindex = index;
                    logrows.forEach((trmatch,index) => {
                        if (index > startindex && trmatch.querySelector('td > div')?.textContent == 'Info' && trmatch.querySelector('td > div > div > span > div')?.textContent == errortitle) {
                            sendmailcount++;
                        } else if (trmatch.querySelector('td > div')?.textContent == 'Error' && trmatch.querySelector('td > div > div > span > span')?.textContent.replace(/^Failed sending email with subject /,'') == errortitle) {
                            sameerrorcount++;
                            if (index == startindex) errornumber = sameerrorcount;
                        }
                    });
                    let errorinfotext = ''
                    if (sameerrorcount > 1) errorinfotext += `E:${errornumber}/${sameerrorcount}`;
                    if (sameerrorcount > 1 && sendmailcount > 1) errorinfotext += ` - `;
                    if (sendmailcount > 1) errorinfotext += `S${sendmailcount}x`;
                    if (errorinfo.textContent != errorinfotext) {
                        self.observer.disconnect();
                        errorinfo.textContent = errorinfotext;
                        errorinfo.title = `${sameerrorcount} dezelfde errors / ${sendmailcount}x verzonden`
                    }
                    if (sendmailcount) {
                        if (!tr.classList.contains('tribetoolserrorfixed')) {
                            self.observer.disconnect();
                            tr.classList.add('tribetoolserrorfixed');
                        }
                        fixedcount++;
                    } else {
                        unresolvedcount++;
                    }
                }
            }
            let smtpinfo = `Unresolved errors: ${unresolvedcount} Fixed: ${fixedcount}`;
            if (document.querySelector('.tribetoolssmtpinfo').textContent != smtpinfo) {
                self.observer.disconnect();
                document.querySelector('.tribetoolssmtpinfo').textContent = smtpinfo;
            }
        });
        self.observer.connect();
        updateLogging();
    };

    self.applyPluginVersion = () => {
        let menuitems = document.body.querySelectorAll('ul[role=menu]');
        if (menuitems.length < 3) return;
        let menu = menuitems[1].closest('.MuiStack-root'); // document.body.querySelector('.MuiStack-root.css-y9h912');
        if (!menu) return;
        let pluginversion = menu.querySelector('.tribetoolsversion');
        if (pluginversion) return;
        self.observer.disconnect();

        let tribetoolsarea = menu.appendChild(document.createElement('div'));
        tribetoolsarea.className = 'tribetoolsmenu';

        let accountbutton = [...menu.querySelectorAll('span')].find(span => span.innerText == 'person')?.closest('li');
        if (accountbutton) {
            let settingsbutton = tribetoolsarea.appendChild(document.createElement('li'));
            settingsbutton.className = accountbutton.className;
            settingsbutton.innerHTML = accountbutton.innerHTML;
            settingsbutton.querySelector('span').innerText = 'settings';
            settingsbutton.querySelector('p').innerText = 'Toon alle instellingen...';
            settingsbutton.addEventListener('click',e => {
                e.stopPropagation();
                accountbutton.click();
            });
        }

        let idbase = 'idmenu_';

        Object.keys(self.options).filter(key => self.options[key].short).forEach(key => {
            let menuoption = tribetoolsarea.appendChild(document.createElement('span'));
            menuoption.appendChild(self.addCheckbox(`enable${key}`,self.options[key].apply,idbase));
            let label = menuoption.appendChild(document.createElement('label'));
            label.setAttribute('for',`${idbase}enable${key}`);
            label.innerHTML = self.options[key].short;
        });

        pluginversion = tribetoolsarea.appendChild(document.createElement('span'));
        pluginversion.className = 'MuiTypography-root MuiTypography-caption css-1xgnu2c';
        pluginversion.classList.add('tribetoolsversion');
        pluginversion.innerHTML = `${GM_info.script.name} versie ${GM_info.script.version} (<a href="${GM_info.script.downloadURL}" target="_blank">Check update</a>)`;

        self.observer.connect();
    };

    self.options = {
        autoclosemessages: { // 1. Geef een optie om de Tribe mededeling bovenaan het scherm voortaan altijd automatisch te sluiten
            description: 'Toon een optie om bekende mededelingen automatisch te sluiten. Via een extra (i) knop kun je de mededelingen alsnog lezen.',
            apply: self.applyInfoButton
        },
        overflowtitles: { // 2. Toon een titel (zodra de muis over de naam beweegt) bij lange namen die niet volledig in beeld passen
            description: 'Toon lange namen als titels<br>(overal waar ... achter staat wordt dan leesbaar door de muis stil te houden)',
            apply: self.applyOverflowtitles
        },
        searchtabselect: { // 3. Geef de keuze om een zoek tab altijd als eerste te tonen
            description: 'Toon optie om een favoriete zoek tab te selecteren',
            short: 'Favoriete zoek tab',
            apply: self.applySearchTab
        },
        colorstylesheet: { // 6. Geef de gebruiker de keuze om de achtergrond kleur in te stellen
            apply: self.applyColorStylesheet
        },
        opensubheaders: { // 7. Bewaar en herstel de status van opengeklapte velden lijstjes
            description: 'Bewaar en herstel de status van opengeklapte velden lijstjes',
            apply: self.applyCollapsedSubHeaders
        },
        logontips: { // 4. Zodra er een foutmelding komt bij het inloggen, geef dan het advies om cookies te verwijderen en een knop om opnieuw de Tribe app site te openen
            description: 'Toon inlog tips en een knop zodra het inloggen mislukt door cookie problemen',
            apply: self.applyLogonTips
        },
        packnamedisplay: { // 5. Toon de naam van de werkomgeving Productie of Sandbox
            description: '(admins) Toon de naam van de Tribe omgeving (productie of sandbox)',
            apply: self.applyPackName
        },
        pagetitles: { // 8. Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel
            description: 'Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel',
            apply: self.applyPageTitle
        },
        exportcheckboxes: { // 9. Bewaar en herstel de status van aangevinkte opties bij een export
            description: 'Bewaar en herstel de status van aangevinkte opties bij een export',
            apply: self.applyExportChekboxes
        },
        labeltextvertical: { // 10. Toon labels en tekst velden onder elkaar ipv naast elkaar
            description: 'Toon labels en tekst velden onder elkaar ipv naast elkaar',
            short: 'Labels en tekst onder elkaar',
            apply: self.applyLabelTextVertical
        },
        buttonorder: { // 11. Plaats de +Notitie knop als laatste knop
            description: 'Plaats de +Notitie knop als laatste knop',
            short: 'Notitie knop als laatste',
            apply: self.applyButtonOrder
        },
        mystyle: { // 12. Pas een aangepaste weergave toe (onder andere lijntjes rond de notitie kaders)
            description: 'Pas een aangepaste weergave toe (onder andere lijntjes rond de notitie kaders)',
            short: 'Aangepaste weergave',
            apply: self.applyMyStyle
        },
        scrollcenter: { // 13. Breng een geselecteerd list item in een lijst in beeld (handig bij uren en minuten)
            description: 'Breng een geselecteerd list item in een lijst in beeld (handig bij uren en minuten)',
            apply: self.applyScrollCenter
        },
        listblur: { // 14. Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)
            description: 'Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)'
        },
        advancedfields: { // 15. Herstel de stand van de checkbox voor Geavanceerd (bij velden toevoegen)
            apply: self.applyAdvancedFields
        },
        trimclipboard: { // 16. Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)
            description: 'Wis bij het zoekveld automatisch de spaties voor en achter een gekopieerde tekst (uit andere programma\'s)',
            short: 'Wis gekopieerde spaties',
            check: self.setupClipboardAccess,
            apply: self.applyTrimClipboard
        },
        combowidth: { // 17. Maak de breedte passend voor de weergave keuzelijst
            description: 'Maak de breedte passend voor de weergave keuzelijst',
            short: 'Keuzelijst breedte',
            apply: self.applyComboWidth
        },
        scrollrestore: { // 18. Herstel de scroll positie na terugkeer naar een eerder geopend scherm
            description: 'Herstel de scroll positie na terugkeer naar een eerder geopend scherm',
            short: 'Herstel scroll positie',
            apply: self.applyScrollRestore
        },
        noclickarea: { // 19. Voorkom het sluiten van een popup door naast de popup te klikken
            description: 'Voorkom het sluiten van een popup door naast de popup te klikken',
            short: 'Voorkom popup sluiten',
            apply: self.appyNoClickArea
        },
        hidenotitie: { // 20. Verberg knop Notitie toevoegen bij een Organisatie
            description: 'Verberg knop Notitie toevoegen bij een Organisatie',
            short: 'Verberg +notitie bij organisaties',
            apply: () => {
                self.applyHideNotitie();
                self.applyButtonOrder();
            }
        },
        configurationstyle: { // 21. Aangepaste (opvallende) weergave voor beheerders configuratie menu
            description: '(admins) Aangepaste (opvallende) weergave voor beheerders configuratie menu',
            apply: self.applyConfigurationStyle
        },
        hideai: { // 22. Verberg de AI button
            description: 'Verberg de AI button',
            apply: self.applyHideAI
        },
        searchresultformatting: { // 23. Toon zoek resultaat details onder elkaar
            description: 'Toon zoek resultaat details onder elkaar',
            short: 'Zoek resultaat details onder elkaar',
            apply: self.applySearchResultFormatting
        },
        restoresubmenu: { // 24. Selecteer na terugkeer het eerder geselecteerde submenu
            description: '(admins) Selecteer automatisch het laatst geselecteerde submenu in het beheer scherm',
            apply: self.applySubmenuRestore
        },
        automationscolumns: { // 25. Verplaats bij de tabel Automations de kolom Naam naar het einde
            description: '(admins) Verplaats bij de tabel Automations de kolom Naam naar het einde',
            apply: self.applyAutomationsColumns
        },
        stickyroleheaders: { // 26. Houdt bij de Rollen de kolom kop in beeld
            description: '(admins) Houdt bij de Rollen de kolom kop in beeld',
            apply: self.applyStickyroleheaders
        },
        highlightlastclickeditem: {
            apply: self.highlightLastClickedItem
        },
        hidetabs: { // 27. Verberg altijd deze lege tabs: Uren, Kilometers
            description: 'Verberg altijd deze lege tabs: Uren, Kilometers',
            short: 'Verberg lege tabs Uren, Kilometers',
            apply: self.hideTabs
        },
        searchfilters: { // 28. Toon knoppen om bepaalde zoek resultaten te verbergen
            description: 'Toon knoppen om bepaalde zoek resultaten te verbergen',
            apply: self.applyHideSearchResults
        },
        highlightusers: { // 29. (admins) Gebruikerslijst header vast zetten en kleuren en filters voor beheerders en geblokkeerde gebruikers toevoegen
            apply: self.applyHighlightUsers
        },
        smtplogging: { // 30. (admins) Toon SMTP Error logging herzend details
            apply: self.applySmtpLogging
        }
    };

    self.utils.applyChanges = () => {
        self.utils.restoreSettings(); // update de settings

        self.addTribeToolsStylesheet();

        Object.keys(self.options).forEach(key => {
            if (typeof self.options[key].apply == 'function') {
                self.options[key].apply();
            }
        });

        self.applySettings();
        self.applyPluginVersion();
    };

    self.utils.createObserver = (target,callback) => {
        if (!target || typeof callback != 'function') return;

        // Run callback when changes are detected in target:
        let observer = new MutationObserver(callback);
        observer.config = {
            subtree: true,
            childList: true,
        }

        // add extra elements:
        observer.target = target;
        observer.callback = callback;

        // keep track of connection status:
        observer.isconnected = false;
        observer.original_disconnect = observer.disconnect.bind(observer);
        observer.disconnect = () => {
            if (!observer.isconnected) return;
            observer.isconnected = false;
            observer.original_disconnect();
        }

        observer.original_observe = observer.observe.bind(observer);
        observer.observe = () => {
            if (observer.isconnected) return;
            observer.isconnected = true;
            observer.original_observe(observer.target,observer.config);
        }

        observer.stop = observer.disconnect; // create an alias
        observer.connect = observer.observe; // create an alias
        observer.start = observer.observe; // create an alias

        return observer;
    };

    self.utils.setupObserver = (target,callback) => {
        self.observer = self.utils.createObserver(target,self.utils.applyChanges);
        // run and start monitoring
        self.utils.applyChanges();
        self.observer.start();
    };

    self.utils.monitorTribeChanges = () => {
        self.setupBlur();
        self.utils.setupObserver(document.documentElement || document.body,self.utils.applyChanges);
    };

    console.log('plugin loaded: ' + GM_info.script.name + ' version ' + GM_info.script.version);

    if (typeof window.showpluginstatus == 'function') {
        window.showpluginstatus(GM_info.script.name,GM_info.script.version);
    } else {
        // verwijder oude opgeslagen data:
        localStorage.removeItem('tribeclosemessages');
        localStorage.removeItem('tribesearchhelp');

        self.utils.restoreSettings();
        self.utils.monitorTribeChanges();
    }
})();
