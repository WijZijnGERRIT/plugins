// ==UserScript==
// @name         Tribe CRM tools
// @namespace    https://gesp.zn-man.nl/
// @updateURL    https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/tribe/tribecrmtools.user.js
// @downloadURL  https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/tribe/tribecrmtools.user.js
// @version      2026.5.21.1
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
    let self = window.plugin.tribetools = () => {};

    self.changelog = `
Changelog:

versie 2026.5.21.1
- achtergrondkleur ingesteld voor de Tribe CRM tools instellingen
- extra menu knop toegevoegd om de Tribe CRM tools instellingen te vinden

versie 2026.5.21.1
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
        enablehideai: false
    };
    self.background = { // pointer to settings.colors or settings.colorsssandbox
        colors: [],
        undocolors: [],
        redocolors: []
    };

    self.zoekmijninstellingen = false;
    self.observer = {};

    self.clickMySettings = () => {
        if (!self.zoekmijninstellingen) return;
        let menuitemmijninstellingen = Array.from(document.querySelectorAll("[role=menuitem]")).filter(el=>el.innerText.match(/(Mijn account|My account)/));
        if (!menuitemmijninstellingen.length) return;
        self.zoekmijninstellingen = false;
        menuitemmijninstellingen[0].click();
    };
    self.openMySettings = () => {
        if (window.location.href.match(/\/user-settings/)) {
            self.zoekmijninstellingen = false;
            return;
        }
        let accountbutton = document.querySelector('.MuiAvatar-root'); // document.querySelector("[aria-label=Account]");
        if (!accountbutton) return;
        accountbutton.click();
        self.zoekmijninstellingen = true;
        setTimeout(() => {
            if (!self.zoekmijninstellingen) return;
            console.log(GM_info.script.name + " - Menu item Mijn account/My account niet gevonden");
            self.zoekmijninstellingen = false;
        },500);
        self.clickMySettings();
    };

    self.storeSettings = () => {
        localStorage.setItem('tribecrmtools',JSON.stringify(self.settings));
    };
    self.restoreSettings = () => {
        let data = localStorage.getItem('tribecrmtools');
        if (data) data = JSON.parse(data);
        if (!data || typeof data != 'object' || data instanceof Array) {
            if (window.location.href.match(/\/user-settings/)) {
                self.storeSettings();
            } else {
                // self.openMySettings();
            }
            return;
        };
        for (let key in self.settings) {
            if (Object.keys(data).includes(key) && typeof self.settings[key] == typeof data[key]) {
                self.settings[key] = data[key];
            }
        }
    };

    self.sandboxEnvironment = () => {
        let avatars = document.querySelectorAll('.MuiStack-root.css-1uwrsdx .MuiAvatar-root');
        if (!avatars.length) return undefined;
        let sandboxavatar = [...avatars].find(avatar => avatar.innerText == 'S');
        return sandboxavatar ? true : false;
    };

    self.prepareColors = () => {
        // references to settings:
        let environment = self.sandboxEnvironment() ? 'sandbox' : '';
        self.background = {
            colors: self.settings[`colors${environment}`],
            undocolors: self.settings[`undocolors${environment}`],
            redocolors: self.settings[`redocolors${environment}`]
        };
    };

    // 1. Geef een optie om de Tribe mededeling bovenaan het scherm voortaan altijd automatisch te sluiten
    self.applyInfoButton = () => {
        function addInfoButton() {
            let popupmessage = document.querySelector('.popupmessage');
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

            let infobutton = document.querySelector('.tribetoolsinfo');
            let timerbutton = [...document.querySelectorAll('.MuiIconButton-root')].filter((el)=>{return el.innerText == 'timer'});
            if (!infobutton && timerbutton.length) {
                //let buttonarea = document.querySelector("[aria-label=Omgeving]")?.parentElement?.parentElement;
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
                                self.storeSettings();
                                popupmessage.classList.remove('tribetoolsdisplay');
                            }
                        },false);
                    }
                    popupmessage.querySelector('button.settings').addEventListener('click', e => {
                        popupmessage.classList.remove('tribetoolsdisplay');
                        self.openMySettings();
                    },false);
                    popupmessage.querySelector('button.closedialog').addEventListener('click', e => {
                        popupmessage.classList.remove('tribetoolsdisplay');
                    },false);
                    popupmessage.classList.add('tribetoolsdisplay');
                },false);

                timerbutton.before(infobutton);
                console.log(GM_info.script.name + " - Mededelingen info button toegevoegd");
            }

            let stylesheet = document.querySelector('style.tribetoolspopupmessage');
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
        }

        function removeKnownInfo() {
            let message = document.querySelector('.MuiAlert-message')?.innerText;
            let closebutton = document.querySelector('.MuiAlert-message')?.parentElement?.querySelector("[data-testid=CloseIcon]")?.closest('button');
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
                            self.storeSettings();
                            console.log(GM_info.script.name + " - Auto sluit (voortaan) deze bekende mededeling:",message);
                        } else if (checkbox.checked && index != -1) {
                            self.settings.bekendemededelingen.splice(index,1);
                            self.storeSettings();
                        }
                    });

                    // restart monitoring
                    self.observer.connect();
                }
            }
        }

        function removeKnownFooter() {
            let message = document.querySelector('#pendo-base')?.innerText;
            if (!message) return;

            let closebutton = document.querySelector("#pendo-base button._pendo-close-guide");
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
                        self.storeSettings();
                        console.log(GM_info.script.name + " - Auto sluit (voortaan) deze bekende mededeling:",message);
                    } else if (checkbox.checked && index != -1) {
                        self.settings.bekendemededelingen.splice(index,1);
                        self.storeSettings();
                    }
                });

                // restart monitoring
                self.observer.connect();
            }
        }

        function removeInfoButton() {
            let button = document.querySelector('.tribetoolsinfo');
            if (!button) return;

            self.observer.disconnect();
            button.remove();
            self.observer.connect();
        }

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
            let searchinput = document.querySelector('div[data-test-id="search-bar"] input');
            let searchtablist = document.querySelector('[class*=content] .MuiBox-root [role=tablist]');
            let searchtabbuttons = document.querySelectorAll('[class*=content] .MuiBox-root [role=tablist] button');
            let searchtabbuttontarget = [...searchtabbuttons].find(button => button.innerText == self.settings.searchtab);
            let searchtabbuttonselected = [...searchtabbuttons].find(button => button.classList.contains('Mui-selected'));
            let searchbuttonsvisible = searchtabbuttons.length > 2 && ([...searchtabbuttons].filter(el => el.innerText.match(/Relaties|Relations|Activiteiten|Activities/)).length == 2);
            let progressbar = document.querySelector('div[data-test-id="search-bar"] [role="progressbar"]');
            let searchresultsrelations = [...document.querySelectorAll('[class*=card] [class*=header]')].filter(header => header.innerText.match(/(Klanten|Prospects|Medewerkers|Contactpersonen)/)).length >= 1;
            let searchresultsnothing = [...document.querySelectorAll('.MuiBox-root > div > strong')].find(strong => strong.innerText.trim() == searchinput.value.trim());
            // er komen resultaten, eerst onder Relaties, dit kunnen zijn: Klanten, Prospects, Medewerkers, Contactpersonen
            // of:
            // Géén zoekresultaten gevonden voor zoekopdracht: <strong>zoektekst</strong>

            // document.querySelectorAll('[class*=SearchItemBucket_header]')

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
                        self.storeSettings();
                    });
                    if (!firstbutton) firstbutton = radiobutton;
                });
                // activeer de eerste radiobutton als er nog geen actief is
                if (!checkedbutton) {
                    firstbutton.checked = true;
                    self.settings.searchtab = firstbutton.value;
                    self.storeSettings();
                }

                self.observer.connect();
            }

            if (searchbuttonsvisible && searchtabbuttonselected && !progressbar && !searchtablist.classList.contains('tribetoolssearchactivated') && (searchresultsnothing || searchresultsrelations)) {
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
            let messageobject = document.querySelector('p.MuiTypography-root');
            if (messageobject?.innerText == "Het is ons niet gelukt om je aan te melden. Je inloggegevens zijn onjuist." && !document.querySelector('.advice')) {
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

        let logincheckbox = document.querySelector('#loginForm input[type=checkbox]');
        if (logincheckbox && !logincheckbox.checked && window.location.host == 'auth.tribecrm.nl') {
            self.observer.disconnect();
            // apply changes
            logincheckbox.click();
        }

        // wis de two factor invoer als daar een e-mail adres in staat
        let twofactorinput = document.querySelector('input[name=two_factor_token]:not(.tribetoolstwofactorinput)');
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
        if (typeof self.sandboxEnvironment() != 'boolean') return;

        let packname = document.querySelector('.tribetoolspackname');
        if (self.settings.enablepacknamedisplay && !packname) {
            let buttonarea = document.querySelector(".MuiStack-root.css-1uwrsdx"); // document.querySelector("[aria-label=Omgeving],[aria-label=Environment]");
            if (buttonarea) {
                // stop monitoring
                self.observer.disconnect();

                packname = document.createElement('div');
                packname.className = 'tribetoolspackname';

                if (self.sandboxEnvironment()) {
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
            self.prepareColors();
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

        let existingstylesheet = document.querySelector('style.tribetoolscolors');
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
        let subheaders = document.querySelectorAll('.tribe-header-variant-subheader');
        if (!subheaders.length) return;

        subheaders.forEach((el) => {
            let headertext = el.querySelector('h6')?.innerText;
            if (!headertext) return;
            if (el.classList.contains('tribetoolssubheader')) return;

            self.observer.disconnect();
            el.classList.add('tribetoolssubheader');
            // add extra click event to detect open/close state
            el.addEventListener('click', e => {
                if (!el.nextSibling || el.nextSibling.classList.contains('tribe-header-variant-subheader')) { // store open state
                    self.settings.opensubheaders[headertext] = 1;
                    self.storeSettings();
                } else if (self.settings.opensubheaders[headertext]) { // closed, remove open state
                    delete(self.settings.opensubheaders[headertext]);
                    self.storeSettings();
                }
                // console.log('subheader clicked',headertext,settings.opensubheaders[headertext]?'opened':'closed');
            },false);
            // console.log('subheader detected',headertext,settings.opensubheaders[headertext],settings.opensubheaders[headertext] && (!el.nextSibling || el.nextSibling.classList.contains('tribe-header-variant-subheader'))?'restore open':'keep same');
            // apply stored open state (keep open if already open)
            if (self.settings.enableopensubheaders && self.settings.opensubheaders[headertext] && (!el.nextSibling || el.nextSibling.classList.contains('tribe-header-variant-subheader'))) {
                el.click();
            }
        });
        self.observer.connect();
    };

    // 8. Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel
    self.applyPageTitle = () => {
        let restoretitle = document.body.getAttribute('restoretitle');
        if (self.settings.enablepagetitles) {
            let asset = document.querySelector('.MuiStack-root.textContent p');
            if (asset?.innerText == 'Asset') {
                while (asset && !asset.querySelector('.MuiBox-root.css-0')) {
                    asset = asset.parentElement;
                }
            }
            let newtitle = document.querySelector('[placeholder="Geen titel"]')?.value || document.querySelector('[data-test-id="label-entity-name"]')?.innerText.replace(/\u200B/,'') || document.querySelector('[data-test-id="text-my-workplace"]')?.innerText.replace(/\u200B/,'') || asset?.querySelector('.MuiBox-root.css-0')?.innerText.replace(/\u200B/,'') || document.querySelector('.MuiCard-root h6')?.innerText.replace(/\u200B/,'') || restoretitle;
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
        let exportbutton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim().match(/^(Start export taak|Export)$/));
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
            self.storeSettings();
        },false);
        self.observer.connect();
    };

    // 10. Toon labels en tekst velden onder elkaar ipv naast elkaar
    self.applyLabelTextVertical = () => {
        // .root-UtSA0c.labelLeft-LtqMCq display: flex
        let stylesheet = document.querySelector('style.tribetoolsformatvertical');
        if (self.settings.enablelabeltextvertical && !stylesheet) {
            self.observer.disconnect();
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.type = "text/css";
            stylesheet.className = 'tribetoolsformatvertical';
            stylesheet.innerHTML = `
