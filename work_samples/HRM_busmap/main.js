(function () {
  //declare global variables
  //json data
  var savedJson;

  //timer
  var myTimer;

  //bus icon
  var busIcon = L.icon({
    iconUrl: "bus.png",
    iconSize: [35, 35],
    iconAnchor: [18, 25],
    popupAnchor: [0, -25],
  });

  //geoJSON data
  var geojsonFeature = {
    type: "FeatureCollection",
    features: [],
  };

  //geoJSON result data
  var geoJSONResult;

  //select condtion
  var eleTextSelectdRoute = document.getElementById("route-selected");
  var eleSelectSelectRoute = document.getElementById("route-select");
  var selectedBusRoute = "";

  //Display a map in the browser. (You’ll be given starter files for this)
  //create map in leaflet and tie it to the div called 'theMap'
  var map = L.map("theMap").setView([44.690627, -63.60914], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //display bus routes in 1 - 10
  const displayBusRoutes = () => {
    //Fetch real-time transit data information data from a publicly available API. (Flight or Bus data)

    fetch("https://hrmbusapi.herokuapp.com")
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.json())
      .then((json) => {
        savedJson = json;
        filterRawData();
      })
      .catch((error) => {
        console.log("Looks like there was a problem: \n", error);
      });
  };

  //Filter the raw data to a subset with specific criteria.
  //keep buses on routes from 1 to 10 only
  const filterRawData = () => {
    //Initialize geoJSON
    geojsonFeature.features = [];

    //print original data
    const cb = (entityData) => {
      if (selectedBusRoute === "") {
        return true;
      } else {
        return entityData.vehicle.trip.routeId == selectedBusRoute;
      }
    };

    createGeoJSONData(savedJson.entity.filter(cb));
    initSelect();
  };

  // ref: https://wsvincent.com/javascript-remove-duplicates-array/
  //      https://answers.acrobatusers.com/sorting-problem-alphabetic-number-q104744.aspx
  const initSelect = () => {
    // bus select component initialize
    let optionsHTML = `<option value="">All routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>`;

    // make route list
    const cb = (entityData) => entityData.vehicle.trip.routeId;

    let routesObj = savedJson.entity.map(cb);
    // console.log(routesObj);

    const cb1 = (routesData, element) => routesObj.indexOf(routesData) === element;
    const cb2 = (a, b) => {
      if (a > b) return 1;
      if (a < b) return -1;
      // a must be equal to b
      return 0;
    };

    let sortedRoutes = routesObj.filter(cb1).sort(cb2);
    // console.log(sortedRoutes);

    const cb3 = (routes) => `<option value="${routes}">Route ${routes}</option>`;

    optionsHTML += sortedRoutes.map(cb3);

    eleSelectSelectRoute.innerHTML = optionsHTML;
  };

  //Convert the filtered API data into GeoJSON format.
  // ref: https://stackoverflow.com/questions/30579655/generating-geojson-with-javascript
  //      https://scotch.io/bar-talk/copying-objects-in-javascript
  //      https://leafletjs.com/reference-1.6.0.html#marker
  //      https://github.com/Leaflet/Leaflet/issues/3238
  const createGeoJSONData = (rawData) => {
    // console.log(rawData);
    // clear all previous markers
    if (geoJSONResult) {
      geoJSONResult.clearLayers();
    }

    //declare basic featureData object
    let featureData = {
      type: "Feature",
      properties: {
        tripId: "",
        bearing: 0,
        popupContent: "", // label:XXX, Speed:XXX
      },
      geometry: {
        type: "Point",
        coordinates: [],
      },
    };

    //make a all feature data for the buses in route 1 to 10
    const cb = (rawData) => {
      //set properties data
      featureData.properties.tripId = rawData.vehicle.trip.tripId;
      featureData.properties.bearing = rawData.vehicle.position.bearing ? rawData.vehicle.position.bearing : 0;
      featureData.properties.popupContent = `<p>RouteID: ${rawData.vehicle.trip.routeId}<br />Lable: ${rawData.vehicle.vehicle.label}<br />Speed: ${
        rawData.vehicle.position.speed ? rawData.vehicle.position.speed.toFixed(2) : "0"
      } mph<br />Bearing: ${rawData.vehicle.position.bearing ? rawData.vehicle.position.bearing : 0}</p>`;
      //set geometry data
      featureData.geometry.coordinates = [];
      featureData.geometry.coordinates.push(`${rawData.vehicle.position.longitude}`);
      featureData.geometry.coordinates.push(`${rawData.vehicle.position.latitude}`);

      geojsonFeature.features.push(JSON.parse(JSON.stringify(featureData))); // copy rfeatureData object to features collection object
    };

    rawData.forEach(cb); // forEach is better than map becuase featureData doesn't belong to rawData
    // rawData.map(cb);

    //print GeoJSON data
    console.log(geojsonFeature);
    //plot all markers for the buses
    plotMarkers();
  };

  const plotMarkers = () => {
    //for all each features(click event for popup)
    const fnOnEachFeature = (feature, layer) => {
      // does this feature have a property named popupContent?
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    };

    //add markers with custom icon
    const fnPointToLayer = (feature, latlng) => {
      return L.marker(latlng, { icon: busIcon, rotationAngle: feature.properties.bearing, draggable: false });
    };

    //Plot markers on the map to display the current position of vehicles.
    geoJSONResult = L.geoJSON(geojsonFeature, {
      onEachFeature: fnOnEachFeature,
      pointToLayer: fnPointToLayer,
    }).addTo(map);

    // each 7 seconds after receiving data, redraw the map with new data
    myTimer = setTimeout(displayBusRoutes, 7000);
  };

  //Add functionality that will cause the map to auto refresh after a certain interval of time
  displayBusRoutes();

  //select event
  const changedSelectRoute = (event) => {
    console.log("select onchange");
    //kill the previous timer
    if (myTimer) clearTimeout(myTimer);

    selectedBusRoute = event.target.value;
    eleTextSelectdRoute.value = event.target.options[event.target.selectedIndex].text;
    filterRawData();
  };

  eleSelectSelectRoute.addEventListener("change", changedSelectRoute);
})();
