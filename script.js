let holeDiv = $(".hole");
let holes = [...holeDiv];
let score = 0;
let lastHole;
let timeUp = false;
let hole;
let time;

//on page load
$(document).ready(function() {
  //set up the game
  setUpGame();
});

//function to set up the game board
setUpGame = () => {
  //hide game div
  $(".game").hide();
  //hide the buttons div
  $(".buttons").hide();
  //hide the score counter
  $(".show-score").hide();
  //change body background color
  $("body").addClass("bkgd-img");
  //swt the holes background image
  $(".hole").css("background", `url('img/cars.png') bottom center no-repeat`);
  //set the mascot image
  $(".mascot").css(
    "background",
    `url('img/mayhem.png') bottom center no-repeat`
  );
};

//function to get a random hole -- logic adapated from https://medium.com/@peterchic/design-to-development-f4087b97ade0
findRandHole = () => {
  //set the index as randomization of the hole divs
  let i = Math.floor(Math.random() * holes.length);
  //hole is the index of the hole divs
  hole = holes[i];
  //if at the last hole, run the function again
  if (hole === lastHole) {
    return findRandHole(holes);
  }
  lastHole = hole;
  return hole;
};

//function to set the time interval of mascot movement. time interval increases as the score increases rather than with level of the game. this makes the game appear more random.
setTime = () => {
  //if the score is between 0 and 15
  if (score > 0 && score < 10) {
    //set the time to 1200ms
    time = 1200;
    //if the score is between 15 and 35
  } else if (score > 11 && score < 35) {
    //set the time to 1000ms
    time = 1100;
    //if the score is greater than 35
  } else if (score > 35) {
    //set the time to 600ms
    time = 800;
  }
};

//function to show the mascots - timer and timeout logic adapted from https://medium.com/@peterchic/design-to-development-f4087b97ade0
showMascot = () => {
  //run the set time function
  setTime();
  //assign findRandHole function to hole variable in order to have the mascot appear at random
  hole = findRandHole();
  //for each hole that the mascot appears in, apply the popup class
  $(hole).addClass("popup");
  //when the set interval ends
  setTimeout(() => {
    //remove the popup class from the hole
    $(hole).removeClass("popup");
    //remove the add score class
    $(".score").removeClass("add-score");
    // if the time isn't up, repeat the function
    if (!timeUp) showMascot();
  }, time);
};

//function to group together css selector changes during game play
changeElements = () => {
  //hide the onload div
  $(".onload").hide();

  //show the hole div
  $(".hole").show();
  //show the game div
  $(".game").show();
  //show the score div
  $(".show-score").show();
  //remove the body background iamage
  $("body").removeClass("bkgd-img");
  //remove class add-score from score div
  $(".score").removeClass("add-score");
  //hide the footer
  $(".footer").hide();
};

//function to begin the game - initiated by event handler
beginWhacking = () => {
  //run the change elements function to prepare the UI
  changeElements();
  // run the find random hole function
  findRandHole();
  // run the function to show the mascot
  showMascot();
  //display the scorer in the score div
  $(".score").text(score);
  timeUp = false;
  //run the function to increase the score
  increaseScore();
  //when the set interval for the game ends
  setTimeout(() => {
    timeUp = true;
    //run the function to count the final score
    countScore();
    //show certain hidden elements
    showElements();
    //hide certain unneeded elements
    hideElements();
  }, 15000);
};

//function to group hidden css selectors
hideElements = () => {
  //hide the game div
  $(".game").hide();
  //hide the who wants to win image
  $(".wwtw").hide();
  //hide the show score div
  $(".show-score").hide();
  //hide the start button
  $(".start").hide();
  //hide the mascots image
  $(".mascots-img").hide();
};

//function to group unhidden css selectors
showElements = () => {
  //show the onload spash
  $(".onload").show();
  //add the background image back to the body
  $("body").addClass("bkgd-img");
  //show the final score div
  $(".final-score").show();
  //show the buttons div
  $(".buttons").show();
  //show the reset game button
  $(".reset-game").show();
};

