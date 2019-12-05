/* 
    Title:          Neo's portfolio (Final Project)
    Author:         Neo Lee (W0435748)
    Date:           Dec 02, 2019
    Description:    Make a personal portfolio pages (Goals page)

 */
/* Global variables and constant variables ---------------------------------- */
const GOAL_TITLE = ["Career", "Financial", "Family", "Pleasure"];

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
/*
    Function Name: openGoal
    Description:   When a user click the vertical tab, change the detail view section
    Inputs:        inEvent - clicked tab element
                   inGoalSection - section id
    Output:        none

*/
function openGoal(inEventElement, inGoalSection) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(`div_${inGoalSection.toLowerCase()}`).style.display = "block";
  inEventElement.className += " active";
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  // init detail view section
  document.getElementById("btn_career").click();
};

// button career event
let eleBtnCareer = document.getElementById("btn_career");

eleBtnCareer.addEventListener("click", function() {
  openGoal(this, GOAL_TITLE[0]);
});

// button financial event
let eleBtnFinancial = document.getElementById("btn_financial");

eleBtnFinancial.addEventListener("click", function() {
  openGoal(this, GOAL_TITLE[1]);
});

// button family event
let eleBtnFamily = document.getElementById("btn_family");

eleBtnFamily.addEventListener("click", function() {
  openGoal(this, GOAL_TITLE[2]);
});

// button pleasure event
let eleBtnPleasure = document.getElementById("btn_pleasure");

eleBtnPleasure.addEventListener("click", function() {
  openGoal(this, GOAL_TITLE[3]);
});
