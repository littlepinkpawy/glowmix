alert("Script is connected!");

const YOUTUBE_API_KEY = "AIzaSyDiwNMGdrG0AYsy98ZskZW6Ha3vYREjagA";

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
    let url = document.getElementById("url1").value.trim();
    let videoId = getYouTubeVideoId(url);

    if (!videoId) {
        alert("Please enter a valid YouTube link!");
        return;
    }

    player1.loadVideoById(videoId);
}

function loadVideo2() {
    let url = document.getElementById("url2").value.trim();
    let videoId = getYouTubeVideoId(url);

    if (!videoId) {
        alert("Please enter a valid YouTube link!");
        return;
    }

    player2.loadVideoById(videoId);
}

function getYouTubeVideoId(url) {
    try {
        let parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("youtube.com")) {
            if (parsedUrl.pathname === "/watch") {
                return parsedUrl.searchParams.get("v");
            }

            if (parsedUrl.pathname.startsWith("/shorts/")) {
                return parsedUrl.pathname.split("/shorts/")[1].split("/")[0];
            }

            if (parsedUrl.pathname.startsWith("/embed/")) {
                return parsedUrl.pathname.split("/embed/")[1].split("/")[0];
            }
        }

        if (parsedUrl.hostname === "youtu.be") {
            return parsedUrl.pathname.substring(1).split("/")[0];
        }

        return null;

    } catch (error) {
        return null;
    }
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

    let mixName = document.getElementById("mixName").value.trim();

    if (mixName === "") {
        alert("Please enter a mix name!");
        return;
    }

    let video1 = player1.getVideoData();
    let video2 = player2.getVideoData();

    let mix = {
        name: mixName,

        player1: video1.video_id,
        player1Title: video1.title,
        player1Thumbnail:
            "https://img.youtube.com/vi/" +
            video1.video_id +
            "/mqdefault.jpg",

        player2: video2.video_id,
        player2Title: video2.title,
        player2Thumbnail:
            "https://img.youtube.com/vi/" +
            video2.video_id +
            "/mqdefault.jpg"
    };

    localStorage.setItem(
        mixName,
        JSON.stringify(mix)
    );

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

        let mix;

        try {
            mix = JSON.parse(localStorage.getItem(key));
        } catch (error) {
            continue;
        }

        if (!mix || !mix.name || !mix.player1 || !mix.player2) {
            continue;
        }

        let mixCard = document.createElement("div");

        mixCard.className = "saved-mix-card";

        mixCard.innerHTML = `

            <div class="saved-mix-videos">

                <img
                    src="${mix.player1Thumbnail || 'https://img.youtube.com/vi/' + mix.player1 + '/mqdefault.jpg'}"
                    alt="Player 1"
                >

                <img
                    src="${mix.player2Thumbnail || 'https://img.youtube.com/vi/' + mix.player2 + '/mqdefault.jpg'}"
                    alt="Player 2"
                >

            </div>

            <div class="saved-mix-info">

                <h3>🎵 ${mix.name}</h3>

                <button onclick="playMix('${key}')">
                    ▶️ Play
                </button>

                <button onclick="renameMix('${key}')">
                    ✏️ Rename
                </button>

                <button onclick="deleteMix('${key}')">
                    🗑 Delete
                </button>

            </div>

        `;

        mixList.appendChild(mixCard);

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

