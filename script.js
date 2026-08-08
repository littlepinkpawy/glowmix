alert("Script is connected!");

let player1;
let player2;
let mixesOpen = false;

function onYouTubeIframeAPIReady() {
    alert("API WORKS!");

    player1 = new YT.Player("player1", {
        events: {
            onStateChange: checkLoop1
        }
    });

    player2 = new YT.Player("player2", {
        events: {
            onStateChange: checkLoop2
        }
    });
}

function checkLoop1(event) {
    if (event.data === YT.PlayerState.ENDED && loop1) {
        player1.playVideo();
    }
}

function checkLoop2(event) {
    if (event.data === YT.PlayerState.ENDED && loop2) {
        player2.playVideo();
    }
}
function playVideo1() {
    player1.playVideo();
}

function pauseVideo1() {
    player1.pauseVideo();
}

function playVideo2() {
    player2.playVideo();
}

function pauseVideo2() {
    player2.pauseVideo();
}

function loadVideo1() {
    let url = document.getElementById("url1").value;

    let videoId = "";

    if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
    }

    player1.loadVideoById(videoId);
}

function loadVideo2() {
    let url = document.getElementById("url2").value;

    let videoId = "";

    if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
    }

    player2.loadVideoById(videoId);
}

function changeVolume1(volume) {
    player1.setVolume(volume);
}

function changeVolume2(volume) {
    player2.setVolume(volume);
}

let loop1 = false;
let loop2 = false;

function loopVideo1() {
    loop1 = !loop1;
    alert("Player 1 loop: " + loop1);
}

function loopVideo2() {
    loop2 = !loop2;
    alert("Player 2 loop: " + loop2);
}

function playBoth() {
    player1.playVideo();
    player2.playVideo();
}

function pauseBoth() {
    player1.pauseVideo();
    player2.pauseVideo();
}
function saveMix() {
    let mixName = document.getElementById("mixName").value;

    if (mixName === "") {
        alert("Please enter a mix name!");
        return;
    }

    let mix = {
        name: mixName,
        player1: player1.getVideoData().video_id,
        player2: player2.getVideoData().video_id
    };

    localStorage.setItem(mixName, JSON.stringify(mix));

    alert("Mix saved!");
}

function showMixes() {

    let mixList = document.getElementById("mixList");

    if (mixesOpen) {
        mixList.innerHTML = "";
        mixesOpen = false;
        return;
    }

    mixList.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);

        let mix = JSON.parse(localStorage.getItem(key));

        mixList.innerHTML += `
            <div>
                <h3>🎵 ${mix.name}</h3>

                <button onclick="playMix('${key}')">
                    ▶️ Play Mix
                </button>

                <button onclick="renameMix('${key}')">
                    ✏️ Rename
                </button>

                <button onclick="deleteMix('${key}')">
                    🗑 Delete
                </button>
            </div>
        `;
    }

    mixesOpen = true;
}
function renameMix(oldName) {

    let newName = prompt("Enter a new mix name:");

    if (newName === null || newName === "") {
        return;
    }

    let mix = JSON.parse(localStorage.getItem(oldName));

    mix.name = newName;

    localStorage.removeItem(oldName);

    localStorage.setItem(newName, JSON.stringify(mix));

    showMixes();
}
function openMix(name) {

    let mix = JSON.parse(localStorage.getItem(name));

    player1.loadVideoById(mix.player1);
    player2.loadVideoById(mix.player2);

    alert("Mix loaded!");
}
function playMix(name) {

    let mix = JSON.parse(localStorage.getItem(name));

    player1.loadVideoById(mix.player1);
    player2.loadVideoById(mix.player2);

    setTimeout(() => {
        player1.playVideo();
        player2.playVideo();
    }, 1000);

}

function deleteMix(name) {

    let confirmDelete = confirm("Are you sure you want to delete this mix?");

    if (confirmDelete) {
        localStorage.removeItem(name);
        showMixes();
        alert("Mix deleted!");
    }

}