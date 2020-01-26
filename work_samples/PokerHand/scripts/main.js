/*
  Title: Retrieving API data
  Author: Neo Lee(W0435748)
  Date: Jan 24, 2020
  Description: 
    Using the publicly available Deck of Cards API, you will create a small JavaScript application that uses the API to provide data so that you can do the following.
      •	Retrieve a Deck of shuffled cards from the API.
      •	Initially pull 5 cards from the deck and display them in a web page.
      •	Write/research a function that takes the cards and shows the highest poker hand that can be calculated based on the 5 cards.
  Reference:
    - https://deckofcardsapi.com/
    - https://www.cardplayer.com/rules-of-poker/hand-rankings

*/

(() => {
  // INDEPENDENTLY iNVOKED FUNCTION EXPRESSION START
  "use strict";

  // define global variables -----------------------------------------------------
  let shuffleURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  let drawURL = "https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=<<count_num>>";
  let reshuffleURL = "https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/";

  let deckID = ""; // deck id for each player
  let cardCount = 5; // number of requesting cards
  let cardsData = null; // 5 cards information

  // define functions ------------------------------------------------------------
  // fetch API data about a deck of cards
  fetch(shuffleURL)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        alert("Cannot retrieve a deck!!!");
      }
    })
    .then(data => {
      retrieveDeckOfCard(data);
    });

  /*
  Function name: retrieveDeckOfCard
  Input: inData - shuffle data from API
  Return: none
  Description:
    1. A shuffle data from "Deck of Cards" and set deckID
    2. request cards data

*/
  function retrieveDeckOfCard(inData) {
    //console.log(inData);
    deckID = inData.deck_id;
    //console.log(deckID);
    drawURL = drawURL.replace("<<deck_id>>", deckID);
    drawURL = drawURL.replace("<<count_num>>", cardCount);
    //console.log(drawURL);

    // fetch API data about a deck of cards
    fetch(drawURL)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          alert("Cannot retrieve a deck!!!");
        }
      })
      .then(data => {
        //console.log(data);
        cardsData = data.cards;
        //console.log(cardsData);

        displayCards();
      });
  }

  /*
  Function name: displayCards
  Input: none
  Return: none
  Description:
    1. display cards image
    2. display cards name

*/
  function displayCards() {
    let strInnerHtml = "";
    let eleDiv = document.getElementById("deck_display");
    let rtnPokerHand = null;

    // display cards name and imange
    strInnerHtml += "<table width='100%'>";
    strInnerHtml += "<thead>";
    strInnerHtml += "<tr>";
    for (let i = 0; i < cardsData.length; i++) {
      strInnerHtml += "<th>";
      strInnerHtml += `${cardsData[i].suit} [ ${cardsData[i].value} ]`;
      strInnerHtml += "</th>";
    }
    strInnerHtml += "</tr>";
    strInnerHtml += "</thead>";
    strInnerHtml += "<tbody>";
    strInnerHtml += "<tr>";
    for (let i = 0; i < cardsData.length; i++) {
      strInnerHtml += "<td align='center'>";
      strInnerHtml += `<img src = "${cardsData[i].image}" />`;
      strInnerHtml += "</td>";
    }
    strInnerHtml += "</tr>";
    strInnerHtml += "</tbody>";
    strInnerHtml += "</table>";

    // display highest poker hand
    strInnerHtml += "<br /><br />";
    rtnPokerHand = highestPokerHand();
    strInnerHtml += `<h1 style="text-align:center;color:${rtnPokerHand[1]};font-size:${40 + rtnPokerHand[2] * 10}px">{ ${rtnPokerHand[0]} }</h1>`;

    eleDiv.innerHTML = strInnerHtml;
  }

  /*
  Function name: highestPokerHand
  Input: none
  Return: namePokerHand - name about user's poker hand
  Description:
    1. Royal flush
      A, K, Q, J, 10, all the same suit.
      A K Q J T
    2. Straight flush
      Five cards in a sequence, all in the same suit.
      8 7 6 5 4
    3. Four of a kind
      All four cards of the same rank.
      J J J J 7
    4. Full house
      Three of a kind with a pair.
      T T T 9 9
    5. Flush
      Any five cards of the same suit, but not in a sequence.
      4 J 8 2 9
    6. Straight
      Five cards in a sequence, but not of the same suit.
      9 8 7 6 5
    7. Three of a kind
      Three cards of the same rank.
      7 7 7 K 3
    8. Two pair
      Two different pairs.
      4 4 3 3 Q
    9. Pair
      Two cards of the same rank.
      A A 8 4 7
    10. High Card
      When you haven't made any of the hands above, the highest card plays.
      In the example below, the jack plays as the highest card.
      3 J 8 4 2

*/
  function highestPokerHand() {
    const POKER_HAND = [
      ["Royal flush", "red", 10],
      ["Straight flush", "orange", 9],
      ["Four of a kind", "green", 8],
      ["Full house", "blue", 7],
      ["Flush", "blueviolet", 6],
      ["Straight", "darkcyan", 5],
      ["Three of a kind", "darkslategray", 4],
      ["Two pair", "darkgrey", 3],
      ["Pair", "olive", 2],
      ["High Card", "black", 1]
    ];
    let cardCord = []; // for card code for deciding highest poker hand
    let checkFlag = true; // flag for each poker hand
    let suitFlag = true; // cards are in same suit

    // copy cards cord and sort
    for (let i = 0; i < cardsData.length; i++) {
      cardCord.push(cardsData[i].code);
    }
    cardCord.sort();
    console.log(cardCord);

    // test data
    // cardCord = ["0S","AS","JS","QS","KS"];  // Royal flash
    // cardCord = ["4S","5S","6S","7S","8S"];  // Splash flash
    // cardCord = ["AS","3S","8S","JS","KS"];  // flash
    // cardCord = ["JH","JD","JC","JS","7D"];  // Four of a kind
    // cardCord = ["0H","0D","0S","9C","9D"];  // full house
    // cardCord = ["7C","7D","7S","KC","3D"];  // three of a kind
    // cardCord = ["4C","4S","3C","3D","QC"];  // two pair
    // cardCord = ["AH","AD","8C","4S","7H"];  // pair
    // cardCord = ["9C","8D","7C","6D","5H"];  // straight
    // cardCord = ["3D","JC","8S","4H","2S"];  // High Card

    // conversion to straight number
    let numValues = [];

    for (let i = 0; i < cardCord.length; i++) {
      numValues.push(convertValueToNum(cardCord[i][0]));
    }
    numValues.sort((a, b) => a - b); // asending sort
    console.log(numValues);

    // check same suit
    for (let i = 0; i < cardCord.length - 1; i++) {
      // check same suit
      if (cardCord[i][1] !== cardCord[i + 1][1]) {
        suitFlag = false;
        break;
      }
    }

    if (suitFlag === true) {
      // check Royal flush
      const CARDS_VALUE = ["0", "A", "J", "Q", "K"];
      checkFlag = true;
      for (let i = 0; i < cardCord.length; i++) {
        // check each card
        if (cardCord[i][0] !== CARDS_VALUE[i]) {
          checkFlag = false;
          break;
        }
      }

      if (checkFlag === true) {
        return POKER_HAND[0];
      }

      // check Straight flush or flush
      for (let i = 0; i < cardCord.length - 1; i++) {
        // check each card
        if (numValues[i] + 1 !== numValues[i + 1]) {
          return POKER_HAND[4]; // flush
        }
      }

      return POKER_HAND[1]; // Straight flush
    } else {
      // not same suit
      let countSameRank = []; // store same rank count

      // count same rank
      let cntRank = 0;
      for (let i = 0; i < cardCord.length - 1; i++) {
        if (cardCord[i][0] === cardCord[i + 1][0]) {
          // same rank
          cntRank++;
          if (cardCord.length - 2 === i) {
            countSameRank.push(cntRank);
          }
        } else {
          countSameRank.push(cntRank);
          cntRank = 0;
        }
      }
      countSameRank.sort((a, b) => b - a);
      console.log(countSameRank);

      // decide poker hand
      if (countSameRank[0] === 3) {
        return POKER_HAND[2]; // four of a kind
      } else if (countSameRank[0] === 2) {
        if (countSameRank[1] === 1) {
          return POKER_HAND[3]; // full house
        }
        return POKER_HAND[6]; // three of a kind
      } else if (countSameRank[0] === 1) {
        if (countSameRank[1] === 1) {
          return POKER_HAND[7]; // two pair
        }
        return POKER_HAND[8]; // pair
      }

      // check Straight
      for (let i = 0; i < cardCord.length - 1; i++) {
        // check each card
        if (numValues[i] + 1 !== numValues[i + 1]) {
          return POKER_HAND[9]; // High Card
        }
      }
    }

    return POKER_HAND[5]; // Straight
  }

  /*
  Function name: convertValueToNum
  Input: inCardValue - string card value (0 ~ K)
  Return: numValue - number card value (1 ~ 13)
  Description:
    1. if string card value is not a number or 0
    2. convert using the switch condition

*/
  function convertValueToNum(inCardValue) {
    let numValue = parseInt(inCardValue);

    if (isNaN(numValue) || numValue === 0) {
      switch (inCardValue) {
        case "A":
          return 1;
        case "0":
          return 10;
        case "J":
          return 11;
        case "Q":
          return 12;
        case "K":
          return 13;
      }
    }

    return numValue;
  }
  // call functions --------------------------------------------------------------
  let eleBtnShuffle = document.getElementById("btn_shuffle");

  eleBtnShuffle.addEventListener("click", function() {
    // fetch reshuffle API data about a deck of cards
    reshuffleURL = reshuffleURL.replace("<<deck_id>>", deckID);

    fetch(reshuffleURL)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          alert("Cannot retrieve a deck!!!");
        }
      })
      .then(data => {
        retrieveDeckOfCard(data);
      });
  });
})(); // INDEPENDENTLY iNVOKED FUNCTION EXPRESSION END
