/* 
    Title:          Neo's portfolio (Final Project)
    Author:         Neo Lee (W0435748)
    Date:           Dec 03, 2019
    Description:    Make a personal portfolio pages (Skills page)

 */
/* Global variables and constant variables ---------------------------------- */
const MIN_NUM = 1;
const MAX_NUM = 255;

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
function decToHex(decNum) {
  let base = 16;
  let hex = decNum.toString(base);

  if (hex.length % 2) {
    hex = "0" + hex;
  }

  return hex;
}

/*
    Function Name: setTableBackground
    Description:   set two skills table's cell background color
    Inputs:        none
    Output:        none

*/
function setInputBackground() {
  let eleInputs = document.getElementsByTagName("input");
  let bgcolorValue = "";
  let redRandom = 0;
  let greenRandom = 0;
  let blueRandom = 0;

  for (let i = 0; i < eleInputs.length; i++) {
    redRandom = Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM;
    greenRandom = Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM;
    blueRandom = Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM;

    bgcolorValue = "#" + decToHex(redRandom) + decToHex(greenRandom) + decToHex(blueRandom);
    eleInputs[i].style.backgroundColor = bgcolorValue;
  }
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  // table background setting
  setInputBackground();
};
