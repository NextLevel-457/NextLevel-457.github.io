var currentChapter = 1
var chapterElement
var chapters = 13
var chapterCache = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]

window.onpagehide = async function(_event) {
    await cookieStore.set({
      name: "chapter",
      value: currentChapter.toString(),
      expires: Date.now() + (31*24*60*60*1000),
    });
}

document.addEventListener("DOMContentLoaded", async function(_event){
    loadConfig()

    var cookie = await cookieStore.get("chapter");
    console.log("Found cookies: \"" + cookie.value + "\"")
    if (cookie != null) currentChapter = Number(cookie.value)
    if (currentChapter < 1 || currentChapter > chapters) currentChapter = 1

    document.getElementById("button_previous").addEventListener("click", function(_event) {
        if (currentChapter > 1) currentChapter -= 1
        loadChapter(currentChapter)
        window.scrollTo(0,0)
    })
    document.getElementById("button_next").addEventListener("click", function(_event) {
        if (currentChapter < chapters) currentChapter += 1
        loadChapter(currentChapter)
        window.scrollTo(0,0)
    })

    document.getElementById("button_first").addEventListener("click", function(_event) {
        currentChapter = 1
        loadChapter(currentChapter)
        window.scrollTo(0,0)
    })
    document.getElementById("button_last").addEventListener("click", function(_event) {
        currentChapter = chapters
        loadChapter(currentChapter)
        window.scrollTo(0,0)
    })

    loadChapter(currentChapter)
});

function loadConfig() {
    // Create config request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "config.json", true);
    // When the request loads, update variables
    xmlhttp.onload = function(_event) {
        chapters = JSON.parse(xmlhttp.responseText).chapters
    }
    // If it fails, don't change anything, but send an error in the console.
    // TODO: Create a visible error popup
    xmlhttp.onerror = function(_event) {
        console.error("Error when loading config: " + xmlhttp.responseText)
    }
    // Send the request
    xmlhttp.send();
}

function loadChapter(chapter) {
    // Check cache to see if we can skip loading the chapter
    if (chapterCache[chapter-1] != "") {
        // Delete old element
        if (chapterElement != undefined) document.body.removeChild(chapterElement); chapterElement = undefined
        // Create new element
        var chapterText = chapterCache[chapter-1];
        chapterElement = document.createElement("div");
        chapterElement.innerHTML = chapterText;
        // Add element to webpage
        document.body.appendChild(chapterElement);
        // Update label
        document.getElementById("chapter_label").innerText = "Chapter " + chapter.toString()
        return
    }
    // Create chapter request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "fanfic_chapters/" + chapter.toString() + ".html", true);
    // When the request loads, delete the old element and create the new one
    xmlhttp.onload = function(_event) {
        // Delete old element
        if (chapterElement != undefined) document.body.removeChild(chapterElement); chapterElement = undefined
        // Cache response
        chapterCache[chapter-1] = xmlhttp.responseText;
        // Create new element
        var chapterText = xmlhttp.responseText;
        chapterElement = document.createElement("div");
        chapterElement.innerHTML = chapterText;
        // Add element to webpage
        document.body.appendChild(chapterElement);
        // Update label
        document.getElementById("chapter_label").innerText = "Chapter " + chapter.toString()
    }
    // If it fails, don't change anything, but send an error in the console.
    // TODO: Create a visible error popup
    xmlhttp.onerror = function(_event) {
        console.error("Error when loading chapter " + chapter.toString() + ": " + xmlhttp.responseText)
    }
    // Send the request
    xmlhttp.send();
}