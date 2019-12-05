"use strict";

/*
    Title:          Neo's portfolio (Final Project)
    Author:         Neo Lee (W0435748)
    Date:           Dec 01, 2019
    Description:    Make a personal portfolio pages

*/

/* Flexable design ---------------------------------------------------------- */
let elebody = document.getElementsByTagName("body")[0];

elebody.onload = function() {
  random_position();
};

/*
    Function:       random_position
    Description:    buttons position decide randomly
    input:          none
    output:         none
*/
function random_position() {
  const MIN_NUM = 3;
  const MAX_NUM = 7;
  const MULTIPLY_NUM = 5;
  let eleContact = document.getElementById("contact");
  let eleGoals = document.getElementById("goals");
  let eleSkills = document.getElementById("skills");
  let eleResume = document.getElementById("resume");
  let eleWorks = document.getElementById("works");

  //The maximum is exclusive and the minimum is inclusive (1 to 9)
  eleContact.style.marginTop = `${(Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM) * MULTIPLY_NUM}%`;
  eleGoals.style.marginTop = `${(Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM) * MULTIPLY_NUM}%`;
  eleSkills.style.marginTop = `${(Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM) * MULTIPLY_NUM}%`;
  eleResume.style.marginTop = `${(Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM) * MULTIPLY_NUM}%`;
  eleWorks.style.marginTop = `${(Math.floor(Math.random() * (MAX_NUM - 1)) + MIN_NUM) * MULTIPLY_NUM}%`;
}

/* button events ------------------------------------------------------------ */
// Contact
let eleBtnContact = document.getElementById("btn_contact");

eleBtnContact.addEventListener("click", function() {
  window.open("./contact.html", "_self");
});

// Goals
let eleBtnGoals = document.getElementById("btn_goals");

eleBtnGoals.addEventListener("click", function() {
  window.open("./goals.html", "_self");
});

// skills
let eleBtnSkills = document.getElementById("btn_skills");

eleBtnSkills.addEventListener("click", function() {
  window.open("./skills.html", "_self");
});

// resume
let eleBtnResume = document.getElementById("btn_resume");

eleBtnResume.addEventListener("click", function() {
  window.open("./resume.html", "_self");
});

// resume
let eleBtnWorks = document.getElementById("btn_works");

eleBtnWorks.addEventListener("click", function() {
  window.open("./work_sample.html", "_self");
});