[class*='section']:first-child [class*='root'][class*='labelLeft']:not(:has(input[type=checkbox])) {
    display: block;
}
[class*='section']:first-child [class*='root'][class*='labelLeft']:has(input[type=checkbox]) {
    display: grid;
    grid-template-columns: 55px 1fr;
}
[class*='section']:first-child [class*='root'][class*='labelLeft']:has(input[type=checkbox]) [class*='labelContainer-'] {
    order: 2;
}
[class*='section']:first-child [class*='root'][class*='labelLeft']:has(input[type=checkbox]) [class*='viewContainer-'] {
    order: 1;
}
`;
        } else if (!self.settings.enablelabeltextvertical && stylesheet) {
            self.observer.disconnect();
            stylesheet.remove();
        }

        let sectionheader = document.querySelector("[class*='section']:first-child h6")?.parentElement;
        if (sectionheader && !sectionheader.querySelector('.tribeverticalcheckbox')) {
            if (document.querySelector("[class*='section']:first-child [class*='root'][class*='labelLeft']:has(input[type=checkbox]) [class*='labelContainer-']")) {
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
                self.observer.disconnect();
                sectionheader.appendChild(div);

                div.title = 'Toon de labels en tekstvelden onder elkaar';
                div.addEventListener('click',e => {
                    e.stopPropagation();
                },false);
            }
        }

        self.observer.connect();
    };

    self.updateCheckboxes = () => {
        document.querySelectorAll('input[type=checkbox][name^=tribetools]').forEach(checkbox => {
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

    self.addCheckbox = (settingsname,clickevent,idbase = 'id_') => {
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
        checkbox.checked = self.settings[settingsname];
        if (checkbox.checked) checkboxarea.querySelector('.MuiSwitch-switchBase').classList.add('Mui-checked');
        checkbox.addEventListener('click',e => {
            e.stopPropagation();
            self.settings[settingsname] = e.target.checked;
            self.storeSettings();
            // sync same named checkboxes, value and visual
            document.querySelectorAll(`input[type=checkbox][name=tribetools${settingsname}]`).forEach(othercheckbox => {
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
        let stylesheet = document.querySelector('style.tribetoolsmysettings');
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
    background-color: rgb(251, 21, 118);
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
`;
        self.observer.disconnect();
        document.head.appendChild(stylesheet);
        self.observer.connect();
    };

    self.applySettings = () => {
        // toon de mogelijke opties op het user-settings scherm:

        if (!window.location.href.match(/\/user-settings/)) return; // wrong page
        if (document.querySelector('.tribetoolsoptions')) return; // already added
        if (!document.querySelector('[class*=lastRow]')) return; // required element not ready

        function createContainer() {
            let div = document.querySelector('.MuiPaper-rounded')?.parentElement;
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
            info.innerHTML += `<p><a href="https://github.com/WijZijnGERRIT/plugins/tree/tribe" target="_blank">Controleer zelf op updates</a>: <span class="tribetoolsversion">${GM_info.script.name} versie ${GM_info.script.version}</span></p>`;

            lastrow.before(info);

            return newdiv;
        }

        function addChekboxOption(settingsname,description,callback) {
            let idbase = 'id_';
            // neem de opmaak over van de eerste regel met instelligen:
            let firsitemrow = document.querySelectorAll('.MuiPaper-rounded .MuiGrid-container .MuiGrid-item')[1];

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

            return document.querySelector('.tribetoolsoptionscontainter').appendChild(option);
        }

        function updateColorpickerTable() {
            function storeColor(index,selectedColor) {
                self.background.colors[index] = selectedColor;
                self.storeSettings();
                self.applyColorStylesheet();
            }

            // colorpicker
            //  undobutton
            //  redobutton
            //  defaultbutton
            //  copybutton
            //  pastebutton

            function updateColorButtons(index,undobutton,redobutton) {
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
            }

            let colorpickertable = document.querySelector('table.tribetoolscolorpicker');
            if (!colorpickertable) return;
            [...colorpickertable.rows].reverse().forEach(row => row.remove()); // remove all table rows

            self.prepareColors();
            self.background.colors.forEach((color,index) => {
                if (!(self.background.undocolors[index] instanceof Array)) {
                    self.background.undocolors[index] = [];
                    self.storeSettings();
                }
                if (!(self.background.redocolors[index] instanceof Array)) {
                    self.background.redocolors[index] = [];
                    self.storeSettings();
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
        }

        function updateColorFavorites(parent) {
            let table = parent.querySelector('table.colorfavorites');
            if (!table) {
                table = parent.appendChild(document.createElement('table'));
                table.className = 'colorfavorites';
            } else {
                table.innerHTML = '';
            }

            self.prepareColors();
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
                    self.storeSettings();
                    updateColorpickerTable();
                },false);
                removebutton.addEventListener('click', (event) => {
                    if (!confirm('Weet je zeker dat je deze favoriete kleuren combinatie wilt verwijderen?')) return;
                    self.settings.colorfavorites.splice(favindex, 1);
                    self.storeSettings();
                    updateColorFavorites(parent);
                },false);
            });
        }

        // stop monitoring
        self.observer.disconnect();
        document.querySelector('.MuiPaper-rounded').parentElement.parentElement.appendChild(createContainer());

        addChekboxOption('enableautoclosemessages',`Toon een optie om bekende mededelingen automatisch te sluiten. Via een extra (i) knop kun je de mededelingen alsnog lezen.`, self.applyInfoButton);

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

        self.prepareColors();
        updateColorpickerTable();
        updateColorFavorites(backgroundcolorscolumn2);

        colorstorage.querySelector(`button.storefavorite`).addEventListener('click', (event) => {
            if (self.settings.colorfavorites.filter((favorite) => favorite.join("\t") == self.background.colors.join("\t")).length) return;
            self.settings.colorfavorites.push([...self.background.colors]);
            self.storeSettings();
            updateColorFavorites(backgroundcolorscolumn2);
            self.applyColorStylesheet();
        },false);
        colorstorage.querySelector(`button.eraseundohistory`).addEventListener('click', (event) => {
            if (!confirm('Weet je zeker dat je de kleuren keuze undo/redo historie wilt verwijderen?')) return;
            self.background.undocolors.forEach(colors => { colors.length = 0; });
            self.background.redocolors.forEach(colors => { colors.length = 0; });
            self.storeSettings();
            updateColorpickerTable();
        },false);

        addChekboxOption('enableoverflowtitles',`Toon lange namen als titels<br>(overal waar ... achter staat wordt dan leesbaar)`, self.applyOverflowtitles);
        addChekboxOption('enablesearchtabselect',`Toon optie om een favoriete zoek tab te selecteren`);
        addChekboxOption('enableopensubheaders',`Bewaar en herstel de status van opengeklapte velden lijstjes`);
        addChekboxOption('enablelogontips',`Toon inlog tips en een knop zodra het inloggen mislukt door cookie problemen`);
        addChekboxOption('enablepacknamedisplay',`Toon de naam van de Tribe omgeving (productie of sandbox)`, self.applyPackName);
        addChekboxOption('enablepagetitles',`Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel`, self.applyPageTitle);
        addChekboxOption('enableexportcheckboxes',`Bewaar en herstel de status van aangevinkte opties bij een export`);

        // 10. Toon labels en tekst velden onder elkaar ipv naast elkaar
        addChekboxOption('enablelabeltextvertical',`Toon labels en tekst velden onder elkaar ipv naast elkaar`,self.applyLabelTextVertical);

        // 11. Plaats de +Notitie knop als laatste knop
        addChekboxOption('enablebuttonorder',`Plaats de +Notitie knop als laatste knop`,self.applyButtonOrder);

        // 12. Pas een aangepaste weergave toe (onder andere lijntjes rond de notitie kaders)
        addChekboxOption('enablemystyle',`Pas een aangepaste weergave toe (onder andere lijntjes rond de notitie kaders)`,self.applyMyStyle);

        // 13. Breng een geselecteerd list item in een lijst in beeld (handig bij uren en minuten)
        addChekboxOption('enablescrollcenter',`Breng een geselecteerd list item in een lijst in beeld (handig bij uren en minuten)`);

        // 14. Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)
        addChekboxOption('enablelistblur',`Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)`);

        // 16. Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)
        addChekboxOption('enabletrimclipboard',`Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)`,self.setupClipboardAccess);

        // 17. Maak de breedte passend voor de weergave keuzelijst
        addChekboxOption('enablecombowidth',`Maak de breedte passend voor de weergave keuzelijst`,self.applyComboWidth);
        // 18. Herstel de scroll positie na terugkeer naar een eerder geopend scherm
        addChekboxOption('enablescrollrestore',`Herstel de scroll positie na terugkeer naar een eerder geopend scherm`);
        // 19. Voorkom het sluiten van een popup door naast de popup te klikken
        addChekboxOption('enablenoclickarea',`Voorkom het sluiten van een popup door naast de popup te klikken`,self.appyNoClickArea);

        // 20. Verberg knop Notitie toevoegen bij een Organisatie
        addChekboxOption('enablehidenotitie',`Verberg knop Notitie toevoegen bij een Organisatie`,() => {
            self.applyHideNotitie();
            self.applyButtonOrder();
        });

        // 21. Aangepaste (opvallende) weergave voor beheerders configuratie menu
        addChekboxOption('enableconfigurationstyle',`Aangepaste (opvallende) weergave voor beheerders configuratie menu`);
        // 22. Verberg de AI button
        addChekboxOption('enablehideai',`Verberg de AI button`,self.applyHideAI);

        // restart monitoring
        self.observer.connect();
    };

    self.applyPluginVersion = () => {
        let menuitems = document.querySelectorAll('ul[role=menu]');
        if (menuitems.length < 3) return;
        let menu = menuitems[1].closest('.MuiStack-root'); // document.querySelector('.MuiStack-root.css-y9h912');
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
            settingsbutton.querySelector('p').innerText = 'Bekijk alle Tribe CRM Tools instellingen';
            settingsbutton.addEventListener('click',e => {
                e.stopPropagation();
                accountbutton.click();
            });
        }

        let idbase = 'idmenu_';
        Object.entries({
            enablesearchtabselect: 'Favoriete zoek tab',
            enablelabeltextvertical: 'Labels en tekst onder elkaar',
            enablebuttonorder: 'Notitie knop als laatste',
            enablemystyle: 'Aangepaste weergave',
            enabletrimclipboard: 'Wis gekopieerde spaties',
            enablecombowidth: 'Keuzelijst breedte',
            enablescrollrestore: 'Herstel scroll positie',
            enablenoclickarea: 'Voorkom popup sluiten',
            enablehidenotitie: 'Verberg +notitie bij organisaties'
        }).forEach(([setting,text]) => {
            let menuoption = tribetoolsarea.appendChild(document.createElement('span'));
            menuoption.appendChild(self.addCheckbox(setting,e =>{
                switch(setting) {
                    case 'enablesearchtabselect':
                        break;
                    case 'enablelabeltextvertical':
                        self.applyLabelTextVertical();
                        break;
                    case 'enablebuttonorder':
                        self.applyButtonOrder();
                        break;
                    case 'enablemystyle':
                        self.applyMyStyle();
                        break;
                    case 'enabletrimclipboard':
                        self.setupClipboardAccess();
                        break;
                    case 'enablecombowidth':
                        self.applyComboWidth();
                        break;
                    case 'enablenoclickarea':
                        self.applyNoClickArea();
                        break;
                    case 'enablehidenotitie':
                        self.applyHideNotitie();
                        self.applyButtonOrder();
                        break;
                }
            },idbase));
            let label = menuoption.appendChild(document.createElement('label'));
            label.setAttribute('for',`${idbase}${setting}`);
            label.innerHTML = text;
        });

        pluginversion = tribetoolsarea.appendChild(document.createElement('span'));
        pluginversion.className = 'MuiTypography-root MuiTypography-caption css-1xgnu2c';
        pluginversion.classList.add('tribetoolsversion');
        pluginversion.innerHTML = `<a href="https://github.com/WijZijnGERRIT/plugins/tree/tribe" target="_blank">${GM_info.script.name} versie ${GM_info.script.version}</a>`;

        self.observer.connect();
    };

    // 11. Plaats de +Notitie knop als laatste knop
    self.applyButtonOrder = () => {
        let stylesheet = document.querySelector('style.tribetoolsbuttonorder');
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

        if (self.settings.enablebuttonorder && !self.notitiehidden() && !document.querySelector('div.tribetoolsbuttonorder')) {
            document.querySelectorAll('.MuiTabs-scroller').forEach(buttonarea => {
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
        } else if ((!self.settings.enablebuttonorder || self.notitiehidden()) && document.querySelector('div.tribetoolsbuttonorder [tribetoolsindex]')) {
            let buttonarea = document.querySelector('div.tribetoolsbuttonorder');
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
        let stylesheet = document.querySelector('style.tribetoolsmystyle');
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
        document.querySelectorAll('li.Mui-selected').forEach(selected => {
            let list = selected.closest('[class^=root-]');
            if (!list || list.classList.contains('tribetoolsscroll') || !selected.innerText) return;
            self.observer.disconnect();
            list.classList.add('tribetoolsscroll');
            selected.scrollIntoView({behavior: "smooth", block: "center"})
        });
        self.observer.connect();
    };

    // 15. Herstel de stand van de checkbox voor Geavanceerd (bij velden toevoegen)
    self.applyAdvancedFields = () => {
        let advancedswitch = document.querySelector('p:has(span[data-test-label="Generic.Advanced"])')?.previousSibling?.querySelector('input[type=checkbox]:not(.tribetoolsadvanced)');
        if (!advancedswitch) return;
        self.observer.disconnect();
        advancedswitch.classList.add('tribetoolsadvanced');
        if (!advancedswitch.checked && self.settings.advancedswitchchecked) {
            advancedswitch.click();
        }
        advancedswitch.addEventListener('click', e => {
            self.settings.advancedswitchchecked = advancedswitch.checked;
            self.storeSettings();
        },false);
        self.observer.connect();
    };

    // 17. Maak de breedte passend voor de weergave keuzelijst
    self.applyComboWidth = () => {
        let stylesheet = document.querySelector('style.tribetoolscombowidth');
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
            self.storeSettings();
        }

        if (!self.settings.enablescrollrestore) return;

        let scrollarea = document.querySelector('.MuiBox-root.css-1jt5h62');
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
                self.storeSettings();
            },false);
        }
        self.observer.connect();
    };

    // 19. Voorkom het sluiten van een popup door naast de popup te klikken
    self.applyNoClickArea = () => {
        let stylesheet = document.querySelector('style.tribetoolsnoclickarea');
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
            //let popup = document.querySelector('[role=presentation].MuiDialog-root:has(.MuiDialog-container:has([role=dialog]):not(.tribetoolsnoclickarea))');
            //let popup = document.querySelector('[role=presentation].MuiDialog-root .MuiDialog-container:has([role=dialog]):not(.tribetoolsnoclickarea)');
            let popup = document.querySelector('[role=presentation].MuiDialog-root:has(.MuiDialog-container)');
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
        return document.querySelector('button.tribetoolshidenotitie');
    };
    self.applyHideNotitie = () => {
        let stylesheet = document.querySelector('style.tribetoolshidenotitie');
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

        let relationshipbutton = document.querySelector('[data-test-id="label-entity-type"][data-test-label^="Relationship.Organization."]');
// Relationship.Organization.CommercialRelationship.Prospect > Prospect
// Relationship.Organization.CommercialRelationship.Customer > Klant
// Relationship.Organization.Identity > GERRIT
// Activity.SupportTicket > Support Ticket
// 1cdcf8e0-e5a1-4d12-939e-f4b9ac00cf98 > Wijziging
        if (self.settings.enablehidenotitie && !self.notitiehidden() && relationshipbutton) {
            document.querySelectorAll('.MuiTabs-scroller').forEach(buttonarea => {
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
        let stylesheet = document.querySelector('style.tribetoolsconfiguration');
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

        let configelement = document.querySelector('.MuiBox-root.tribetoolsconfiguration');
        if (configelement && !self.settings.enableconfigurationstyle) {
            self.observer.disconnect();
            configelement.classList.remove('tribetoolsconfiguration');
        } else if (!configelement && self.settings.enableconfigurationstyle) {
            configelement = document.querySelector('[data-test-label="Generic.Configuration"]');
            while (configelement && configelement.parentElement.classList.contains('MuiBox-root')) configelement = configelement.parentElement;
            if (configelement && !configelement.querySelector('header') && configelement.classList.contains('MuiBox-root')) {
                self.observer.disconnect();
                configelement.classList.add('tribetoolsconfiguration');
            }
        }
        self.observer.connect();
    };

    // 22. Verberg de AI button
    self.applyHideAI = () => {
        let aibutton = document.body.querySelector('button.tribe-ai-button');
        if (!aibutton) return;

        let stylesheet = document.querySelector('style.tribetoolshideai');
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

    self.applyChanges = () => {
        self.restoreSettings(); // update de settings

        self.addTribeToolsStylesheet();

        // 1. Geef een optie om de Tribe mededeling bovenaan het scherm voortaan altijd automatisch te sluiten
        self.applyInfoButton();
        // 2. Toon een titel (zodra de muis over de naam beweegt) bij lange namen die niet volledig in beeld passen
        self.applyOverflowtitles();
        // 3. Geef de keuze om een zoek tab altijd als eerste te tonen
        self.applySearchTab();
        // 4. Zodra er een foutmelding komt bij het inloggen, geef dan het advies om cookies te verwijderen en een knop om opnieuw de Tribe app site te openen
        self.applyLogonTips();
        // 5. Toon de naam van de werkomgeving Productie of Sandbox
        self.applyPackName();
        // 6. Geef de gebruiker de keuze om de achtergrond kleur in te stellen
        self.applyColorStylesheet();
        // 7. Bewaar en herstel de status van opengeklapte velden lijstjes
        self.applyCollapsedSubHeaders();
        // 8. Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel
        self.applyPageTitle();
        // 9. Bewaar en herstel de status van aangevinkte opties bij een export
        self.applyExportChekboxes();
        // 10. Toon labels en tekst velden onder elkaar ipv naast elkaar
        self.applyLabelTextVertical();
        // 11. Plaats de +Notitie knop als laatste knop
        self.applyButtonOrder();
        // 12. Pas een aangepaste weergave toe (lijntjes rond de notitie kaders)
        self.applyMyStyle();
        // 13. Breng een geselecteerd item in een lijst in beeld (handig bij uren en minuten)
        self.applyScrollCenter();

        // 15. Herstel de stand van de checkbox voor Geavanceerd (bij velden toevoegen)
        self.applyAdvancedFields();

        // 17. Maak de breedte passend voor de weergave keuzelijst
        self.applyComboWidth();
        // 18. Herstel de scroll positie na terugkeer naar een eerder geopend scherm
        self.applyScrollRestore();

        // 19. Voorkom het sluiten van een popup door naast de popup te klikken
        self.applyNoClickArea();
        // 20. Verberg knop Notitie toevoegen bij een Organisatie
        self.applyHideNotitie();
        // 21. Aangepaste (opvallende) weergave voor beheerders configuratie menu
        self.applyConfigurationStyle();
        // 22. Verberg de AI button
        self.applyHideAI();

        self.applySettings();
        self.applyPluginVersion();
    };

    self.setupBlur = () => {
        window.addEventListener('blur', () => {
            // 14. Wis de focus van het actieve list element (om automatisch uitklappen te voorkomen)
            if (self.settings.enablelistblur) {
                if (document.activeElement?.getAttribute('aria-autocomplete') == 'list') {
                    console.log(`${GM_info.script.name} - Wis de focus van het actieve list element (om uitklappen te voorkomen)`); // ,document.activeElement);
                    document.activeElement.blur();
                }
            }
        },false);
    };

    self.setupClipboardAccess = () => {
        if (!self.settings.enabletrimclipboard) return;

        let disableClipboardAccess = () => {
            self.settings.enabletrimclipboard = false;
            self.storeSettings();
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

    self.setupFocus = () => {
        window.addEventListener('focus', async () => {
            // 16. Wis automatisch de spaties voor en achter een gekopieerde platte tekst (uit andere programma's)
            if (self.settings.enabletrimclipboard) {
                try {
                    let items = await navigator.clipboard.read();
                    console.log("read clipboard",items.length);
                    for (const item of items) {
                        if (item.types.includes("text/html")) {
                            console.log("skip clipboard rich-text");
                            // doe niks met rich-text
                            const blob = await item.getType("text/html");
                            const blobText = await blob.text();
                            // console.log(blob);
                            // console.log(blobText);
                        } else {
                            console.log("read clipboard",item);
                            // check clipboard, trim spaces
                            navigator.clipboard.readText().then((text) => {
                                if (text.trim() != text) {
                                    navigator.clipboard.writeText(text.trim()).then(() => {
                                        console.log(`${GM_info.script.name} - Spaties gewist voor en achter de gekopieerde platte tekst`);
                                    }).catch(e => {
                                        console.log(`${GM_info.script.name} - Schrijf toegang tot het clipboard is mislukt`,e.toString());
                                        // self.settings.enabletrimclipboard = false;
                                        // self.storeSettings();
                                    });
                                };
                            }).catch(e => {
                                console.log(`${GM_info.script.name} - Lees toegang (readText) van het clipboard is mislukt`,e.toString());
                                // self.settings.enabletrimclipboard = false;
                                // self.storeSettings();
                            });
                        }
                    }
                } catch(e) {
                    console.log(`${GM_info.script.name} - Lees toegang (read) van het clipboard is mislukt`,e.toString());
                }
            }
        },false);
    };

    self.createObserver = (target,callback) => {
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

    self.setupObserver = (target,callback) => {
        self.observer = self.createObserver(target,self.applyChanges);
        // run and start monitoring
        self.applyChanges();
        self.observer.start();
    };

    self.monitorTribeChanges = () => {
        self.setupBlur();
        self.setupFocus();
        self.setupObserver(document.documentElement || document.body,self.applyChanges);
    };

    console.log('plugin loaded: ' + GM_info.script.name + ' version ' + GM_info.script.version);

    if (typeof window.showpluginstatus == 'function') {
        window.showpluginstatus(GM_info.script.name,GM_info.script.version);
    } else {
        // verwijder oude opgeslagen data:
        localStorage.removeItem('tribeclosemessages');
        localStorage.removeItem('tribesearchhelp');

        self.restoreSettings();
        self.monitorTribeChanges();
    }
})();
