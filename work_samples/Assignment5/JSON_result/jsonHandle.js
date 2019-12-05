"use strict";

/*
    Title:          JSON file handling (Final Assignment)
    Author:         Neo Lee (W0435748)
    Date:           Nov 26, 2019
    Description:    Read a json file and display data to a table
    Key point:      1) Get the select result JSON data from server using XMLHttpRequest, asyncronize function,
                    2) Display data to rlt_tbl div section using table structure

*/

// get body tag element
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  requestSeverData();
};

function requestSeverData() {
  // filename
  let fileName = "sample.json";
  // Retrieve data from a URL without having to do a full page refresh
  let requestHttp = new XMLHttpRequest();

  // An EventHandler that is called whenever the readyState attribute changes.
  requestHttp.onreadystatechange = function() {
    // check server (readyState: 4-The operation is complete, status: 200-DONE)
    if (this.readyState == 4 && this.status == 200) {
      // store JSON data from server to the localStorage
      localStorage.rltData = this.responseText;

      // call displayTable function
      displayTable();
    }
  };

  // Initializes a request (get the ?.json file)
  requestHttp.open("GET", fileName, true);

  // Sends the request
  requestHttp.send();
}

/*
    Function Name: displayTable
    Description:   read result data from localStorage and display result data to the table structure
    Inputs:        none
    Output:        none
    
*/
function displayTable() {
  // read localStarage data and parse
  let selectRlt = JSON.parse(localStorage.rltData);
  // get div elements for table
  let tbResults = document.getElementById("rlt_tbl");

  // make table header structure
  let strInnerHtml = "";
  strInnerHtml += "<h3>Data from JSON</h3>";
  strInnerHtml += "<table>";
  strInnerHtml += "<thead>";
  strInnerHtml += "<tr>";

  // table header is created by JSON keys
  for (let data in selectRlt) {
    let realData = selectRlt[data];
    for (let key in realData) {
      if (data === "0") {
        strInnerHtml += `<th>${key}</th>`;
      }
    }
  }
  strInnerHtml += "</tr>";
  strInnerHtml += "</thead>";
  strInnerHtml += "<tbody>";

  // make rows for each data from JSON data
  for (let data in selectRlt) {
    let realData = selectRlt[data];
    strInnerHtml += "<tr>";
    for (let key in realData) {
      // get the data from selectRlt
      strInnerHtml += `<td>${realData[key]}</td>`;
    }
    strInnerHtml += "</tr>";
  }

  // make table footer
  strInnerHtml += "</tbody>";
  strInnerHtml += "</table>";

  // display JSON table in tbResults div tag
  tbResults.innerHTML = strInnerHtml;
}

/*
// reference about getting key and data
var data = JSON.parse('{"c":{"a":{"name":"cable - black","value":2}}}')

for (var event in data) {
    var dataCopy = data[event];
    for (data in dataCopy) {
        var mainData = dataCopy[data];
        for (key in mainData) {
            if (key.match(/name|value/)) {
                alert('key : ' + key + ':: value : ' + mainData[key])
            }
        }
    }
}​
*/
