// ==UserScript==
// @name         Tribe CRM tools
// @namespace    https://wijzijngerrit.nl/
// @updateURL    https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/tribe/tribecrmtools.meta.js
// @downloadURL  https://github.com/WijZijnGERRIT/plugins/raw/refs/heads/tribe/tribecrmtools.user.js
// @version      2026.1.14.1
// @description  Dankzij deze plugin zijn er diverse tools om Tribe een beetje beter te maken. De instellingen en keuzes voor deze tools worden alleen opgeslagen in deze browser sessie en worden niet bewaard in Tribe.
// @author       Daniel
// @match        https://app.tribecrm.nl/*
// @match        https://auth.tribecrm.nl/login*
// @match        https://gesp.zn-man.nl/tools/plugins
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let changelog = `
Changelog:

versie 2026.1.14.1
- plugin versie geschikt gemaakt voor github van WijZijnGERRIT

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

    let defaultcolors = ["#e6fbef","#fdf3fd","#def6fe"];
    let copiedColor = undefined;
    let settings = {
        enableautoclosemessages: true,
        enableoverflowtitles: true,
        enablesearchtabselect: true,
        enablelogontips: true,
        enablepacknamedisplay: false,
        enablebackgroundcolors: true,
        enableopensubheaders: true,
        enablepagetitles: true,
        enableexportcheckboxes: true,
        bekendemededelingen: [], // Voeg nieuwe mededelingen toe, door de letterlijke tekst over te nemen naar de array
        searchtab: '',
        colors: ["#e6fbef","#fdf3fd","#def6fe"],
        colorfavorites: [["#e6fbef","#fdf3fd","#def6fe"]],
        undocolors: [],
        redocolors: [],
        opensubheaders: {},
        exportcheckboxes: []
    };
    window.settings = settings;
    let zoekmijninstellingen = false;

    function clickMySettings() {
        if (!zoekmijninstellingen) return;
        let menuitemmijninstellingen = Array.from(document.querySelectorAll("[role=menuitem]")).filter(el=>el.innerText.match(/(Mijn account|My account)/));
        if (!menuitemmijninstellingen.length) return;
        zoekmijninstellingen = false;
        menuitemmijninstellingen[0].click();
    }
    function openMySettings() {
        if (window.location.href.match(/\/user-settings/)) {
            zoekmijninstellingen = false;
            return;
        }
        let accountbutton = document.querySelector('.MuiAvatar-root'); // document.querySelector("[aria-label=Account]");
        if (!accountbutton) return;
        accountbutton.click();
        zoekmijninstellingen = true;
        setTimeout(function() {
            if (!zoekmijninstellingen) return;
            console.log(GM_info.script.name + " - Menu item Mijn account/My account niet gevonden");
            zoekmijninstellingen = false;
        },500);
        clickMySettings();
    }

    function storeSettings() {
        localStorage.setItem('tribecrmtools',JSON.stringify(settings));
    }
    function restoreSettings() {
        let data = localStorage.getItem('tribecrmtools');
        if (data) data = JSON.parse(data);
        if (!data || typeof data != 'object' || data instanceof Array) {
            if (window.location.href.match(/\/user-settings/)) {
                storeSettings();
            } else {
                openMySettings();
            }
            return;
        };
        for (let key in settings) {
            if (Object.keys(data).includes(key) && typeof settings[key] == typeof data[key]) {
                settings[key] = data[key];
            }
        }
    }

    // verwijder oude opgeslagen data:
    localStorage.removeItem('tribeclosemessages');
    localStorage.removeItem('tribesearchhelp');

    function monitorTribeChanges() {
        function applyChanges(observer) {
            restoreSettings(); // update de settings

            // 1. Geef een optie om de Tribe mededeling bovenaan het scherm voortaan altijd automatisch te sluiten
            function addInfoButton(observer) {
                if (document.querySelector('.tribetoolsinfo')) return;
                //let buttonarea = document.querySelector("[aria-label=Omgeving]")?.parentElement?.parentElement;
                let timerbutton = [...document.querySelectorAll('.MuiIconButton-root')].filter((el)=>{return el.innerText == 'timer'});
                if (!timerbutton.length) return;

                // stop monitoring
                observer?.disconnect();

                timerbutton = timerbutton[0];
                let infobutton = document.createElement('button');
                infobutton.className = timerbutton.className;
                infobutton.classList.add("tribetoolsinfo");
                let span = infobutton.appendChild(document.createElement('span'));
                span.className = timerbutton.querySelector('span').className;
                span.setAttribute('aria-hidden',"true");
                span.innerText = `info`;
                span.title = `Toon opgeslagen mededelingen`;

                let stylesheet = document.head.appendChild(document.createElement('style'));
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

                let popupmessage = document.body.appendChild(document.createElement('div'));
                popupmessage.className = 'popupmessage';
                popupmessage.innerHTML = `
<div class="popupmessage-window">
    <div class="popupmessage-titlebar"><span class="popupmessage-title"></span><span class="material-icons-outlined popupmessage-close" title="close">close</span></div>
    <div class="popupmessage-content"></div>
