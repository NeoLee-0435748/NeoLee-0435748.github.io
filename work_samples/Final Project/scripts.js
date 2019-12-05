/*
  Student Name:   Neo Lee(W0435748)
  Date:           Nov 28, 2019  
  Program Title:  COUNTRIES OF THE WORLD
*/

/* Global variables and constant variables ---------------------------------- */
const JSON_FILENAME = "countries.json"; // JSON input filename
const PATH_FLAG_IMG = ".\\flags\\"; // flag image file path
var infoCountries = null; // array for all countries info

/* error handling ----------------------------------------------------------- */

/* common function ---------------------------------------------------------- */
/*
    Function Name: DisplayCountryData
    Description:   When a user select a country, display a flag image and country name
    Inputs:        inCountryInfo - a country info what a user selected (Name, Population, Area)
    Output:        none

*/
function DisplayCountryData(inCountryInfo) {
  // change a country flag
  let eleCountryFlag = document.getElementById("img_country_flag");

  eleCountryFlag.style.display = "";
  eleCountryFlag.src = PATH_FLAG_IMG + inCountryInfo[0].replace(new RegExp(" ", "g"), "_") + ".png";
  eleCountryFlag.alt = inCountryInfo[0] + " flag";

  // change a country name
  let eleCountryName = document.getElementById("h2_country_name");

  eleCountryName.innerHTML = inCountryInfo[0];
}

/*
    Function Name: DisplayPopulationData
    Description:   When a user select a country, display a population data
                   - Population
                   - Area in (if needed, call CalculateAreaInKm)
                   - Populataion density
                   - Percentage of world population (call CalculateTotalWorldPopulation)
    Inputs:        inCountryInfo - a country info what a user selected (Name, Population, Area)
    Output:        none

*/
function DisplayPopulationData(inCountryInfo) {
  // get elements objects
  let elePopulation = document.getElementById("txt_country_pop");
  let elePercentage = document.getElementById("txt_percentage");

  // Display population
  elePopulation.value = parseInt(inCountryInfo[1]).toLocaleString();

  // Display country area
  DisplayAreaIn(inCountryInfo);

  // Display population density
  DisplayPopulationDensity(inCountryInfo);

  // Display percentage of world population
  elePercentage.value = ((parseFloat(inCountryInfo[1]) / CalculateTotalWorldPopulation()) * 100.0).toFixed(3) + " %";
}

/*
    Function Name: CalculateTotalWorldPopulation
    Description:   Calculate total world population for percentage of world population
    Inputs:        none
    Output:        totalPopulation (float)

*/
function CalculateTotalWorldPopulation() {
  let totalWorldPopulation = 0.0;

  // Add all countries population
  for (let i = 0; i < infoCountries.length; i++) {
    totalWorldPopulation += parseFloat(infoCountries[i].Population);
  }

  return totalWorldPopulation;
}

/*
    Function Name: CalculateAreaInKm
    Description:   Calculate area in kilometer
                   - ratio: mile:kilometer=1:2.589988110336
    Inputs:        inSqMiles - square miles from a country info
    Output:        areaInKm (float)

*/
function CalculateAreaInKm(inSqMiles) {
  return parseFloat(inSqMiles) * 2.589988110336;
}

/*
    Function Name: DisplayAreaIn
    Description:   Display area in info depends on the selector
    Inputs:        inCountryInfo - a country info what a user selected (Name, Population, Area)
    Output:        none

*/
function DisplayAreaIn(inCountryInfo) {
  let eleCountryArea = document.getElementById("txt_country_area");
  let areaInUnit = document.getElementById("sel_country_square").value;

  // Display country area
  if (areaInUnit === "1") {
    // sq. miles
    try {
      eleCountryArea.value = parseFloat(inCountryInfo[2]).toFixed(1);
      if (isNaN(eleCountryArea.value)) {
        throw "Value is not a number!";
      }
    } catch (e) {
      eleCountryArea.value = "";
      // alert("Select a country first!!!");
    }
  } else if (areaInUnit === "2") {
    // sq. KM
    try {
      eleCountryArea.value = CalculateAreaInKm(inCountryInfo[2]).toFixed(1);
      if (isNaN(eleCountryArea.value)) {
        throw "Value is not a number!";
      }
    } catch (e) {
      eleCountryArea.value = "";
      // alert("Select a country first!!!");
    }
  }
}

