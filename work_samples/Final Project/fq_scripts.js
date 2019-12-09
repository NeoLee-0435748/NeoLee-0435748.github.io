/*
  Student Name:   Neo Lee(W0435748)
  Date:           Dec 07, 2019  
  Program Title:  Flag of the countries Quiz
*/

/* Global variables and constant variables ---------------------------------- */
const COUNTRY_JSON_FILENAME = "countries.json"; // JSON input filename
const HIGHSCORES_JSON_FILENAME = "original_high_scores.json"; // JSON input filename
const PATH_FLAG_IMG = ".\\flags\\"; // flag image file path
var gInfoCountries = []; // array for all countries info
var gQuizCount = 0; // how many quizzes are solved
var gCorrectAnswerCount = 0; // how many answers are correct
var gCurrentRandomAnswer = 0; // current quiz correct answer
var gCurrentQuizInfo = []; // current quiz answers
var gAnswerCountries = []; // all answers countries

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
/*
    Function Name: appendLeadingZeroes
    Description:   Calculate area in kilometer
                   - ratio: mile:kilometer=1:2.58999
                   * load the JSON file for countries information when the data loaded
    Inputs:        n - source number
    Output:        "0" + n - append leading zero string
    Source:        https://codehandbook.org/javascript-date-format/

*/
function appendLeadingZeroes(n) {
  if (n <= 9) {
    return "0" + n;
  }

  return n;
}

/*
    Function Name: loadCountriesInfo
    Description:   Calculate area in kilometer
                   - ratio: mile:kilometer=1:2.58999
                   * load the JSON file for countries information when the data loaded
    Inputs:        none
    Output:        areaInKm (float)

*/
function loadCountriesInfo() {
  // Retrieve data from a URL without having to do a full page refresh
  let requestHTTP = new XMLHttpRequest();

  // An EventHandler that is called whenever the readyState attribute changes.
  requestHTTP.onreadystatechange = function() {
    // check server (readyState: 4-The operation is complete, status: 200-DONE)
    if (this.readyState == 4 && this.status == 200) {
      // store JSON data from server to the global variable after parsing
      gInfoCountries = JSON.parse(this.responseText);

      // request high score data
      loadHighScoreData();
    }
  };

  // Initializes a request (get the json file)
  requestHTTP.open("GET", COUNTRY_JSON_FILENAME, true);

  // Sends the request
  requestHTTP.send();
}

/*
    Function Name: loadHighScoreData
    Description:   Load high score data from a JSON file (if localStarage data not exist)
    Inputs:        none
    Output:        none

*/
function loadHighScoreData() {
  if (localStorage.highScoreData == null) {
    // Retrieve data from a URL without having to do a full page refresh
    let requestHTTP = new XMLHttpRequest();

    // An EventHandler that is called whenever the readyState attribute changes.
    requestHTTP.onreadystatechange = function() {
      // check server (readyState: 4-The operation is complete, status: 200-DONE)
      if (this.readyState == 4 && this.status == 200) {
        // store JSON data from server to the global variable after parsing
        localStorage.highScoreData = this.responseText;

        // Initialize Quiz
        initQuiz();
      }
    };

    // Initializes a request (get the json file)
    requestHTTP.open("GET", HIGHSCORES_JSON_FILENAME, true);

    // Sends the request
    requestHTTP.send();
  } else {
    // Initialize Quiz
    initQuiz();
  }
}

/*
    Function Name: loadHighScoreData
    Description:   Load high score data from a JSON file (if localStarage data not exist)
    Inputs:        none
    Output:        none

*/
function initQuiz() {
  // Initialize global variables
  gQuizCount = 0; // how many quizzes are solved
  gCorrectAnswerCount = 0; // how many answers are correct
  gAnswerCountries = []; // all answers countries

  // Initialize answer radio button
  let eleRdoAnswer = document.getElementsByName("quiz_answer");

  for (let i = 0; i < eleRdoAnswer.length; i++) {
    eleRdoAnswer[i].checked = false;
  }

  // call Get Quiz info for first quiz
  getQuizInfo();
}

