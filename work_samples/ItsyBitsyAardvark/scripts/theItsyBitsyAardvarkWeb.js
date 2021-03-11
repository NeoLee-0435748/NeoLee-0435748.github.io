"use strict";

/*
  Student Name:   Neo Lee(W0435748)
  Date:           Dec 17, 2019  
  Program Title:  The Itsy Bitsy Aardvark Game (Web version)
*/

/* Global variables and constant variables ---------------------------------- */
const STORY_FILENAME = "./files/the_story_file.txt"; // story filename
const CHOICES_FILENAME = "./files/the_choices_file.csv"; // choices filename
var infoStory = []; // array for story
var csvChoices = []; // csv array for choices
var currQuestion = 0; // current sequence number for question
var choiceResults = []; // for results about 7 questions

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
/*
    Function Name: loadStoryInfo
    Description:   load story file
    Inputs:        none
    Output:        none

*/
function loadStoryInfo() {
  // Retrieve data from a URL without having to do a full page refresh
  let requestHTTP = new XMLHttpRequest();

  // An EventHandler that is called whenever the readyState attribute changes.
  requestHTTP.onreadystatechange = function() {
    // check server (readyState: 4-The operation is complete, status: 200-DONE)
    if (this.readyState == 4 && this.status == 200) {
      // store JSON data from server to the global variable after parsing
      infoStory = this.responseText.split("\r\n");

      // load choices info
      loadChoicesInfo();
    }
  };

  // Initializes a request (get the story file)
  requestHTTP.open("GET", STORY_FILENAME, true);

  // Sends the request
  requestHTTP.send();
}

/*
    Function Name: loadChoicesInfo
    Description:   load choices file
    Inputs:        none
    Output:        none

*/
function loadChoicesInfo() {
  // Retrieve data from a URL without having to do a full page refresh
  let requestHTTP = new XMLHttpRequest();

  // An EventHandler that is called whenever the readyState attribute changes.
  requestHTTP.onreadystatechange = function() {
    // check server (readyState: 4-The operation is complete, status: 200-DONE)
    if (this.readyState == 4 && this.status == 200) {
      // store JSON data from server to the global variable after parsing
      let strChoices = ""; // string for choices
      strChoices = this.responseText;

      // parse csv data
      csvChoices = getParsedCSVData(strChoices);

      // display choices
      displayChoices();
    }
  };

  // Initializes a request (get the story file)
  requestHTTP.open("GET", CHOICES_FILENAME, true);

  // Sends the request
  requestHTTP.send();
}

/*
    Function Name: getParsedCSVData
    Description:   get a parsed data from csv format string
    Inputs:        inStrChoices - string of a csv file
    Output:        none

*/
function getParsedCSVData(inStrChoices) {
  return Papa.parse(inStrChoices, setPapaConfig());
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
    Function Name: displayChoices
    Description:   get the choices about 7 questions from the console
    Inputs:        none
    Output:        none

*/
function displayChoices() {
  // get elements
  let eleH3Question = document.getElementById("h3_question");
  let eleLblAnswers = document.getElementsByName("lbl_answer");

  // display question
  eleH3Question.innerHTML = `Please choose ${csvChoices.data[currQuestion][0]}`;

  // display answers
  for (let i = 0; i < eleLblAnswers.length; i++) {
    eleLblAnswers[i].innerHTML = `${csvChoices.data[currQuestion][i + 1]}`;
  }
} // end of function

/*
    Function Name: checkAnswer
    Description:   check any answer was checked
    Inputs:        none
    Output:        checkYn - if any answer is selected, true, others false

*/
function checkAnswer() {
  // get elements
  let eleRdoAnswers = document.getElementsByName("rdo_answer");

  for (let i = 0; i < eleRdoAnswers.length; i++) {
    if (eleRdoAnswers[i].checked) {
      choiceResults[currQuestion] = parseInt(eleRdoAnswers[i].value);
      eleRdoAnswers[i].checked = false;
      return true;
    }
  }

  return false;
}

/*
    Function Name: displayFinalStory
    Description:   display final story what is changed by the answers
    Inputs:        none
    Output:        none

*/
function displayFinalStory() {
  // Declare constant variables
  let PLACEHOLDERS = ["_1_", "_2_", "_3_", "_4_", "_5_", "_6_", "_7_"]; // for replacing the placeholders
  let tempSrc = "";
  let tempDesc = ""; // string for temporary
  let elePResult = document.getElementsByClassName("p_result");

  // Convert story
  for (var i = 0; i < infoStory.length; i++) {
    tempSrc = infoStory[i];
    for (var j = 0; j < PLACEHOLDERS.length; j++) {
      // replace all story using PLACEHOLDERS
      tempDesc = tempSrc.replace(new RegExp(PLACEHOLDERS[j], "g"), csvChoices.data[j][choiceResults[j]].toUpperCase());
      // for next replace
      tempSrc = tempDesc;
    } // end of for
    console.log(tempDesc);

    // display result string
    elePResult[i].innerHTML = `${tempDesc}`;
  } // end of for
} // end of function

/*
    Function Name: initGame
    Description:   initialize the game
    Inputs:        none
    Output:        none

*/
function initGame() {
  currQuestion = 0; // init the current sequence number for question
  choiceResults = []; // init the results about 7 questions

  // init output
  let elePResult = document.getElementsByClassName("p_result");
  for (let i = 0; i < elePResult.length; i++) {
    elePResult[i].innerHTML = "";
  }

  // start game
  displayChoices();
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  let eleBtnAgain = document.getElementById("btn_again");

  eleBtnAgain.style.visibility = "hidden";

  // Request story file data
  loadStoryInfo();
};

// btn_next click event
let eleBtnNext = document.getElementById("btn_next");

eleBtnNext.addEventListener("click", function() {
  if (csvChoices.data.length > currQuestion) {
    if (checkAnswer()) {
      currQuestion++;
      if (csvChoices.data.length != currQuestion) {
        displayChoices();
      } else {
        let eleBtnAgain = document.getElementById("btn_again");

        eleBtnAgain.style.visibility = "visible";
        this.disabled = true;
        displayFinalStory();
      }
    } else {
      alert("You need to choice a answer first!!!");
    }
  }
});

// btn_again click event
let eleBtnAgain = document.getElementById("btn_again");

eleBtnAgain.addEventListener("click", function() {
  let eleBtnNext = document.getElementById("btn_next");

  this.style.visibility = "hidden";
  eleBtnNext.disabled = false;
  initGame();
});
