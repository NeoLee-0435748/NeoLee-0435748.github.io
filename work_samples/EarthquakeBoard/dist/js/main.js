"use strict";

/*
  title:  Earthquakes in the world
  date:   April 3, 2020
  Author: Neo Lee (w0435748)
  Desc:   PROG2700 final project
          Display the map for earthquakes during the specific period and also provide table version
          (following all guidelines from the assignment directions)
  Ref:    http://lab.ejci.net/favico.js/ - for favicon javascript api
          https://icons8.com/icons/set/favicon - download a free favicon
          https://www.w3schools.com/tags/tag_label.asp - label for input
          https://teamtreehouse.com/community/html-input-date-field-how-to-set-default-value-to-todays-date - get today
          https://www.geeksforgeeks.org/hide-or-show-elements-in-html-using-display-property/ - hide elements
          https://stackoverflow.com/questions/45812160/unexpected-comma-using-map - remove comma from map function result

*/

(() => {
  // variables -----------------------------------------------------------------
  //flag for map or table layout
  const LAYOUT_LIST = ["map", "table"];
  var layoutFlag = LAYOUT_LIST[0];
  //color list
  const COLOR_LIST = ['#2ECC71', '#F1C40F', '#F39C12', '#D35400'];
  //create map in leaflet and tie it to the div called 'theMap'
  var map = L.map('theMap').setView([-33.095962936305476, 14.625], 2);
  //favicon
  const ALERT_COLOR = ["green", "yellow", "orange", "red"];
  var greenFavicon = new Favico({
                                  animation : 'slide',
                                  bgColor: COLOR_LIST[0],
                                  textColor: '#FDFEFE',
                                });
  var yellowFavicon = new Favico({
                                  animation : 'fade',
                                  bgColor: COLOR_LIST[1],
                                  textColor: '#FDFEFE',
                                });
  var orangeFavicon = new Favico({
                                  animation : 'popFade',
                                  bgColor: COLOR_LIST[2],
                                  textColor: '#FDFEFE',
                                });
  var redFavicon = new Favico({
                                  animation : 'slide',
                                  position: 'up',
                                  bgColor: COLOR_LIST[3],
                                  textColor: '#FDFEFE',
                                });
  // json data URL                              
  var baseURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson";
  // original json data
  var originalJsonData = null;
  // geoJson data for drawing
  var featureCollectionData = {
                                "type": "FeatureCollection",
                                "features": [
                                ]
                              };
  // features data by filtered                            
  var featuresData = null;
  //geoJSON result data
  var geoJSONResult = null;

  // event functions -----------------------------------------------------------
  // after windows load
  window.onload = function() {
    makeDynamicHtml();  // make html section by using DOM

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);  // initialize leaflet map
    
    getEarthquakeData();  // get earthquake data from USGS
  }

  // warn level select changed
  const changeWarnLevel = () => {
    console.log('changeWarnLevel');
    redrawLayout();
  };

  // tsunami checkbox check
  const checkTsunami = () => {
    console.log('checkTsunami');
    redrawLayout();
  };

  // request button click
  const clickRequest = () => {
    console.log('clickRequest');
    //Initialize geoJSON
    featureCollectionData.features = [];
    geoJSONResult.clearLayers();

    getEarthquakeData();  // get earthquake data from USGS
  };

  // map layout button click
  const clickMapLayout = () => {
    if(layoutFlag !== LAYOUT_LIST[0]){
      layoutFlag = LAYOUT_LIST[0];  //map layout
      document.getElementById('map').style.display = 'block';
      document.getElementById('list').style.display = 'none';
      redrawLayout();
      // change button status
      document.getElementById('map-layout').disabled = true;
      document.getElementById('table-layout').disabled = false;
    }
  }

  // table layout button click
  const clickTableLayout = () => {
    if(layoutFlag !== LAYOUT_LIST[1]){
      layoutFlag = LAYOUT_LIST[1];  //table layout
      document.getElementById('map').style.display = 'none';
      document.getElementById('list').style.display = 'block';
      redrawLayout();
      // change button status
      document.getElementById('map-layout').disabled = false;
      document.getElementById('table-layout').disabled = true;
    }
  }

  // user functions ------------------------------------------------------------
  /*
    name:   redrawLayout
    input:  none
    output: none
    desc:   redraw layout rely on current layout
  */
  const redrawLayout = () => {
    if(layoutFlag !== LAYOUT_LIST[1]){
      //Initialize geoJSON
      featureCollectionData.features = [];
      geoJSONResult.clearLayers();
    }

    //draw the layout
    filterData(originalJsonData);
  }

  /*
    name:   makeDynamicHtml
    input:  none
    output: none
    desc:   make title and search area by DOM
  */
  const makeDynamicHtml = () => {
    var strInnerHtml = '';

    // make the title section
    var eleTitle = document.getElementById("title");

    strInnerHtml = '<h1>EARTHQUAKE BOARD</h1>';
    eleTitle.innerHTML = strInnerHtml;

    // make the search section
    var eleSearch = document.getElementById("search-opt");

    strInnerHtml  = '<form id="search-form">';
    strInnerHtml += '<table>';
    strInnerHtml += '<tbody>';
    strInnerHtml += '<tr>';
    strInnerHtml += '<td>';
    strInnerHtml += '<label for="start-date">Start Date  </label>';
    strInnerHtml += '<input type="date" id="start-date" name="start-date">';
    strInnerHtml += '</td>';
    strInnerHtml += '<td>';
    strInnerHtml += '<label for="end-date">End Date  </label>';
    strInnerHtml += '<input type="date" id="end-date" name="end-date">';
    strInnerHtml += '</td>';
    strInnerHtml += '<td>';
    strInnerHtml += '<label for="warn-lvl">Warning Level  </label>';
    strInnerHtml += '<select id="warn-lvl">';
    strInnerHtml += '<option value="all">All Levels</option>';
    strInnerHtml += '<option value="green">Green</option>';
    strInnerHtml += '<option value="yellow">Yellow</option>';
    strInnerHtml += '<option value="orange">Orange</option>';
    strInnerHtml += '<option value="red">Red</option>';
    strInnerHtml += '</select>';
    strInnerHtml += '</td>';
    strInnerHtml += '<td>';
    strInnerHtml += '<input type="checkbox" id="tsunami" name="tsunami" disabled>';
    strInnerHtml += '<label for="tsunami">Only Tsunami</label>';
    strInnerHtml += '</td>';
    strInnerHtml += '<td>';
    strInnerHtml += '<button type="button" id="request">Request</button>';
    strInnerHtml += '</td>';
    strInnerHtml += '</tr>';
    strInnerHtml += '</tbody>';
    strInnerHtml += '</table>';
    strInnerHtml += '</form>';

    eleSearch.innerHTML = strInnerHtml;

    // make the buttons for select layout
    var eleSelLayout = document.getElementById("sel-layout");

    strInnerHtml  = '<button type="button" id="map-layout">Map</button>';
    strInnerHtml += '<button type="button" id="table-layout">Table</button>';

    eleSelLayout.innerHTML = strInnerHtml;

    // set two dates elements
    var endDate = new Date();
    var startDate = new Date();
    var eleEndDate = document.getElementById('end-date');
    var eleStartDate = document.getElementById('start-date');

    startDate.setDate(endDate.getDate() - 30);
    eleEndDate.setAttribute('value', getTextDate(endDate));
    eleStartDate.setAttribute('value', getTextDate(startDate));

    // set events for level, tsunami, request
    document.getElementById('warn-lvl').addEventListener('change', changeWarnLevel, false);
    document.getElementById('tsunami').addEventListener('click', checkTsunami, false);
    document.getElementById('request').addEventListener('click', clickRequest, false);

    // set events for layout buttons
    document.getElementById('map-layout').addEventListener('click', clickMapLayout, false);
    document.getElementById('table-layout').addEventListener('click', clickTableLayout, false);
    document.getElementById('map-layout').disabled = true;
  }

  /*
    name:   getEarthquakeData
    input:  none
    output: none
    desc:   get earthquake data from USGS
  */
  const getEarthquakeData = () => {
    var startDate = document.getElementById('start-date').value;
    var endDate = document.getElementById('end-date').value;
    var fetchDataURL = `${baseURL}&starttime=${startDate}&endtime=${endDate}`;
    
    //console.log(fetchDataURL);
    fetch(fetchDataURL)
    .then(response => response.json())
    // .then(json => filterRawData(json));
    .then(json => {
      originalJsonData = json;
      //console.dir(originalJsonData);
      drawMap(json);
      // check tsunami information exist
      const cb3 = (featuresData) => featuresData.properties.tsunami !== 0;

      // tsunami information exist
      if(json.features.some(cb3)){
        document.getElementById('tsunami').disabled = false;
      } else {
        document.getElementById('tsunami').disabled = true;
      }

      // filter json data
      filterData(json);
    });
  }

  /*
    name:   filterData
    input:  json - source json data from JSGS
    output: none
    desc:   filter json data rely on selected options
  */
  const filterData = json => {
    // get selected warning level
    var eleWarnLevel = document.getElementById('warn-lvl');
    var selWarnLevel = eleWarnLevel.options[eleWarnLevel.selectedIndex].value;
    // get tsunami checkbox state
    var checkTsunami = document.getElementById('tsunami').checked;
    
    //console.log(selWarnLevel);
    
    // filter data
    const cb = featuresData => {
      if(selWarnLevel === "all"){
        if(checkTsunami === true){
          return featuresData.properties.alert !== selWarnLevel && featuresData.properties.tsunami !== 0;
        } else {
          return featuresData.properties.alert !== selWarnLevel;
        }
      } else {
        if(checkTsunami === true){
          return featuresData.properties.alert === selWarnLevel && featuresData.properties.tsunami !== 0;
        } else {
          return featuresData.properties.alert === selWarnLevel;
        }
      }
    }

    featuresData = json.features.filter(cb);
    //console.dir(featuresData);

    // push features to collection
    const cb2 = (feature) => {
      featureCollectionData.features.push(feature);
    };

    featuresData.map(cb2);
    console.dir(featureCollectionData);

    if(layoutFlag === LAYOUT_LIST[0]){  // map
      drawMap();
    } else {  // table
      drawTable();
    }

    // set favicon rely on the count of the alert level
    if(eleWarnLevel.selectedIndex !== 0){
      setFavicon(ALERT_COLOR[eleWarnLevel.selectedIndex - 1], featuresData.length);
    }
  }

  /*
    name:   drawMap
    input:  none
    output: none
    desc:   draw earthquake map based on the filtered data
  */
  const drawMap = () => {
    // draw map
    //for all each features(click event for popup)
    const fnOnEachFeature = (feature, layer) => {
      // does this feature have a property named popupContent?
      // if (feature.properties && feature.properties.popupContent) {
      if (feature.properties) {
          let popupContent = `<a href="${feature.properties.url}" target="_blank">Detail Info</a>`;
          layer.bindPopup(popupContent).openPopup();
      }
    }

    //add markers with custom icon
    const fnPointToLayer = (feature, latlng) => {
      // geojson marker option
      var geojsonMarkerOptions = {
        radius: 6,
        fillColor: "#2277ee",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      // circle radius rely on signal value
      geojsonMarkerOptions.radius = feature.properties.sig / 100;

      // circle color rely on alert level
      if(feature.properties.alert === ALERT_COLOR[0]) {
        geojsonMarkerOptions.fillColor = COLOR_LIST[0]; // green
      } else if(feature.properties.alert === ALERT_COLOR[1]) {
        geojsonMarkerOptions.fillColor = COLOR_LIST[1]; // yellow
      } else if(feature.properties.alert === ALERT_COLOR[2]) {
        geojsonMarkerOptions.fillColor = COLOR_LIST[2]; // orange
      } else if(feature.properties.alert === ALERT_COLOR[3]) {
        geojsonMarkerOptions.fillColor = COLOR_LIST[3]; // red
      }

      return L.circleMarker(latlng, geojsonMarkerOptions);
    }

    // draw geoJSON data at the map
    geoJSONResult = L.geoJSON(featureCollectionData, {
      onEachFeature: fnOnEachFeature,
      pointToLayer: fnPointToLayer
    }).addTo(map);
  }

  /*
    name:   drawTable
    input:  none
    output: none
    desc:   draw earthquake map based on the filtered data
  */
  const drawTable = () => {
    var strInnerHtml = '';

    // make the title section
    var eleListDetail = document.getElementById('list-detail');

    // make table body
    const cb = (data, idx) => {
      return `<tr>
      <td>${idx + 1}</td>
      <td>${data.properties.alert === null ? '' : data.properties.alert}</td>
      <td>${data.properties.tsunami !== 0 ? 'Yes' : 'No'}</td>
      <td>${data.properties.title}</td>
      <td>${new Date(data.properties.time)}</td>
      <td><a href='${data.properties.url}' target='_blank'>${data.properties.code}</a></td>
      <td><a href='${data.properties.detail}' target='_blank'>${data.properties.ids}</a></td>
      </tr>`;
    };

    // make table for detail list
    strInnerHtml  = '<table>';
    // head part
    strInnerHtml += '<thead>';
    strInnerHtml += '<tr>';
    strInnerHtml += '<th>No</th>';
    strInnerHtml += '<th>Alert</th>';
    strInnerHtml += '<th>Tsunami</th>';
    strInnerHtml += '<th>Title</th>';
    strInnerHtml += '<th>Time</th>';
    strInnerHtml += '<th>Detail URL</th>';
    strInnerHtml += '<th>Detail geoJSON</th>';
    strInnerHtml += '</tr>';
    strInnerHtml += '</thead>';
    // body part
    strInnerHtml += '<tbody>';
    strInnerHtml += featuresData.map(cb).join('');
    strInnerHtml += '</tbody>';
    strInnerHtml += '</table>';

    eleListDetail.innerHTML = strInnerHtml;
    //console.log(strInnerHtml);
  }
  
  /*
    name:   setFavicon
    input:  alertLevel - decide to display what kind of favicon
            count - how many alerts
    output: none
    desc:   display favicon depends on alert level
  */
  const setFavicon = (alertLevel, count) => {
    if(alertLevel === ALERT_COLOR[0]) {  // green
      greenFavicon.badge(count);
    } else if(alertLevel === ALERT_COLOR[1]) {  // yellow
      yellowFavicon.badge(count);
    } else if(alertLevel === ALERT_COLOR[2]) {  // orange
      orangeFavicon.badge(count);
    } else if(alertLevel === ALERT_COLOR[3]) {  // red
      redFavicon.badge(count);
    }
  }

  /*
    name:   getDate
    input:  date - Date
    output: none
    desc:   get text format date (yyyy/mm/dd)
  */
  const getTextDate = (date) => {
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();
  
    if(dd<10) {
        dd = '0'+dd
    } 
  
    if(mm<10) {
        mm = '0'+mm
    } 
  
    var textDate = yyyy + '-' + mm + '-' + dd;
    // console.log(textDate);

    return textDate;
  }
})(); //self executing function