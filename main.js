let css = "default"

function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function loadCssFile(fileName) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = fileName;
    link.media = 'all';
    head.appendChild(link);
}

function randomQuestion() {
    var Messenger = function (el, category) {
        'use strict';
        var m = this;

        m.init = function () {
            var maxRandom = category === 0 ? people.length : questions.length;
            m.codeletters = "&#*+%?£@§$";
            m.message = Math.floor(Math.random() * maxRandom);
            m.current_length = 0;
            m.fadeBuffer = false;
            m.messages = category === 0
                ? people
                : questions;

            console.log(m.messages);
            setTimeout(m.animateIn, 100);
        };

        m.generateRandomString = function (length) {
            var random_text = '';
            while (random_text.length < length) {
                random_text += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
            }

            return random_text;
        };

        m.animateIn = function () {
            if (m.current_length < m.messages[m.message].length) {
                m.current_length = m.current_length + 2;
                if (m.current_length > m.messages[m.message].length) {
                    m.current_length = m.messages[m.message].length;
                }

                var message = m.generateRandomString(m.current_length);
                el.innerHTML = message;

                setTimeout(m.animateIn, 20);
            } else {
                setTimeout(m.animateFadeBuffer, 20);
            }
        };

        m.animateFadeBuffer = function () {
            if (m.fadeBuffer === false) {
                m.fadeBuffer = [];
                for (var i = 0; i < m.messages[m.message].length; i++) {
                    m.fadeBuffer.push({ c: (Math.floor(Math.random() * 12)) + 1, l: m.messages[m.message].charAt(i) });
                }
            }

            var do_cycles = false;
            var message = '';

            for (var i = 0; i < m.fadeBuffer.length; i++) {
                var fader = m.fadeBuffer[i];
                if (fader.c > 0) {
                    do_cycles = true;
                    fader.c--;
                    message += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
                } else {
                    message += fader.l;
                }
            }

            el.innerHTML = message;

            if (do_cycles === true) {
                setTimeout(m.animateFadeBuffer, 50);
            }
        };

        m.init();
    }

    new Messenger(document.getElementById('messenger-name'), 0);
    new Messenger(document.getElementById('messenger-question'), 1);
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let team;
if (urlParams.has('team')) {
    team = urlParams.get('team')
    if (doesFileExist(`style/${team}.css`)) {
        loadCssFile(`style/${team}.css`)
    } else {
        loadCssFile(`style/default.css`)
    }
} else {
    loadCssFile(`style/default.css`)
}

let peopleScript = document.createElement('script');

if (team && doesFileExist(`people/${team}.js`)) {
    peopleScript.src = `people/${team}.js`;
} else {
    peopleScript.src = "people/default.js";
}

let questions
peopleScript.onload = function () {

    questions = professionalQuestions.concat(personalQuestions) 

    if(team && doesFileExist(`question/${team}.js`) ){
        let teamScript = document.createElement('script');
        teamScript.src = `question/${team}.js`;
    
        teamScript.onload = function () {
            questions = questions.concat(teamQuestions) 
            randomQuestion()
        }
        document.head.appendChild(teamScript);
    
    } else {
        randomQuestion()
    }
}

document.head.appendChild(peopleScript);
