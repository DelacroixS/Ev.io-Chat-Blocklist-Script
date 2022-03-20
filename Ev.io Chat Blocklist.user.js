// ==UserScript==
// @name         Ev.io Chat Blocklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a chat block list to ev.io
// @author       DelacroixS
// @match        https://ev.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ev.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
var styles = `
    .from_div {
        display: none;
    }
    #block_list_container {
        z-index: 99999;
    position: fixed;
    left: 50%;
    top: 146px;
    /* margin-top: -199px; */
    margin-left: -200px;
    /* background-color: rgb(0 0 0 / 30%); */
    width: 400px;
    min-height: 200px;
    max-height: 50%;
    height: 400px;
    font-size: 14px;
    word-break: break-word;
    display: flex;
    flex-direction: column;
    }
    #block_list_wrapper {
        height: 100%;
    }
    #close_blocklist {
        float: right;
        color: white;
    }
    #block_list_list {
        position: relative;
        background-color: rgb(0 0 0 / 80%);
        height: 100%;
        overflow: scroll;
    }
    #block_list_users {
        padding: 20px 20px;
    }
    .blocked_user {
        color: white;
        display: block;
        margin: 0 0 10px;
    }
    .unblock_user {
        display: inline-block;
        margin-left: 10px;cursor: pointer;
    }
    .chat_tab_alt {
        padding-right: 12px;
    background-color: rgb(0 0 0 / 40%);
    padding-left: 12px;
    padding-top: 5px;
    padding-bottom: 2px;
    /* display: inline-block; */
    font-size: 14px;
    cursor: pointer;
    position: relative;
    color: #959595;
    cursor: pointer;
    }
    .chat_tab_alt.selected {
        color: #efef52 !important;
        background-color: rgb(0 0 0 / 70%);
    }
}
`

var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document
    .head
    .appendChild(styleSheet)


//

var block_list_container = document.createElement("div");
block_list_container.id = 'block_list_container';
block_list_container.style.display = 'none';

var block_list_wrapper = document.createElement("div");
block_list_wrapper.id = 'block_list_container';

var chat_tab = document.createElement("div");
chat_tab.classList.add('chat_tab', 'selected');

var chat_tab_title = document.createElement("span");
chat_tab.innerText = 'Blocked Users';

var close_blocklist = document.createElement("a");
close_blocklist.id = 'close_blocklist';
close_blocklist.innerText = 'X';

var block_list_list = document.createElement("div");
block_list_list.id = 'block_list_list';

var block_list_users = document.createElement('ul');
block_list_users.id = 'block_list_users';

var blocked_user_list_item = document.createElement("li");
blocked_user_list_item.classList.add('blocked_user');

var block_user_list_item_name = document.createElement('span');

var block_user_list_item_unblock = document.createElement("a");
block_user_list_item_unblock.classList.add('unblock_user');
close_blocklist.innerText = 'Unblock';

var blocklist_toggle = document.createElement('a');
blocklist_toggle.style.cssText = 'float: right;';
blocklist_toggle.innerText = 'Blocklist';

var new_blocked_user = document.createElement('li');
new_blocked_user.classList.add('blocked_user')
new_blocked_user.innerHTML = '<span></span><a class="unblock_user">Unblock</a>'

function addBlocklist() {
    insertAfter(block_list_container, document.querySelectorAll('#canvas')[0]);

    document.querySelectorAll('#chat_wrapper .chat_tab')[0].innerHTML = '<span>GAME</span><a style="float: right;">Blocklist</a>'

    document.getElementById('block_list_container').innerHTML = '<div id="block_list_wrapper"><div class="chat_tab_alt selected"><span>Blocked Users</span><a id="close_blocklist">X</a></div><div id="block_list_list"><div style="padding: 20px 20px;"><form id="block_user_form" style="margin-bottom: 8px"><input type="text" style="background: rgba(255,255,255,0.2);border: none;color: white;"><input value="Block user" style="background: none; color:yellow; text-decoration:underline; border:none;" type="submit"></form><div><input id="mute_guests" type="checkbox" style="background: rgba;"><label style="color: white;margin-left: 10px;">Mute all Guests</label></div></div><ul id="block_list_users"></ul></div></div>';
}

addBlocklist();


//
let blackList = [];

if (localStorage.getItem('blockList') === null) {
    localStorage.blockList =JSON.stringify(blackList);
} else {
    blackList = JSON.parse(localStorage.getItem('blockList'));
}


blackList.forEach(item => {

    let current_blocked_user = new_blocked_user.cloneNode(true);

    current_blocked_user.innerHTML = '<span>' + item + '</span><a class="unblock_user">Unblock</a>'
    document.querySelectorAll('#block_list_users')[0].append(current_blocked_user);

    current_blocked_user.querySelectorAll('a')[0].onclick = function() {
        blackList = blackList.filter(e => e !== item); // will return ['A', 'C'];

        console.log(blackList);

        localStorage.blockList = JSON.stringify(blackList);

        console.log('1');

        this.parentNode.remove();

        console.log('2');

        document.querySelectorAll('.from_message').forEach(x => {
            console.log(x);
            console.log(x.innerText);

            if (x.innerText === item || x.innerText === item + ': ') {
                x.parentNode.style.display = 'block';
            }

        })





    }

});
let regexGuest = /Guest.*/gm;

if (localStorage.areGuestsBlocked === null) {
    localStorage.areGuestsBlocked = 'false';
} else if (localStorage.areGuestsBlocked === 'true') {
    document.getElementById('mute_guests').checked = true;
}