</div>
`;
                popupmessage.querySelector('span.popupmessage-close').addEventListener('click',function(e) {
                    popupmessage.classList.remove('tribetoolsdisplay');
                },false);

                infobutton.addEventListener('click',function(e) {
                    // console.log(GM_info.script.name + " - Klik info button");
                    popupmessage.querySelector('.popupmessage-title').innerText = 'Tribe CRM tools - Mededelingen';
                    if (!settings.bekendemededelingen.length) {
                        popupmessage.querySelector('.popupmessage-content').innerHTML = `
<p>Er zijn geen mededelingen opgeslagen die automatisch mogen worden gesloten.</p>
<p align="center"><button class="settings">Instellingen</button> <button class="closedialog">Sluiten</button></p>
`;
                    } else {
                        popupmessage.querySelector('.popupmessage-content').innerHTML = `
<p>Opgeslagen mededelingen die automatisch worden gesloten:</p>

<p>${settings.bekendemededelingen.map(el => { return el.replace(/\nSluiten/,'').replace(/\nMeer lezen/,'').replace(/\n\n+/gs,"\n").replace(/\n$/gs,"\n"); }).join("</p><p>").replace(/\n/g,"<br>\n")}
<p align="center"><button class="removeallmessages">Alles wissen</button> <button class="settings">Instellingen</button> <button class="closedialog">Sluiten</button></p>
`;
                        popupmessage.querySelector('button.removeallmessages').addEventListener('click',function(e) {
                            if (confirm(`Mededelingen zullen opnieuw getoond worden als ze nog actief zijn.\n\nAlles wissen?`)) {
                                settings.bekendemededelingen = [];
                                storeSettings();
                                popupmessage.classList.remove('tribetoolsdisplay');
                            }
                        },false);
                    }
                    popupmessage.querySelector('button.settings').addEventListener('click',function(e) {
                        popupmessage.classList.remove('tribetoolsdisplay');
                        openMySettings();
                    },false);
                    popupmessage.querySelector('button.closedialog').addEventListener('click',function(e) {
                        popupmessage.classList.remove('tribetoolsdisplay');
                    },false);
                    popupmessage.classList.add('tribetoolsdisplay');
                },false);

                timerbutton.before(infobutton);

                // restart monitoring
                observer?.connect();

                console.log(GM_info.script.name + " - Mededelingen info button toegevoegd");
            }

            function removeKnownInfo(observer) {
                let message = document.querySelector('.MuiAlert-message')?.innerText;
                let closebutton = document.querySelector('.MuiAlert-message')?.parentElement?.querySelector("[data-testid=CloseIcon]")?.closest('button');
                if (message && closebutton) {
                    if (settings.bekendemededelingen.includes(message)) {
                        // apply changes
                        console.log(GM_info.script.name + " - Auto sluit deze bekende mededeling:",message);
                        closebutton.click();
                    } else if (closebutton.closest('div') && !closebutton.closest('div').querySelector('.autoclose')) {
                        // stop monitoring
                        observer?.disconnect();

                        // voeg een checkbox toe voor permanent automatisch sluiten
                        let checkbox = closebutton.closest('div').appendChild(document.createElement('input'));
                        checkbox.type = 'checkbox';
                        checkbox.className = 'autoclose';
                        checkbox.title = 'Deze mededeling altijd automatisch sluiten';
                        closebutton.addEventListener('click',function(e) {
                            let index = settings.bekendemededelingen.indexOf(message);
                            if (checkbox.checked && index == -1) {
                                settings.bekendemededelingen.push(message);
                                storeSettings();
                                console.log(GM_info.script.name + " - Auto sluit (voortaan) deze bekende mededeling:",message);
                            } else if (checkbox.checked && index != -1) {
                                settings.bekendemededelingen.splice(index,1);
                                storeSettings();
                            }
                        });

                        // restart monitoring
                        observer?.connect();
                    }
                }
            }
            function removeKnownFooter(observer) {
                let message = document.querySelector('#pendo-base')?.innerText;
                let closebutton = document.querySelector("#pendo-base button._pendo-close-guide");
                if (message && closebutton) {
                    if (settings.bekendemededelingen.includes(message)) {
                        // apply changes
                        console.log(GM_info.script.name + " - Auto sluit deze bekende mededeling:",message);
                        closebutton.click();
                    } else if (!closebutton.nextSibling || closebutton.nextSibling.className != 'autoclose') {
                        // stop monitoring
                        observer?.disconnect();

                        // voeg een checkbox toe voor permanent automatisch sluiten
                        let checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'autoclose';
                        checkbox.title = 'Deze mededeling altijd automatisch sluiten';
                        checkbox.style.position = 'absolute';
                        checkbox.style.right = '10px';
                        closebutton.parentElement.insertBefore(checkbox, closebutton.nextSibling)

                        closebutton.addEventListener('click',function(e) {
                            let index = settings.bekendemededelingen.indexOf(message);
                            if (checkbox.checked && index == -1) {
                                settings.bekendemededelingen.push(message);
                                storeSettings();
                                console.log(GM_info.script.name + " - Auto sluit (voortaan) deze bekende mededeling:",message);
                            } else if (checkbox.checked && index != -1) {
                                settings.bekendemededelingen.splice(index,1);
                                storeSettings();
                            }
                        });

                        // restart monitoring
                        observer?.connect();
                    }
                }
            }
            function removeInfoButton(observer) {
                let buttonarea = document.querySelector("[aria-label=Omgeving],[aria-label=Environment]")?.parentElement?.parentElement;
                if (buttonarea && buttonarea.querySelector('.tribetoolsinfo')) {
                    // stop monitoring
                    observer?.disconnect();

                    buttonarea.querySelector('.tribetoolsinfo').remove();

                    // restart monitoring
                    observer?.connect();
                }
            }
            if (settings.enableautoclosemessages) {
                clickMySettings();
                addInfoButton(observer);
                removeKnownInfo(observer);
                removeKnownFooter(observer);
            } else {
                removeInfoButton(observer);
            }

            // 2. Toon een titel (zodra de muis over de naam beweegt) bij lange namen die niet volledig in beeld passen
            function applyOverflowtitles(observer) {
                let overflowtextelements = [...document.querySelectorAll('*')].filter(el => el.childElementCount === 0 && el.innerText && el.offsetWidth < el.scrollWidth && !el.title);
                if (overflowtextelements.length) {
                    // stop monitoring
                    observer?.disconnect();

                    console.log(GM_info.script.name + " - Lange teksten gevonden die een titel krijgen:",overflowtextelements.length);
                    overflowtextelements.forEach(element => {
                        element.setAttribute('title',element.innerText);
                    });

                    // restart monitoring
                    observer?.connect();
                }
            }
            function undoOverflowtitles(observer) {
                let overflowtextelements = [...document.querySelectorAll('*')].filter(el => el.childElementCount === 0 && el.innerText && el.offsetWidth < el.scrollWidth && el.title);
                if (overflowtextelements.length) {
                    // stop monitoring
                    observer?.disconnect();

                    console.log(GM_info.script.name + " - Lange teksten gevonden die geen titel meer krijgen:",overflowtextelements.length);
                    overflowtextelements.forEach(element => {
                        element.removeAttribute('title',element.innerText);
                    });

                    // restart monitoring
                    observer?.connect();
                }
            }
            if (settings.enableoverflowtitles) {
                applyOverflowtitles(observer);
            } else {
                undoOverflowtitles(observer);
            }

            // 3. Geef de keuze om een zoek tab altijd als eerste te tonen
            if (settings.enablesearchtabselect) {
                let searchinput = document.querySelector('div[data-test-id="search-bar"] input');
                let searchtablist = document.querySelector('[class*=content] .MuiBox-root [role=tablist]');
                let searchtabbuttons = document.querySelectorAll('[class*=content] .MuiBox-root [role=tablist] button');
                let searchtabbuttontarget = [...searchtabbuttons].find(button => button.innerText == settings.searchtab);
                let searchtabbuttonselected = [...searchtabbuttons].find(button => button.classList.contains('Mui-selected'));
                let searchbuttonsvisible = searchtabbuttons.length > 2 && ([...searchtabbuttons].filter(el => el.innerText.match(/Relaties|Relations|Activiteiten|Activities/)).length == 2);
                let progressbar = document.querySelector('div[data-test-id="search-bar"] [role="progressbar"]');
                let searchresultsrelations = [...document.querySelectorAll('[class*=card] [class*=header]')].filter(header => header.innerText.match(/(Klanten|Prospects|Medewerkers|Contactpersonen)/)).length >= 1;
                let searchresultsnothing = [...document.querySelectorAll('.MuiBox-root > div > strong')].find(strong => strong.innerText == searchinput.value);
                // er komen resultaten, eerst onder Relaties, dit kunnen zijn: Klanten, Prospects, Medewerkers, Contactpersonen
                // of:
                // Géén zoekresultaten gevonden voor zoekopdracht: <strong>zoektekst</strong>

                // document.querySelectorAll('[class*=SearchItemBucket_header]')

                // setup radio buttons:
                if (searchbuttonsvisible && !searchtabbuttons[0].querySelector('input[type=radio]')) {
                    // stop monitoring
                    observer?.disconnect();

                    console.log(GM_info.script.name + " - Zoektabs gevonden en radio buttons toegevoegd");
                    let firstbutton;
                    let checkedbutton;
                    searchtabbuttons.forEach((button,buttoncnt) => {
                        let radiobutton = button.appendChild(document.createElement("input"));
                        radiobutton.type = "radio";
                        radiobutton.name = "tribesearchhelpradio";
                        radiobutton.value = button.innerText;
                        radiobutton.title = `${radiobutton.value} als eerste weergeven`;
                        if (radiobutton.value == settings.searchtab) {
                            radiobutton.checked = true;
                            if (!checkedbutton) checkedbutton = radiobutton;
                        }
                        radiobutton.addEventListener('click',e => {
                            settings.searchtab = e.target.value;
                            storeSettings();
                        });
                        if (!firstbutton) firstbutton = radiobutton;
                    });
                    // activeer de eerste radiobutton als er nog geen actief is
                    if (!checkedbutton) {
                        firstbutton.checked = true;
                        settings.searchtab = firstbutton.value;
                        storeSettings();
                    }

                    // restart monitoring
                    observer?.connect();
                }

                if (searchbuttonsvisible && searchtabbuttonselected && !progressbar && !searchtablist.classList.contains('tribetoolssearchactivated') && (searchresultsnothing || searchresultsrelations)) {
                    if (searchtabbuttonselected.innerText != settings.searchtab && searchtabbuttontarget) {
                        console.log(GM_info.script.name + " - Zoektab voorkeur geselecteerd: " + settings.searchtab);

                        observer?.disconnect();
                        searchtablist.classList.add('tribetoolssearchactivated');
                        observer?.connect();

                        searchtabbuttontarget.click();
                        searchtabbuttontarget.scrollIntoView(searchtabbuttons[0],{
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center"
                        });
                    }
                }
            }

            // 4. Zodra er een foutmelding komt bij het inloggen, geef dan het advies om cookies te verwijderen en een knop om opnieuw de Tribe app site te openen
            if (settings.enablelogontips) {
                let messageobject = document.querySelector('p.MuiTypography-root');
                if (messageobject?.innerText == "Het is ons niet gelukt om je aan te melden. Je inloggegevens zijn onjuist." && !document.querySelector('.advice')) {
                    // stop monitoring
                    observer?.disconnect();

                    console.log(GM_info.script.name + " - Toon inlog hulp");
                    let messagediv = messageobject.closest('div');
                    let advicediv = messagediv.appendChild(document.createElement('div'));
                    advicediv.className = 'advice';
                    advicediv.style.textAlign = 'center';
                    advicediv.style.color = 'white';
                    advicediv.innerHTML = 'Tip: Wis de cookies voor deze site en/of <button>probeer opnieuw</button>';
                    advicediv.querySelector('button').addEventListener('click',function(e) {
                        e.preventDefault();
                        window.location.href = "https://app.tribecrm.nl";
                    },false);

                    // restart monitoring
                    observer?.connect();
                }
            }
            let logincheckbox = document.querySelector('#loginForm input[type=checkbox]');
            if (logincheckbox && !logincheckbox.checked && window.location.host == 'auth.tribecrm.nl') {
                // stop monitoring
                observer?.disconnect();

                // apply changes
                logincheckbox.click();

                // restart monitoring
                observer?.connect();
            }

            // 5. Toon de naam van de werkomgeving Productie of Sandbox
            function showPackname(observer) {
                let buttonarea = document.querySelector(".MuiStack-root.css-1uwrsdx"); // document.querySelector("[aria-label=Omgeving],[aria-label=Environment]");
                if (buttonarea && !document.querySelector('.tribetoolsomgeving')) {
                    // stop monitoring
                    observer?.disconnect();

                    //let productionavatar = [...buttonarea.querySelectorAll('.MuiAvatar-root img')].find(img => img.src == 'blob:https://app.tribecrm.nl/b8981c57-bafe-4c62-85d7-a3671ed04666');
                    let sandboxavatar = [...buttonarea.querySelectorAll('.MuiAvatar-root')].find(avatar => avatar.innerText == 'S');

                    let packname = document.createElement('div');
                    packname.className = 'tribetoolsomgeving';
                    buttonarea.after(packname);
                    if (sandboxavatar) {
                        console.log(GM_info.script.name + " - Sandbox omgeving");
                        packname.innerText = 'Sandbox';
                    } else {
                        console.log(GM_info.script.name + " - Productie omgeving");
                        packname.innerText = 'Productie';
                    }

                    // restart monitoring
                    observer?.connect();
                }
            }
            function removePackname(observer) {
                let tribetoolsomgeving = document.querySelector('.tribetoolsomgeving');
                if (tribetoolsomgeving) {
                    // stop monitoring
                    observer?.disconnect();

                    tribetoolsomgeving.remove();

                    // restart monitoring
                    observer?.connect();
                }
            }
            function showPageTitle(observer) {
                let restoretitle = document.body.getAttribute('restoretitle');
                let newtitle = document.querySelector('[data-test-id="text-my-workplace"]')?.innerText || document.querySelector('[placeholder="Geen titel"]')?.value || document.querySelector('[data-test-id="label-entity-name"]')?.innerText || restoretitle
                if (newtitle == document.title) return;

                // stop monitoring
                observer?.disconnect();

                if (newtitle && !restoretitle) {
                    document.body.setAttribute('restoretitle',document.title);
                } else if (newtitle == restoretitle) {
                    document.body.removeAttribute('restoretitle');
                }
                if (newtitle) {
                    document.title = newtitle;
                }

                // restart monitoring
                observer?.connect();
            }
            function restorePageTitle(observer) {
                let restoretitle = document.body.getAttribute('restoretitle');
                if (!restoretitle) return;
                // stop monitoring
                observer?.disconnect();
                document.title = restoretitle;
                document.body.removeAttribute('restoretitle');
                // restart monitoring
                observer?.connect();
            }

            if (settings.enablepacknamedisplay) {
                showPackname(observer);
            } else {
                removePackname(observer);
            }
            // 8. Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel
            if (settings.enablepagetitles) {
                showPageTitle(observer);
            } else {
                restorePageTitle(observer);
            }

            // 6. Geef de gebruiker de keuze om de achtergrond kleur in te stellen
            function updateColorStylesheet(observer) {
                let stylesheet = document.createElement('style');
                stylesheet.className = "tribetoolscolors";

                if (settings.enablebackgroundcolors) {
                    stylesheet.innerHTML = `
