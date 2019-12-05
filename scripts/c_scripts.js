/* 
    Title:          Neo's portfolio (Final Project)
    Author:         Neo Lee (W0435748)
    Date:           Dec 02, 2019
    Description:    Make a personal portfolio pages (Contact page)

 */

/* Global variables and constant variables ---------------------------------- */
const JSON_FILENAME = "./json/countries.json"; // JSON input filename
const PATH_FLAG_IMG = "./flags/"; // flag image file path
var infoCountries = null; // array for all countries info

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
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
      infoCountries = JSON.parse(this.responseText);

      // Initialize the country select element
      initCountrySelector(infoCountries);
    }
  };

  // Initializes a request (get the myNotes.json file)
  requestHTTP.open("GET", JSON_FILENAME, true);

  // Sends the request
  requestHTTP.send();
}

/*
      Function Name: initCountrySelector
      Description:   All countries data are stored at the country selector element
      Inputs:        inInfoCountries - All countryies information from JSON file
      Output:        none
  
  */
function initCountrySelector(inInfoCountries) {
  // declare variables
  let txtHtml = "";

  // make innerHTML text
  txtHtml += `<option value="none">Select One ...</option>\n`;

  for (let i = 0; i < inInfoCountries.length; i++) {
    txtHtml += `<option value="${inInfoCountries[i].Name}|${inInfoCountries[i].Population}|${inInfoCountries[i].Area}">${inInfoCountries[i].Name}</option>\n`;
  }

  // get select element dom object
  let selCountry = document.getElementById("country");

  selCountry.innerHTML = txtHtml;
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  // Request JSON file data
  loadCountriesInfo();
};