//function to increase the score
increaseScore = e => {
  //if the time interval is still running
  if (!timeUp) {
    //add add-score class to the score div to flash the score with each increase
    $(".score").addClass("add-score");
    //increase the score by 1
    score++;
    //show the increased score in the score div
    $(".score").text(score);
  }
};

//function to count the score
countScore = () => {
  //if the level-three class exists, hide it. This allows the button to be hidden when the player has finished level 3.
  if ($(".level-three")) {
    $(".level-three").hide();
  }
  //if score between 0 and 5
  if (score > 0 && score < 5) {
    //display the player's final score
    $(".final-score").text(`Your score: ${score}`);
    //display a score message
    $(".score-message").text("Nice try, but the competition won.");
    //hide the next button
    $(".next").hide();
  } else if (
    //if the score is between 5 and 20, or the score is greater than or equal to 20 and the next button text is blank
    (score > 5 && score < 20) ||
    (score >= 20 && $(".next").html() === "&nbsp;")
  ) {
    //display the player's final score
    $(".final-score").text(`Your score: ${score}`);
    //display a score message
    $(".score-message").text("Okay...you're starting to get the hang of it...");
    //show the next button, change the class to Level Two to support the event handler and add Level Two to the text
    $(".next")
      .show()
      .addClass("level-two")
      .text("Level Two");
  } else if (
    //if the score is greater than or equal to 20 and the Level Two button exists
    score >= 20 &&
    $(".level-two").text() === "Level Two"
  ) {
    //display the player's final score
    $(".final-score").text(`Your score: ${score}`);
    //display a score message
    $(".score-message").text("Fantastic job whacking the competition!");
    //change the class from Level Two to Level Three to support the event handler and add Level Three to the text
    $(".level-two")
      .removeClass("level-two")
      .addClass("level-three")
      .text("Level Three");
  }
};

//for each hole div, when the mascot div is clicked
$(".hole").on("click", ".mascot", function(e) {
  e.preventDefault();
  //increase the score
  increaseScore();
  //slide the mascot div down
  $(".mascot").slideDown();
});

// when the start button is pressed, run the beginWhacking function
$(".start").on("click", beginWhacking);

//for the button div, if the level-two button is clicked
$(".buttons").on("click", ".level-two", function() {
  //change the background image of the hole divs and set the background size
  $(".hole").css({
    background: "url('img/dirt.png') bottom center no-repeat",
    "background-size": "contain"
  });
  $("#mayhem").remove();
  //change the mascot image in the mascot div
  $(".mascot").css(
    "background",
    `url('img/gecko.png') bottom center no-repeat`
  );
  //run the function to begin the game
  beginWhacking();
});

//for the button div, if the level-three button is clicked
$(".buttons").on("click", ".level-three", function() {
  //change the background image of the hole divs and set the background size
  $(".hole").css({
    background: "url('img/prog.png') bottom center no-repeat",
    "background-size": "contain"
  });
  //change the mascot image in the mascot div
  $(".mascot").css("background", `url('img/flo.png') bottom center no-repeat`);
  //run the function to begin the game
  beginWhacking();
});

//when the reset-game button is clicked
$(".reset-game").on("click", () => {
  //return the score to 0
  score = 0;
  //run the setup game function
  setUpGame();
  //run the function to begin the game
  beginWhacking();
});

// //jquery media query handler for dynamically created elements - unable to change the sizes in css file.
// $(window).resize(function() {
//   //assign a width variable that returns the width of the window
//   let width = $(window).width();
//   //if the window width is greater than 1600px
//   if (width > 1600) {
//     //adjust the background sizes of the mascot and hole divs
//     $(".mascot").css("background-size", "80%");
//     $(".hole").css("background-size", "70%");
//   } else {
//     //if it is less than 1600px, reduce the background sizes of the mascot and hole divs
//     $(".mascot").css("background-size", "35%");
//     $(".hole").css("background-size", "85%");
//   }
// });