/*
    Function Name: getQuizInfo
    Description:   Get quiz information (four countries and answer)
    Inputs:        none
    Output:        none

*/
function getQuizInfo() {
  let randomCountry = -1; // for random four counties
  let checkFlag = true; // avoid same country in answer

  // init current quiz answers
  gCurrentQuizInfo = [];

  // Generate random number for answer (0 to 3)
  gCurrentRandomAnswer = Math.floor(Math.random() * (3 - 0 + 1)) + 0; //The maximum is inclusive and the minimum is inclusive

  // Generate correct answer country
  for (let i = 0; i < 4; i++) {
    randomCountry = Math.floor(Math.random() * (200 - 0 + 1)) + 0; //The maximum is inclusive and the minimum is inclusive

    //check before quiz answer countries
    if (gAnswerCountries.length !== 0) {
      do {
        for (let j = 0; j < gAnswerCountries.length; j++) {
          if (gAnswerCountries[j] !== gInfoCountries[randomCountry].Name) {
            continue;
          } else {
            checkFlag = false;
            break;
          }
        }

        // store new quiz correct answer country
        if (checkFlag === true) {
          break;
        }

        checkFlag = true; // same country does not exist in before answer
        randomCountry = Math.floor(Math.random() * (200 - 0 + 1)) + 0; //The maximum is inclusive and the minimum is inclusive
      } while (true);
    }

    // store answer data
    gCurrentQuizInfo.push(gInfoCountries[randomCountry].Name);
    gAnswerCountries.push(gInfoCountries[randomCountry].Name);
  }

  // Display quiz flag and answers
  displayCurrQuiz();
}

/*
    Function Name: displayCurrQuiz
    Description:   display current quiz
    Inputs:        none
    Output:        none

*/
function displayCurrQuiz() {
  // display flag image
  let eleImgCountryFlag = document.getElementById("img_country_flag");
  let eleLblAnswers = document.getElementsByName("lbl_quiz_answer");

  eleImgCountryFlag.style.display = "";
  eleImgCountryFlag.src = PATH_FLAG_IMG + gCurrentQuizInfo[gCurrentRandomAnswer].replace(new RegExp(" ", "g"), "_") + ".png";
  eleImgCountryFlag.alt = gCurrentQuizInfo[gCurrentRandomAnswer] + " flag";

  // display answers
  for (let i = 0; i < eleLblAnswers.length; i++) {
    eleLblAnswers[i].innerHTML = gCurrentQuizInfo[i];
  }

  // display correct answer result
  let resultPecentage = 0;
  try {
    resultPecentage = (gCorrectAnswerCount / gQuizCount) * 100;
    if (isNaN(resultPecentage)) {
      throw "Divede by zero";
    }
  } catch (e) {
    resultPecentage = 0;
  }
  document.getElementById("p_curr_result").innerHTML = `${gCorrectAnswerCount} out of ${gQuizCount} (${resultPecentage.toFixed(1)}%)`;
}

/*
    Function Name: checkCurrentAnswer
    Description:   check the current quiz answer and display next quiz
    Inputs:        none
    Output:        none

*/
function checkCurrentAnswer() {
  let existAnswer = false; // check the answer user have got or not
  let eleRdoAnswer = document.getElementsByName("quiz_answer");

  // check answer checked
  for (let i = 0; i < eleRdoAnswer.length; i++) {
    if (eleRdoAnswer[i].checked) {
      existAnswer = true;
      // increase total quiz count
      gQuizCount++;
      if (i === gCurrentRandomAnswer) {
        // increase correct answer count
        gCorrectAnswerCount++;
      }

      // uncheck current checked radio button
      eleRdoAnswer[i].checked = false;
      break;
    }
  }

  // there is no answer
  if (existAnswer === false) {
    alert("Please check the answer first.");
  } else {
    if (gQuizCount === 10) {
      // display current quiz result
      displayCurrQuiz();
      // make a score for result
      resultProcess();
      // display high scores table
      displayHighScoresTable();
    } else {
      // get next quiz
      getQuizInfo();
    }
  }
}