#root > div.MuiBox-root.css-0 {
    background-image: linear-gradient(235deg, ${settings.colors[0]}, ${settings.colors[1]}, ${settings.colors[2]}) !important;
}
`;
                }
                settings.colorfavorites.forEach((colors,index) => {
                    stylesheet.innerHTML += `
.tribetoolsexample${index} {
    background-image: linear-gradient(235deg, ${settings.colorfavorites[index][0]}, ${settings.colorfavorites[index][1]}, ${settings.colorfavorites[index][2]}) !important;
}
`;
                });

                let existingstylesheet = document.querySelector('style.tribetoolscolors');
                if (!existingstylesheet || existingstylesheet.innerHTML != stylesheet.innerHTML) {
                    console.log(GM_info.script.name + " - Update color stylesheet",settings.enablebackgroundcolors);

                    // pause monitoring
                    observer?.disconnect();
                    if (existingstylesheet) {
                        existingstylesheet.innerHTML = stylesheet.innerHTML;
                    } else {
                        document.head.appendChild(stylesheet);
                    }
                    // restart monitoring
                    observer?.connect();
                }
            }
            updateColorStylesheet(observer);
            // toon de mogelijke opties op het user-settings scherm:
            if (window.location.href.match(/\/user-settings/) && !document.querySelector('.tribetoolsoptions') && document.querySelector('[class*=lastRow]')) {
                function addMysettingsStylesheet(observer) {
                    let stylesheet = document.querySelector('style.tribetoolsmysettings');
                    if (stylesheet) return;

                    // stop monitoring
                    observer?.disconnect();
                    stylesheet = document.head.appendChild(document.createElement('style'));
                    stylesheet.className = 'tribetoolsmysettings';
                    stylesheet.innerHTML = `