/*
    Function Name: DisplayPopulationDensity
    Description:   Display population density depends on the checked radio 
    Inputs:        inCountryInfo - a country info what a user selected (Name, Population, Area)
    Output:        none

*/
function DisplayPopulationDensity(inCountryInfo) {
  let eleDensity = document.getElementById("txt_density");

  // Display population density
  if (document.getElementById("rdo_density1").checked) {
    // sq. miles
    try {
      eleDensity.value = (parseFloat(inCountryInfo[1]) / parseFloat(inCountryInfo[2])).toFixed(2);
      if (isNaN(eleDensity.value)) {
        throw "Value is not a number!";
      }
    } catch (e) {
      eleDensity.value = "";
      // alert("Select a country first!!!");
    }
  } else if (document.getElementById("rdo_density2").checked) {
    // sq. KM
    try {
      eleDensity.value = (parseFloat(inCountryInfo[1]) / CalculateAreaInKm(inCountryInfo[2])).toFixed(2);
      if (isNaN(eleDensity.value)) {
        throw "Value is not a number!";
      }
    } catch (e) {
      eleDensity.value = "";
      // alert("Select a country first!!!");
    }
  }
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
  let selCountry = document.getElementById("sel_country");

  selCountry.innerHTML = txtHtml;
}

/* DOM events --------------------------------------------------------------- */
// Body onload event
let eleBody = document.getElementsByTagName("body")[0];

eleBody.onload = function() {
  // Request JSON file data
  loadCountriesInfo();
  // flag image to blank
  let eleCountryFlag = document.getElementById("img_country_flag");
  eleCountryFlag.style.display = "none";
};

// sel_country select event
let eleSelCountry = document.getElementById("sel_country");

eleSelCountry.addEventListener("change", function() {
  // Choose Select One
  if (this.value === "none") {
    // init right side field
    document.getElementById("img_country_flag").style.display = "none";
    document.getElementById("h2_country_name").innerHTML = "";
    document.getElementById("txt_country_pop").value = "";
    document.getElementById("txt_country_area").value = "";
    document.getElementById("txt_density").value = "";
    document.getElementById("txt_percentage").value = "";
  } else {
    // push a country info to the array
    let arrCountryInfo = this.value.split("|");

    // display country data
    DisplayCountryData(arrCountryInfo);

    // display country population data
    DisplayPopulationData(arrCountryInfo);
  }
});

// sel_country_square select event
let eleSelCountrySq = document.getElementById("sel_country_square");

eleSelCountrySq.addEventListener("change", function() {
  DisplayAreaIn(document.getElementById("sel_country").value.split("|"));
});

// rdo_density1 radio event
let eleRdoDensity1 = document.getElementById("rdo_density1");

eleRdoDensity1.addEventListener("change", function() {
  DisplayPopulationDensity(document.getElementById("sel_country").value.split("|"));
});

// rdo_density2 radio event
let eleRdoDensity2 = document.getElementById("rdo_density2");

eleRdoDensity2.addEventListener("change", function() {
  DisplayPopulationDensity(document.getElementById("sel_country").value.split("|"));
});

// btn_wiki button event
let eleBtnWiki = document.getElementById("btn_wiki");

eleBtnWiki.addEventListener("click", function() {
  let baseURL = "https://en.wikipedia.org/wiki/";
  let countryURL = document
    .getElementById("sel_country")
    .value.split("|")[0]
    .replace(new RegExp(" ", "g"), "_");

  if (countryURL === "none") {
    alert("Select a country first!!!");
  } else {
    window.open(baseURL + countryURL, "_blank");
  }
});