async function searchYouTube(playerNumber) {

    let searchInput;

    if (playerNumber === 1) {
        searchInput = document.getElementById("url1");
    } else {
        searchInput = document.getElementById("url2");
    }

    let query = searchInput.value.trim();

    if (query === "") {
        alert("Please enter something to search!");
        return;
    }

    let resultsContainer;

    if (playerNumber === 1) {
        resultsContainer = document.getElementById("results1");
    } else {
        resultsContainer = document.getElementById("results2");
    }

    resultsContainer.className = "search-results";
    resultsContainer.style.setProperty("display", "block", "important");
    resultsContainer.innerHTML = "🔎 Searching...";

    try {

        let response = await fetch(
            "https://www.googleapis.com/youtube/v3/search" +
            "?part=snippet" +
            "&maxResults=50" +
            "&type=video" +
            "&q=" + encodeURIComponent(query) +
            "&key=" + YOUTUBE_API_KEY
        );

        let data = await response.json();

        if (data.error) {
            console.error(data.error);
            resultsContainer.innerHTML = "❌ YouTube search error.";
            return;
        }

        if (!data.items || data.items.length === 0) {
            resultsContainer.innerHTML = "No videos found.";
            return;
        }

        resultsContainer.innerHTML = `
            <button class="close-results" onclick="closeSearchResults(${playerNumber})">
                ✕ Hide Results
            </button>
        `;

        data.items.forEach(function(video) {

            let videoId = video.id.videoId;
            let title = video.snippet.title;
            let channel = video.snippet.channelTitle;
            let thumbnail = video.snippet.thumbnails.medium.url;

            let result = document.createElement("div");

            result.className = "search-result";

            result.innerHTML = `
                <img 
                    src="${thumbnail}" 
                    alt="Video thumbnail"
                >

                <div class="search-result-info">

                    <div class="search-result-title">
                        ${title}
                    </div>

                    <div class="search-result-channel">
                        ${channel}
                    </div>

                </div>

                <button class="search-play" title="Load video">
                    ▶️
                </button>

                <button class="search-favorite" title="Add to favorites">
                    ♡
                </button>
            `;

            let playButton =
                result.querySelector(".search-play");

            let favoriteButton =
                result.querySelector(".search-favorite");


            playButton.onclick = function() {

                if (playerNumber === 1) {
                    player1.loadVideoById(videoId);
                } else {
                    player2.loadVideoById(videoId);
                }

            };


            favoriteButton.onclick = function(event) {

                event.stopPropagation();

                let favorites =
                    JSON.parse(localStorage.getItem("glowmixFavorites")) || [];

                let alreadyFavorite = favorites.some(function(savedVideo) {
                    return savedVideo.id === videoId;
                });

                if (alreadyFavorite) {

                    removeFavorite(videoId);

                    favoriteButton.textContent = "♡";

                } else {

                    addFavorite(
                        videoId,
                        title,
                        channel,
                        thumbnail
                    );

                    favoriteButton.textContent = "❤️";

                }

            };


            let favorites =
                JSON.parse(localStorage.getItem("glowmixFavorites")) || [];

            let alreadyFavorite = favorites.some(function(savedVideo) {
                return savedVideo.id === videoId;
            });

            if (alreadyFavorite) {
                favoriteButton.textContent = "❤️";
            }


            resultsContainer.appendChild(result);

        });

    } catch (error) {

        console.error(error);

        resultsContainer.innerHTML =
            "❌ Something went wrong. Check your internet connection.";

    }
}

function closeSearchResults(playerNumber) {

    if (playerNumber === 1) {
        document.getElementById("results1").style.setProperty("display", "none", "important");
    } else {
        document.getElementById("results2").style.setProperty("display", "none", "important");
    }


}

function addFavorite(videoId, title, channel, thumbnail) {

    let favorites = JSON.parse(localStorage.getItem("glowmixFavorites")) || [];

    let alreadyFavorite = favorites.some(function(video) {
        return video.id === videoId;
    });

    if (alreadyFavorite) {
        return;
    }

    favorites.push({
        id: videoId,
        title: title,
        channel: channel,
        thumbnail: thumbnail
    });

    localStorage.setItem(
        "glowmixFavorites",
        JSON.stringify(favorites)
    );

    showFavorites();

}


function removeFavorite(videoId) {

    let favorites =
        JSON.parse(localStorage.getItem("glowmixFavorites")) || [];

    favorites = favorites.filter(function(video) {
        return video.id !== videoId;
    });

    localStorage.setItem(
        "glowmixFavorites",
        JSON.stringify(favorites)
    );

    showFavorites();

}


function showFavorites() {

    let favorites =
        JSON.parse(localStorage.getItem("glowmixFavorites")) || [];

    let favoritesList =
        document.getElementById("favoritesList");

    if (favorites.length === 0) {

        favoritesList.innerHTML =
            "<p>No favorites yet ❤️</p>";

        return;
    }

    favoritesList.innerHTML = "";

    favorites.forEach(function(video) {

        let favorite = document.createElement("div");

        favorite.className = "favorite-item";

        favorite.innerHTML = `

            <img
                src="${video.thumbnail}"
                alt="Video thumbnail"
            >

            <div class="favorite-info">

                <div class="favorite-title">
                    ${video.title}
                </div>

                <div class="favorite-channel">
                    ${video.channel}
                </div>

            </div>

            <button class="favorite-play">
                ▶️
            </button>

            <button class="favorite-remove">
                💔
            </button>

        `;

        favorite.querySelector(".favorite-play").onclick =
            function() {

                player1.loadVideoById(video.id);

            };


        favorite.querySelector(".favorite-remove").onclick =
            function() {

                removeFavorite(video.id);

            };


        favoritesList.appendChild(favorite);

    });

}

function toggleFavorites() {

    let favoritesList =
        document.getElementById("favoritesList");

    if (favoritesList.style.display === "none") {

        favoritesList.style.setProperty(
            "display",
            "block",
            "important"
        );

        showFavorites();

    } else {

        favoritesList.style.setProperty(
            "display",
            "none",
            "important"
        );

    }

}