.tribetoolsoptions label {
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
`;
                    // restart monitoring
                    observer?.connect();
                }

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
                    container.style.flexWrap = "nowrap"; // maak de regels compacter

                    let titlerow = container.appendChild(document.createElement('div'));
                    titlerow.className = div.querySelector('.MuiGrid-item').className;
                    titlerow.innerHTML = div.querySelector('.MuiGrid-item').innerHTML;
                    titlerow.querySelector('h6').innerText = 'Tribe CRM tools - instellingen';

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
                    info.innerHTML += `<p>(versie ${GM_info.script.version})</p>`;

                    lastrow.before(info);

                    return newdiv;
                }

                addMysettingsStylesheet(observer);

                // stop monitoring
                observer?.disconnect();

                let container = createContainer();
                document.querySelector('.MuiPaper-rounded').parentElement.parentElement.appendChild(container);

                function addChekboxOption(settingsname,description,callback) {
                    // neem de opmaak over van de eerste regel met instelligen:
                    let firsitemrow = document.querySelectorAll('.MuiPaper-rounded .MuiGrid-container .MuiGrid-item')[1];

                    let option = document.createElement('div');
                    option.className = firsitemrow.className;
                    option.classList.add(`tribetools${settingsname}`);
                    option.innerHTML = firsitemrow.innerHTML;
                    option.querySelectorAll('.MuiGrid-item')[0].classList.add('tribetoolscolumn1');
                    option.querySelectorAll('.MuiGrid-item')[1].classList.add('tribetoolscolumn2');
                    option.querySelector('.tribetoolscolumn1').innerHTML = `<label for="id_${settingsname}">${description}</label>`;
                    option.querySelector('.tribetoolscolumn2').innerHTML = `
<span class="MuiSwitch-root MuiSwitch-sizeMedium outercheckbox" data-component="n" data-store="n">
  <span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary PrivateSwitchBase-root">
    <input class="PrivateSwitchBase-input MuiSwitch-input" type="checkbox">
    <span class="MuiSwitch-thumb"></span>
    <span class="MuiTouchRipple-root"></span>
  </span>
  <span class="MuiSwitch-track"></span>
</span>
`;
                    let checkbox = option.querySelector('input');
                    checkbox.id = `id_${settingsname}`;
                    checkbox.name = `tribetools${settingsname}`;
                    checkbox.checked = settings[settingsname];
                    if (checkbox.checked) option.querySelector('.MuiSwitch-switchBase').classList.add('Mui-checked');
                    checkbox.addEventListener('click',function(e) {
                        // console.log(GM_info.script.name + " - Checkbox aangepast",settingsname,checkbox.checked);
                        settings[settingsname] = checkbox.checked;
                        if (checkbox.checked) {
                            option.querySelector('.MuiSwitch-switchBase').classList.add('Mui-checked');
                        } else {
                            option.querySelector('.MuiSwitch-switchBase').classList.remove('Mui-checked');
                        }
                        storeSettings();
                        if (typeof callback == 'function') {
                            callback();
                        }
                    },false);
                    container.querySelector('.tribetoolslastrow').before(option);
                    return option;
                }

                addChekboxOption('enableautoclosemessages',`Toon een optie om bekende mededelingen automatisch te sluiten. Via een extra (i) knop kun je de mededelingen alsnog lezen.`,function() {
                    if (settings.enableautoclosemessages) {
                        addInfoButton(observer);
                        removeKnownInfo(observer);
                    } else {
                        removeInfoButton(observer);
                    }
                });
                let backgroundcolorsoption = addChekboxOption('enablebackgroundcolors','Achtergrondkleur',function() {
                    // console.log('enablebackgroundcolors',settings.enablebackgroundcolors);
                    updateColorStylesheet(observer);
                });
                function updateColorpicker(parent) {
                    function storeColor(index,selectedColor) {
                        settings.colors[index] = selectedColor;
                        storeSettings();
                        updateColorStylesheet();
                    }

                    let colortable = parent.querySelector('table.colorpicker');
                    if (!colortable) {
                        colortable = parent.appendChild(document.createElement('table'));
                        colortable.className = 'colorpicker';
                    } else {
                        colortable.innerHTML = '';
                    }
                    settings.colors.forEach((color,index) => {
                        if (!(settings.undocolors[index] instanceof Array)) {
                            settings.undocolors[index] = [];
                            storeSettings();
                        }
                        if (!(settings.redocolors[index] instanceof Array)) {
                            settings.redocolors[index] = [];
                            storeSettings();
                        }

                        let row = colortable.appendChild(document.createElement('tr'));
                        row.innerHTML += `
<td colspan="3">${['rechtsboven','midden','linksonder'][index]}:</td>
`;
                        let colorrow = colortable.appendChild(document.createElement('tr'));
                        colorrow.innerHTML += `
<td><input type="color"></td><td><button class="undobutton" title="Herstel naar vorige waarde">↶ <span></span></button><button class="redobutton" title="Redo">↷ <span></span></button><button class="defaultbutton" title="Herstel naar default waarde">D</button><button class="copybutton" title="Kopieer deze waarde">C</button><button class="pastebutton" title="Plak de gekopieerde waarde">P</button></td>
`;
                        let colorpicker = colorrow.querySelector(`input[type=color]`);
                        let undobutton = colorrow.querySelector(`button.undobutton`);
                        let redobutton = colorrow.querySelector(`button.redobutton`);
                        let defaultbutton = colorrow.querySelector(`button.defaultbutton`);
                        let copybutton = colorrow.querySelector(`button.copybutton`);
                        let pastebutton = colorrow.querySelector(`button.pastebutton`);

                        function updateColorButtons() {
                            undobutton.querySelector('span').innerText = settings.undocolors[index].length;
                            redobutton.querySelector('span').innerText = settings.redocolors[index].length;

                            undobutton.disabled = settings.undocolors[index].length == 0;
                            redobutton.disabled = settings.redocolors[index].length == 0;

                            colortable.querySelectorAll('button.defaultbutton').forEach((el,index) => {
                                el.disabled = defaultcolors[index] == settings.colors[index];
                            });
                            colortable.querySelectorAll('button.pastebutton').forEach((el,index) => {
                                el.disabled = !copiedColor || copiedColor == settings.colors[index];
                            });
                            colortable.querySelectorAll('button.copybutton').forEach((el,index) => {
                                el.disabled = copiedColor == settings.colors[index];
                            });
                        }
                        updateColorButtons();

                        colorpicker.value = color;
                        colorpicker.addEventListener('input', (event) => { // kleur in dialog wordt aangepast
                            const selectedColor = event.target.value;
                            storeColor(index,selectedColor);
                            updateColorButtons();
                        },false);
                        colorpicker.addEventListener('change', (event) => { // dialog wordt gesloten
                            const selectedColor = event.target.value;
                            settings.undocolors[index].push(settings.colors[index]);
                            settings.redocolors[index] = [];
                            storeColor(index,selectedColor);
                            updateColorButtons();
                        },false);
                        undobutton.addEventListener('click', (event) => {
                            if (!settings.undocolors[index].length) return;
                            settings.redocolors[index].push(settings.colors[index]);
                            const selectedColor = settings.undocolors[index].pop();
                            colorpicker.value = selectedColor;
                            storeColor(index,selectedColor);
                            updateColorButtons();
                        },false);
                        redobutton.addEventListener('click', (event) => {
                            if (!settings.redocolors[index].length) return;
                            settings.undocolors[index].push(settings.colors[index]);
                            const selectedColor = settings.redocolors[index].pop();
                            colorpicker.value = selectedColor;
                            storeColor(index,selectedColor);
                            updateColorButtons();
                        },false);
                        defaultbutton.addEventListener('click', (event) => {
                            const selectedColor = defaultcolors[index];
                            if (settings.colors[index] == selectedColor) return;
                            settings.undocolors[index].push(settings.colors[index]);
                            settings.redocolors[index] = [];
                            colorpicker.value = selectedColor;
                            storeColor(index,selectedColor);
                            updateColorButtons();
                        },false);
                        copybutton.addEventListener('click', (event) => {
                            copiedColor = settings.colors[index];
                            updateColorButtons();
                        },false);
                        pastebutton.addEventListener('click', (event) => {
                            if (!copiedColor) return;
                            const selectedColor = copiedColor;
                            if (settings.colors[index] == selectedColor) return;
                            settings.undocolors[index].push(settings.colors[index]);
                            settings.redocolors[index] = [];
                            colorpicker.value = selectedColor;
                            storeColor(index,selectedColor);
                            updateColorButtons();
                        },false);
                    });
                    updateColorStylesheet();
                }
                function updateColorFavorites(parent) {
                    let table = parent.querySelector('table.colorfavorites');
                    if (!table) {
                        table = parent.appendChild(document.createElement('table'));
                        table.className = 'colorfavorites';
                    } else {
                        table.innerHTML = '';
                    }
                    settings.colorfavorites.forEach((colors,favindex) => {
                        let row = table.appendChild(document.createElement('tr'));
                        row.innerHTML = `
<td><div class="tribetoolsexample${favindex} selectbutton" style="width: 50px; height: 50px; display: inline-block; cursor: pointer; border: 1px solid black;"></div></td><td><button class="removebutton">Verwijder</button></td>
`;
                        let selectbutton = row.querySelector(`div.selectbutton`);
                        let removebutton = row.querySelector(`button.removebutton`);
                        let example = row.querySelector('.tribetoolsexample');
                        selectbutton.addEventListener('click', (event) => {
                            settings.colors.forEach((color,index) => {
                                if ((!settings.undocolors[index].length || settings.undocolors[index][settings.undocolors[index].length - 1] != color) && color != settings.colorfavorites[favindex][index]) settings.undocolors[index].push(color);
                                settings.redocolors[index] = [];
                            });
                            settings.colors = [...settings.colorfavorites[favindex]];
                            storeSettings();
                            updateColorpicker(parent);
                        },false);
                        removebutton.addEventListener('click', (event) => {
                            if (!confirm('Weet je zeker dat je deze favoriete kleuren combinatie wilt verwijderen?')) return;
                            settings.colorfavorites.splice(favindex, 1);
                            storeSettings();
                            updateColorFavorites(parent);
                        },false);
                    });
                }
                let backgroundcolorscolumn2 = backgroundcolorsoption.querySelector('.tribetoolscolumn2');
                let label = backgroundcolorscolumn2.appendChild(document.createElement('label'));
                label.innerHTML = 'Activeer';
                label.setAttribute('for',"id_enablebackgroundcolors");
                backgroundcolorscolumn2.appendChild(document.createElement('br'));
                backgroundcolorscolumn2.appendChild(document.createTextNode('Kleuren overgang:'));
                updateColorpicker(backgroundcolorscolumn2);
                let colorstorage = backgroundcolorscolumn2.appendChild(document.createElement('div'));
                colorstorage.innerHTML = `
<button class="eraseundohistory">Wis undo historie</button><br>
<button class="storefavorite">Bewaar als favoriete combinatie</button>
`;
                updateColorFavorites(backgroundcolorscolumn2);

                colorstorage.querySelector(`button.storefavorite`).addEventListener('click', (event) => {
                    if (settings.colorfavorites.filter((favorite) => favorite.join("\t") == settings.colors.join("\t")).length) return;
                    settings.colorfavorites.push([...settings.colors]);
                    storeSettings();
                    updateColorFavorites(backgroundcolorscolumn2);
                    updateColorStylesheet();
                },false);
                colorstorage.querySelector(`button.eraseundohistory`).addEventListener('click', (event) => {
                    if (!confirm('Weet je zeker dat je de kleuren keuze undo/redo historie wilt verwijderen?')) return;
                    settings.undocolors = settings.undocolors.map((colors) => []);
                    settings.redocolors = settings.redocolors.map((colors) => []);
                    storeSettings();
                    updateColorpicker(backgroundcolorscolumn2);
                },false);

                addChekboxOption('enableoverflowtitles',`Toon lange namen als titels<br>(overal waar ... achter staat wordt dan leesbaar)`,function() {
                    if (settings.enableoverflowtitles) {
                        applyOverflowtitles(observer);
                    } else {
                        undoOverflowtitles(observer);
                    }
                });
                addChekboxOption('enablesearchtabselect',`Toon optie om een favoriete zoek tab te selecteren`);
                addChekboxOption('enableopensubheaders',`Bewaar en herstel de status van opengeklapte velden lijstjes`);
                addChekboxOption('enablelogontips',`Toon inlog tips en een knop zodra het inloggen mislukt door cookie problemen`);
                addChekboxOption('enablepacknamedisplay',`Toon de naam van de Tribe omgeving (productie of sandbox)`,function() {
                    if (settings.enablepacknamedisplay) {
                        showPackname(observer);
                    } else {
                        removePackname(observer);
                    }
                });
                addChekboxOption('enablepagetitles',`Toon dashboard-, relatie-, contact-, ticketnaam e.d. als pagina titel`,function() {
                    if (settings.enablepagetitles) {
                        showPageTitle(observer);
                    } else {
                        restorePageTitle(observer);
                    }
                });
                addChekboxOption('enableexportcheckboxes',`Bewaar en herstel de status van aangevinkte opties bij een export`);

                // restart monitoring
                observer?.connect();
            }

            // 7. Bewaar en herstel de status van opengeklapte velden lijstjes
            function restoreCollapsedSubHeaders() {
                let subheaders = document.querySelectorAll('.tribe-header-variant-subheader');
                if (!subheaders.length) return;

                subheaders.forEach((el) => {
                    let headertext = el.querySelector('h6')?.innerText;
                    if (!headertext) return;
                    if (el.classList.contains('tribetoolssubheader')) return;
                    observer?.disconnect();
                    el.classList.add('tribetoolssubheader');
                    // add extra click event to detect open/close state
                    el.addEventListener('click',function(e) {
                        if (!el.nextSibling || el.nextSibling.classList.contains('tribe-header-variant-subheader')) { // store open state
                            settings.opensubheaders[headertext] = 1;
                            storeSettings();
                        } else if (settings.opensubheaders[headertext]) { // closed, remove open state
                            delete(settings.opensubheaders[headertext]);
                            storeSettings();
                        }
                        // console.log('subheader clicked',headertext,settings.opensubheaders[headertext]?'opened':'closed');
                    },false);
                    // console.log('subheader detected',headertext,settings.opensubheaders[headertext],settings.opensubheaders[headertext] && (!el.nextSibling || el.nextSibling.classList.contains('tribe-header-variant-subheader'))?'restore open':'keep same');
                    // apply stored open state (keep open if already open)
                    if (settings.enableopensubheaders && settings.opensubheaders[headertext] && (!el.nextSibling || el.nextSibling.classList.contains('tribe-header-variant-subheader'))) {
                        el.click();
                    }
                });
                observer?.connect();
            }
            restoreCollapsedSubHeaders();

            // 9. Bewaar en herstel de status van aangevinkte opties bij een export
            function restoreExportChekboxes() {
                let button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim().match(/^(Start export taak|Export)$/));
                if (!button) return;
                if (button.classList.contains('tribetoolsrestoreExportChekboxes')) return;
                let popup = button.closest('.MuiPaper-root');
                if (!popup) return;
                if (!popup.querySelectorAll('input').length) return;
                observer?.disconnect();
                button.classList.add('tribetoolsrestoreExportChekboxes');
                Array.from(popup.querySelectorAll('input')).forEach((input,index) => {
                    if ((input.type == 'checkbox' || input.type == 'radio') && typeof settings.exportcheckboxes[index] == 'boolean') {
                        if (settings.enableexportcheckboxes && settings.exportcheckboxes[index] && input.checked !== settings.exportcheckboxes[index]) {
                            input.click();
                        }
                    }
                });
                button.addEventListener('click',function(e) {
                    let popup = button.closest('.MuiPaper-root');
                    if (!popup) return;
                    settings.exportcheckboxes = [];
                    Array.from(popup.querySelectorAll('input')).forEach((input,index) => {
                        if (input.type == 'checkbox' || input.type == 'radio') {
                            settings.exportcheckboxes[index] = input.checked;
                        }
                    });
                    storeSettings();
                },false);
                observer?.connect();
            }
            restoreExportChekboxes();
        }

        // first run:
        applyChanges();
        // then run when changes are detected:
        const observer = new MutationObserver(() => {
            applyChanges(observer);
        });

        // add extra function:
        observer.target = document.documentElement || document.body;
        observer.config = {
            subtree: true,
            childList: true,
        }
        observer.isconnected = false;
        observer.original_disconnect = observer.disconnect.bind(observer);
        observer.disconnect = function() {
            if (!this.isconnected) return;
            this.isconnected = false;
            this.original_disconnect();
        }
        observer.connect = function() {
            if (this.isconnected) return;
            this.isconnected = true;
            this.observe(this.target,this.config);
        }
        // activate monitoring
        observer.connect();
    }

    console.log('plugin loaded: ' + GM_info.script.name + ' version ' + GM_info.script.version);

    if (typeof window.showpluginstatus == 'function') {
        window.showpluginstatus(GM_info.script.name,GM_info.script.version);
    } else {
        restoreSettings();
        monitorTribeChanges();
    }
})();
