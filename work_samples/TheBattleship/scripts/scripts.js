"use strict";

/*
  Student Name:   Neo Lee(W0435748)
  Date:           Dec 20, 2019  
  Program Title:  The Battleship Game (Web version)
*/

/* Global variables and constant variables ---------------------------------- */
const MAP_FILENAME = "./files/map.txt"; // map filename
const IS_SHIP = "1"; // map info for part of ship
const IS_NOT_SHIP = "0"; // map info for not part of ship
const IS_HIT = "H"; // map info for hitted target
const IS_MISS = "M"; // map info for missed target
const TOTAL_MISSILES = 30; // total missiles for one game
var csvMapInfo = []; // array for map
var cntAllShips = 0; // a number of all ship's parts
var currMissiles = 0; // count for how many missiles used
var cntHit = 0; // count for how many missiles hitted
var cntMiss = 0; // count for how many missiles missed

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
/*
    Function Name: loadMapInfo
    Description:   load map file
    Inputs:        none
    Output:        none

*/
function loadMapInfo() {
  // Retrieve data from a URL without having to do a full page refresh
  let requestHTTP = new XMLHttpRequest();

  // An EventHandler that is called whenever the readyState attribute changes.
  requestHTTP.onreadystatechange = function() {
    // check server (readyState: 4-The operation is complete, status: 200-DONE)
    if (this.readyState == 4 && this.status == 200) {
      // store JSON data from server to the global variable after parsing

      // parse csv data
      csvMapInfo = getParsedCSVData(this.responseText);

      // initialize the game
      initGame();
    }
  };

  // Initializes a request (get the map file)
  requestHTTP.open("GET", MAP_FILENAME, true);

  // Sends the request
  requestHTTP.send();
}

/*
    Function Name: getParsedCSVData
    Description:   get a parsed data from csv format string
    Inputs:        inStr - string of a csv data
    Output:        none

*/
function getParsedCSVData(inStr) {
  return Papa.parse(inStr, setPapaConfig());
}

function setPapaConfig() {
  return {
    delimiter: "", // auto-detect
    newline: "", // auto-detect
    quoteChar: '"',
    escapeChar: '"',
    header: false,
    transformHeader: undefined,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    downloadRequestHeaders: undefined,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined,
    delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP]
  };
}

/*
    Function Name: initGame
    Description:   Initialize the game for playing
    Inputs:        none
    Output:        none

*/
function initGame() {
  // clear variables
  cntAllShips = 0; // a number of all ship's parts
  currMissiles = 0; // count for how many missiles used
  cntHit = 0; // count for how many missiles hitted
  cntMiss = 0; // count for how many missiles missed

  // init default map info to the buttons
  setInitMap();

  // init current status for the game
  displayCurrentStatus();
}

/*
    Function Name: setInitMap
    Description:   set default map info to the buttons
    Inputs:        none
    Output:        none

*/
function setInitMap() {
  for (let i = 0; i < csvMapInfo.data.length; i++) {
    for (let j = 0; j < csvMapInfo.data[i].length; j++) {
      // get button element
      let eleBtnMap = document.getElementById(`row${i}col${j}`);

      // set button's value to map data
      eleBtnMap.value = csvMapInfo.data[i][j];
      if (eleBtnMap.value === IS_SHIP) {
        cntAllShips++;
      }

      // set button's style
      eleBtnMap.style.backgroundColor = "darkgray";
    }
  }
}

/*
    Function Name: checkCoodinate
    Description:   check the picked target in coodinate
    Inputs:        event - picked button for target
    Output:        none

*/
function checkCoodinate(isEvent) {
  // if all missiles used
  if (currMissiles < TOTAL_MISSILES) {
    // target is a part of a ship
    if (isEvent.target.value === IS_SHIP) {
      isEvent.target.value = IS_HIT;
      isEvent.target.style.backgroundColor = "red";
      cntHit++;
      currMissiles++;
      displayCurrentStatus();
    }
    // target is not a part of a ship
    else if (isEvent.target.value === IS_NOT_SHIP) {
      isEvent.target.value = IS_MISS;
      isEvent.target.style.backgroundColor = "blue";
      cntMiss++;
      currMissiles++;
      displayCurrentStatus();
    }
    // target is already picked
    else {
      alert("You cannot choose same target!!!");
    }
  }

  // Get the modal
  let eleModal = document.getElementById("myModal");
  let eleModalbody = document.getElementsByClassName("modal-body")[0];
  let eleModalbodyTitle = document.getElementsByClassName("modal-header-title")[0];

  // if user win
  if (cntHit === cntAllShips) {
    // set modal content
    eleModalbodyTitle.innerHTML = "<p>You won!!! Congraturations</p>";
    eleModalbody.innerHTML = "<p>YOU SANK MY ENTIRE FLEET!!!</p><p>When you close the message window, the game is started again.</p><br />";
    // open the modal
    eleModal.style.display = "block";
  }

  // if user lose
  if (currMissiles === TOTAL_MISSILES) {
    // set modal content
    eleModalbodyTitle.innerHTML = "<p>GAME OVER</p>";
    eleModalbody.innerHTML = "<p>You did not sink all the ships!!!</p><p>When you close the message window, the game is started again.</p><br />";
    // open the modal
    eleModal.style.display = "block";
  }
}

/*
    Function Name: displayCurrentStatus
    Description:   display current status for the game
    Inputs:        none
    Output:        none

*/
function displayCurrentStatus() {
  // get element from DOM
  let elePMissile = document.getElementById("missile_cnt");
  let elePHit = document.getElementById("hit_cnt");
  let elePMiss = document.getElementById("miss_cnt");

  elePMissile.innerHTML = `${currMissiles} / ${TOTAL_MISSILES}`;
  elePHit.innerHTML = `${cntHit}`;
  elePMiss.innerHTML = `${cntMiss}`;
}

/* DOM events --------------------------------------------------------------- */
// get body element
let eleBody = document.getElementsByTagName("body")[0];

// Body onload event
eleBody.onload = function() {
  // Request map file data
  loadMapInfo();
};

// Body click event
eleBody.addEventListener("click", function(event) {
  // console.log(event.path[1].tagName);
  // console.log(event.target.tagName);
  // console.log(event.target.value);

  if (event.target.tagName === "BUTTON" && event.path[1].tagName === "TD") {
    checkCoodinate(event);
  }
});

// get the <span> element that closes the modal
let eleBtnClose = document.getElementsByClassName("close")[0];

// when the user clicks on <span> (x), close the modal
eleBtnClose.addEventListener("click", function() {
  // Get the modal
  let modal = document.getElementById("myModal");

  // initialize the game
  initGame();

  // hide a modal
  modal.style.display = "none";
});