/*
    Function Name: resultProcess
    Description:   check the result quiz and display high score
    Inputs:        none
    Output:        none

*/
function resultProcess() {
  // localStorage high score data to the array
  let scoreData = JSON.parse(localStorage.highScoreData);

  // check result score is greater than last score in high scores
  if (gCorrectAnswerCount > scoreData[4].Score) {
    let scorePosition = 0;
    // get username from a prompt
    let username = prompt("Please enter your 3-letter username");
    // get a current date from system
    let currentDate = new Date();
    // make formatted current date (yyyy-mm-dd hh-mm-ss)
    let formattedDate = `${currentDate.getFullYear()}-${appendLeadingZeroes(currentDate.getMonth() + 1)}-${appendLeadingZeroes(currentDate.getDate())} ${appendLeadingZeroes(
      currentDate.getHours()
    )}:${appendLeadingZeroes(currentDate.getMinutes())}:${appendLeadingZeroes(currentDate.getSeconds())}`;

    // compare high scores
    for (let i = 0; i < scoreData.length; i++) {
      // compare current score is greater than ith score in hig scores
      if (gCorrectAnswerCount > scoreData[i].Score) {
        scorePosition = i;
        break;
      }
    }

    // insert the new scores data to high score and remove last one
    // make a JSON element for a new score
    let newScore = {
      "Score": gCorrectAnswerCount,
      "User": username,
      "Timestamp": formattedDate
    };
    // add new score
    scoreData.splice(scorePosition, 0, newScore);
    // remove last score
    scoreData.splice(scoreData.length - 1, 1);

    // the array to localStorage high score data
    localStorage.highScoreData = JSON.stringify(scoreData);
  }
}

/*
    Function Name: displayHighScoresTable
    Description:   display high scores table
    Inputs:        none
    Output:        none

*/
function displayHighScoresTable() {
  // read localStarage data and parse
  let scoresList = JSON.parse(localStorage.highScoreData);
  // get div elements for table
  let eleDivScores = document.getElementsByClassName("div_scores_table")[0];

  // make table header structure for scores list
  var scoresTable = "";
  scoresTable += "<h4>HIGH SCORES</h4>";
  scoresTable += "<table>";
  scoresTable += "<thead>";
  scoresTable += "<tr>";
  scoresTable += "<th>Score</th>";
  scoresTable += "<th>Username</th>";
  scoresTable += "<th>Date</th>";
  scoresTable += "</tr>";
  scoresTable += "</thead>";
  scoresTable += "<tbody>";

  // make rows for each data from notesList
  for (let i = 0; i < scoresList.length; i++) {
    // get the score data from scoresList
    let rowData = scoresList[i];

    scoresTable += "<tr>";
    // Score
    scoresTable += `<td>${rowData["Score"]}</td>`;
    // username
    scoresTable += `<td>${rowData["User"]}</td>`;
    // Date
    scoresTable += `<td>${rowData["Timestamp"]}</td>`;
    scoresTable += "</tr>";
  }

  // make table footer
  scoresTable += "</tr>";
  scoresTable += "</tbody>";
  scoresTable += "</table>";

  // display scores table in div_scores_table
  eleDivScores.innerHTML = scoresTable;
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  // Request JSON file data
  loadCountriesInfo(); // request countries data
};

// next button event
let eleBtnNext = document.getElementById("btn_next");

eleBtnNext.addEventListener("click", function() {
  if (gQuizCount === 10) {
    alert("There is no more quiz. Try restart or quit.");
  } else {
    checkCurrentAnswer();
  }
});

// restart button event
let eleBtnRestart = document.getElementById("btn_restart");

eleBtnRestart.addEventListener("click", function() {
  // restart quiz
  if (gQuizCount !== 10) {
    if (confirm("Are you sure to restart the game?") === true) {
      initQuiz();
    }
  } else {
    initQuiz();
  }
});

// quit button event
let eleBtnQuit = document.getElementById("btn_quit");

eleBtnQuit.addEventListener("click", function() {
  window.open("./index.html", "_self");
});
