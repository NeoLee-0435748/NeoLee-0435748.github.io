(() => {
  // declare constant variables
  const ST_EMPTY = "state-empty";
  const ST_1 = "state-1";
  const ST_2 = "state-2";
  const CHECK_RLT_MSG = ["  So far so good", "  Something is wrong", "  You did it!!"];
  const MIN_CELL_SIZE = 3;
  const MAX_CELL_SIZE = 6;

  // declare global variables
  // let fetchURL = "https://www.mikecaines.com/3inarow/sample.json";  // for static data
  let fetchURL = "https://www.mikecaines.com/3inarow/puzzle.php"; // for dynamic data
  let gameData;
  let cellSize = 3; //for zooming
  let state1Color = "#0000ff"; //blue
  let state2Color = "#ffffff"; //white

  // fetch data
  fetch(fetchURL)
    .then((response) => response.json())
    .then((json) => {
      gameData = json;
      console.log(gameData);
      initGame();
    });

  // intialize the game
  const initGame = () => {
    // get div element
    let eleDiv = document.getElementById("theGame");
    let tblInnerHtml = "";
    let cellProp = "";

    // draw the title
    tblInnerHtml += "<h2>[Game - Three In A Row]</h2>";
    // draw a table
    tblInnerHtml += "<table id='main-tbl'><tbody>";
    for (let i = 0; i < gameData.rows.length; i++) {
      tblInnerHtml += "<tr>";
      cellProp = "";
      for (let j = 0; j < gameData.rows[i].length; j++) {
        // set enalbe or disable the cell
        if (!gameData.rows[i][j].canToggle) {
          cellProp = `class="state-${gameData.rows[i][j].correctState}"`;
        } else {
          cellProp = `class="${ST_EMPTY}"`;
        }

        tblInnerHtml += `<td ${cellProp}></td>`;
      }
      tblInnerHtml += "</tr>";
    }

    tblInnerHtml += "</tbody></table>";
    // console.log(tblInnerHtml);

    //drawButton
    tblInnerHtml += "<br /><br />";
    tblInnerHtml += "<div>";
    tblInnerHtml += "<button id='check-btn'>Check</button>";

    //drawText
    tblInnerHtml += "<label id='message-lbl'></label>";
    tblInnerHtml += "<br /><br />";

    //drawCheckbutton
    tblInnerHtml += "<input type='checkbox' id='show-chk'></input>";
    tblInnerHtml += "<label for='show-chk'> Show incorrect squares</label>";
    tblInnerHtml += "<hr />";
    tblInnerHtml += "<br />";

    //zoom button
    tblInnerHtml += "<button id='zoomin-btn'>Zoom In</button>";
    tblInnerHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    tblInnerHtml += "<button id='zoomout-btn'>Zoom Out</button>";
    tblInnerHtml += "<br /><br />";
    tblInnerHtml += "<hr />";

    //color picker
    tblInnerHtml += "<p>Choose state colors:</p>";
    tblInnerHtml += `<input type="color" id="state1-color" value=${state1Color}>`;
    tblInnerHtml += "<label for='state1-color'> State1</label>";
    tblInnerHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    tblInnerHtml += `<input type="color" id="state2-color" value=${state2Color}>`;
    tblInnerHtml += "<label for='state2-color'> State2</label>";
    tblInnerHtml += "</div>";

    eleDiv.innerHTML = tblInnerHtml;

    //add event listener for color pickers
    document.getElementById("state1-color").addEventListener("change", state1Change, false);
    document.getElementById("state2-color").addEventListener("change", state2Change, false);
  };

  // events from window
  // ref: https://stackoverflow.com/questions/29042140/click-on-html-table-and-get-row-number-with-javascript-not-jquery
  //      https://www.w3schools.com/jsref/prop_html_classname.asp
  //      https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color
  const clickWindow = (target) => {
    console.dir(target);

    //click at td in table -----------------------------------------------------
    if (target.tagName === "TD") {
      let clickedRow = target.parentNode.rowIndex;
      let clickedCol = target.cellIndex;
      let clickedClass = target.className;
      let canToggle = gameData.rows[clickedRow][clickedCol].canToggle;

      // console.log(clickedRow);
      // console.log(clickedCol);
      // console.log(clickedClass);
      // console.log(canToggle);
      console.log("td has been clicked");

      if (canToggle) {
        if (clickedClass === "state-empty") {
          target.className = ST_1;
          target.style.backgroundColor = state1Color;
          gameData.rows[clickedRow][clickedCol].currentState = 1;
        } else if (clickedClass === "state-1") {
          target.className = ST_2;
          target.style.backgroundColor = state2Color;
          gameData.rows[clickedRow][clickedCol].currentState = 2;
        } else {
          target.className = ST_EMPTY;
          target.style.backgroundColor = "#808080";
          gameData.rows[clickedRow][clickedCol].currentState = 0;
        }

        //show incorrect suqares
        let eleCheckbox = document.getElementById("show-chk");
        if (document.getElementById("show-chk").checked) {
          if (target.className !== ST_EMPTY) {
            if (gameData.rows[clickedRow][clickedCol].currentState !== gameData.rows[clickedRow][clickedCol].correctState) {
              target.innerHTML = "X";
            } else {
              target.innerHTML = "";
            }
          } else {
            target.innerHTML = "";
          }
        }
      }

      //check result
      document.getElementById("message-lbl").innerHTML = "";
      // console.log(target.className);
    }

    //click check button -------------------------------------------------------
    if (target.id === "check-btn") {
      let eleTableRows = Array.from(document.getElementById("main-tbl").children[0].rows);
      let correctCnt = 0;
      let incorrectCnt = 0;
      let wholeCnt = 0;

      console.log("check button has been pressed");
      // console.dir(eleTableRows);

      for (let i = 0; i < gameData.rows.length; i++) {
        let eleTableCells = Array.from(eleTableRows[i].cells);
        for (let j = 0; j < gameData.rows[i].length; j++) {
          wholeCnt += 1;
          if (gameData.rows[i][j].currentState === gameData.rows[i][j].correctState) {
            correctCnt += 1;
          } else {
            if (eleTableCells[j].className !== ST_EMPTY) {
              incorrectCnt += 1;
            }
          }
        }
      }

      //check result
      let eleP = document.getElementById("message-lbl");
      if (incorrectCnt > 0) {
        eleP.innerHTML = CHECK_RLT_MSG[1];
        eleP.style.color = "red";
      } else if (correctCnt === wholeCnt) {
        eleP.innerHTML = CHECK_RLT_MSG[2];
        eleP.style.color = "black";
      } else {
        eleP.innerHTML = CHECK_RLT_MSG[0];
        eleP.style.color = "blue";
      }
    }

    //click show incorrect squares checkbox ------------------------------------
    if (target.id === "show-chk") {
      let eleTableRows = Array.from(document.getElementById("main-tbl").children[0].rows);

      console.log("checkbox has been checked");

      // check box has been checked
      if (target.checked) {
        for (let i = 0; i < gameData.rows.length; i++) {
          let eleTableCells = Array.from(eleTableRows[i].cells);
          for (let j = 0; j < gameData.rows[i].length; j++) {
            if (gameData.rows[i][j].currentState !== gameData.rows[i][j].correctState) {
              if (eleTableCells[j].className !== ST_EMPTY) {
                eleTableCells[j].innerHTML = "X";
              }
            }
          }
        }
      } else {
        for (let i = 0; i < gameData.rows.length; i++) {
          let eleTableCells = Array.from(eleTableRows[i].cells);
          for (let j = 0; j < gameData.rows[i].length; j++) {
            eleTableCells[j].innerHTML = "";
          }
        }
      }
    }

    //click zoom out button ----------------------------------------------------
    if (target.id === "zoomout-btn") {
      let eleTds = document.querySelectorAll("td");
      if (--cellSize < MIN_CELL_SIZE) {
        cellSize = MIN_CELL_SIZE;
        return;
      }

      console.dir(eleTds);
      eleTds.forEach((td) => {
        td.style.width = `${cellSize}rem`;
        td.style.height = `${cellSize}rem`;
        td.style.fontSize = `${cellSize - 1}rem`;
      });
    }

    //click zoom in button -----------------------------------------------------
    if (target.id === "zoomin-btn") {
      let eleTds = document.querySelectorAll("td");
      if (++cellSize > MAX_CELL_SIZE) {
        cellSize = MAX_CELL_SIZE;
        return;
      }

      console.dir(eleTds);
      eleTds.forEach((td) => {
        td.style.width = `${cellSize}rem`;
        td.style.height = `${cellSize}rem`;
        td.style.fontSize = `${cellSize - 1}rem`;
      });
    }
  };

  //state1 color picker change event -------------------------------------------
  const state1Change = (event) => {
    console.log(`state1 color is changed (${event.target.value})`);
    if (event.target.value === state2Color || event.target.value === "#808080") {
      event.target.value = state1Color;
    } else {
      let eleTds = document.querySelectorAll("td");
      state1Color = event.target.value;

      console.dir(eleTds);
      eleTds.forEach((td) => {
        if (td.className === "state-1") {
          td.style.backgroundColor = state1Color;
        }
      });
    }
  };

  //state2 color picker change event -------------------------------------------
  const state2Change = (event) => {
    console.log(`state2 color is changed (${event.target.value})`);
    if (event.target.value === state1Color || event.target.value === "#808080") {
      event.target.value = state2Color;
    } else {
      let eleTds = document.querySelectorAll("td");
      state2Color = event.target.value;

      console.dir(eleTds);
      eleTds.forEach((td) => {
        if (td.className === "state-2") {
          td.style.backgroundColor = state2Color;
        }
      });
    }
  };

  //add window event listener
  window.addEventListener("load", () => {
    window.addEventListener("click", () => clickWindow(event.target), false);
  });
})(); //self executing function
