/* 
    Title:          Neo's portfolio (Final Project)
    Author:         Neo Lee (W0435748)
    Date:           Dec 07, 2019
    Description:    Make a personal portfolio pages (Work sample page)

 */
/* Global variables and constant variables ---------------------------------- */
const INTERVAL_FOR_MAIN_DIV = 3000; // 3 seconds
const MIN_WORK_SAMPLE = 1; // start sample
const MAX_WORK_SAMPLE = 16; // total samples
var currentWorkSample = MIN_WORK_SAMPLE;

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
/*
    Function Name: setTimerForWSMain
    Description:   set timer for work sample main division
    Inputs:        none
    Output:        none

*/
function setTimerForWSMain() {
  setInterval(changeMainWorkSample, INTERVAL_FOR_MAIN_DIV);
}

/*
    Function Name: changeMainWorkSample
    Description:   change work sample in main division 
    Inputs:        none
    Output:        none

*/
function changeMainWorkSample() {
  // change current work sample number
  if (++currentWorkSample > MAX_WORK_SAMPLE) {
    currentWorkSample = 1;
  }

  // get main work sample division
  let eleDivMainWorkSample = document.getElementsByClassName("div_ws_main")[0];

  // get sub work sample division
  let strPrevDivSubWorkSample = "";
  let strCurrDivSubWorkSample = `div_ws_sub_${currentWorkSample}`;
  if (currentWorkSample === MIN_WORK_SAMPLE) {
    strPrevDivSubWorkSample = `div_ws_sub_${MAX_WORK_SAMPLE}`;
  } else {
    strPrevDivSubWorkSample = `div_ws_sub_${currentWorkSample - 1}`;
  }

  let elePrevDivSubWorkSample = document.getElementsByClassName(strPrevDivSubWorkSample)[0];
  let eleCurrDivSubWorkSample = document.getElementsByClassName(strCurrDivSubWorkSample)[0];

  // get image element from current work sample
  let eleCurrImg = eleCurrDivSubWorkSample.querySelector("img");
  document.getElementById("h1_ws_title").innerHTML = `[ ${eleCurrImg.alt} ]`;

  // set current work sample to main work sample
  eleDivMainWorkSample.innerHTML = eleCurrDivSubWorkSample.innerHTML;
  eleCurrDivSubWorkSample.style.display = "none";
  elePrevDivSubWorkSample.style.display = "inherit";

  // reorder sub work samples
  let currOrdDiv = currentWorkSample;
  let strOrderDiv = "";
  let eleOrdDivSubWorkSample = null;

  for (let i = 1; i < MAX_WORK_SAMPLE + 1; i++) {
    if (currOrdDiv === MAX_WORK_SAMPLE + 1) {
      strOrderDiv = `div_ws_sub_${MIN_WORK_SAMPLE}`;
      currOrdDiv = MIN_WORK_SAMPLE;
    } else {
      strOrderDiv = `div_ws_sub_${currOrdDiv}`;
    }

    // console.log(`${i},  ${strOrderDiv}`);
    // set order
    eleOrdDivSubWorkSample = document.getElementsByClassName(strOrderDiv)[0];
    eleOrdDivSubWorkSample.style.order = i;

    currOrdDiv++;
  }
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function () {
  // table background setting
  setTimerForWSMain();
};