var blockButton = document.createElement("a");
blockButton.style.cssText = "display: inline;padding: 2px 2px;cursor: pointer;margin-right: 4px; color: red; " +
        "color:red;";
blockButton.textContent = "-";


document.querySelectorAll('#chat_wrapper .chat_tab a')[0].onclick = function() {
    block_list_container.style.display = 'flex';
}

document.querySelectorAll('#close_blocklist')[0].onclick = function() {
    block_list_container.style.display = 'none';
}



const interval = setInterval(function () {

    document
        .querySelectorAll(".from_message")
        .forEach(function (element) {

            if (element.parentNode.querySelectorAll('a').length < 1) {
                let newBlockButton = blockButton.cloneNode(true);
                newBlockButton.setAttribute('data-username', element.textContent.replace(': ', ''))


                insertAfter(newBlockButton, element);

                newBlockButton.onclick = function() {
                    block(newBlockButton.getAttribute('data-username'));

                }
            }

            console.log('match to regex');
            console.log(element.textContent.match(regexGuest));
            console.log(localStorage.areGuestsBlocked);
            console.log(element.textContent.match(regexGuest) !== null & localStorage.areGuestsBlocked === 'true');


            if (element.textContent.match(regexGuest) !== null & localStorage.areGuestsBlocked === 'true') {
                element
                    .parentElement
                    .style
                    .display = 'none'
                console.log('Blocked message from ' + element.textContent)
            };



            if (element.getAttribute('data-reviewed') !== 'true') {

                let blacklisted = false;

                blackList.forEach(x => {

                    if (element.textContent === x + ': ' || element.textContent === x) {
                        element
                            .parentElement
                            .style
                            .display = 'none'

                        console.log('Blocked message from ' + element.textContent)
                        blacklisted = true;
                    }
                });

                if (element.textContent.match(regexGuest) !== null & localStorage.getItem('areGuestsBlocked') === 'true') {
                    element
                        .parentElement
                        .style
                        .display = 'none'
                    console.log('Blocked message from ' + element.textContent)
                    blacklisted = true;
                };

                if (blacklisted === false) {
                    element.parentNode.style.display = 'block';
                    console.log('Message permitted from user ' + element.textContent)
                } else {
                    element.parentNode.style.display = 'none';
                }

                element.setAttribute('data-reviewed', 'true')


            }

        });
}, 1000);

function insertAfter(newNode, referenceNode) {
    referenceNode
        .parentNode
        .insertBefore(newNode, referenceNode.nextSibling);
}



function block(username) {

    blackList.push(username);

    localStorage.blockList = JSON.stringify(blackList);


    let current_blocked_user = new_blocked_user.cloneNode(true);

    current_blocked_user.innerHTML = '<span>' + username + '</span><a class="unblock_user">Unblock</a>'
    document.querySelectorAll('#block_list_users')[0].append(current_blocked_user);

    current_blocked_user.querySelectorAll('a')[0].onclick = function() {
        blackList = blackList.filter(e => e !== username); // will return ['A', 'C'];

        console.log(blackList);

        localStorage.blockList = JSON.stringify(blackList);

        console.log('1');

        this.parentNode.remove();

        console.log('2');

        document.querySelectorAll('.from_message').forEach(x => {
            console.log(x);
            console.log(x.innerText);

            if (x.innerText === username || x.innerText === username + ': ') {
                x.parentNode.style.display = 'block';
            }

        })





    }

    console.log(blackList);
    console.log(localStorage.getItem('blockList'));

    document
        .querySelectorAll(".from_message")
        .forEach(function (element) {

            let blacklisted = false;

            blackList.forEach(x => {

                if (element.textContent === x + ': ' || element.textContent === x) {
                    element
                        .parentElement
                        .style
                        .display = 'none'
                    console.log('Blocked message from ' + element.textContent)
                    blacklisted = true;
                }
            });

            if (element.textContent.match(regexGuest) & localStorage.getItem('areGuestsBlocked') === 'true') {
                element
                    .parentElement
                    .style
                    .display = 'none'
                console.log('Blocked message from ' + element.textContent)
                blacklisted = true;
            };

            if (blacklisted === false) {
                element.parentNode.style.display = 'block';
                console.log('Message permitted from user ' + element.textContent)
            }

        });

}



document.querySelectorAll('#block_user_form')[0].onsubmit = function(e) {
    e.preventDefault();

    block(document.querySelectorAll('#block_user_form')[0].querySelector('input').value);


    document.querySelectorAll('#block_user_form')[0].querySelector('input').value = '';
}

document.getElementById('mute_guests').onclick = function() {
    let checkbox = document.getElementById('mute_guests');

  if (checkbox.checked) {

    localStorage.areGuestsBlocked = 'true';

    console.log('marked checkbox as true');

    document
        .querySelectorAll(".from_message")
        .forEach(function (element) {

            console.log(regexGuest)

            if (element.textContent.match(regexGuest) !== null) {
                element
                    .parentElement
                    .style
                    .display = 'none'
                console.log('Blocked message from ' + element.textContent)
                element.setAttribute('data-reviewed', 'true')
            };
    });



  } else {

    localStorage.areGuestsBlocked = 'false';

    document
        .querySelectorAll(".from_message")
        .forEach(function (element) {

            if (element.textContent.match(regexGuest) !== null) {
                element
                    .parentElement
                    .style
                    .display = 'block'
                console.log('Blocked message from ' + element.textContent)
                element.setAttribute('data-reviewed', 'true')
            };
        })


  }
}
})();
