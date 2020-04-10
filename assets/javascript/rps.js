$(document).ready(function () {

//-------------MAIN TITLE ANIMATION FROM ANIME.JS-----------------//
var ml4 = {};
ml4.opacityIn = [0,1];
ml4.scaleIn = [0.2, 1];
ml4.scaleOut = 3;
ml4.durationIn = 800;
ml4.durationOut = 600;
ml4.delay = 500;

anime.timeline({loop: true})
  .add({
    targets: '.ml4 .letters-1',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-1',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4 .letters-2',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-2',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4 .letters-3',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-3',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4 .letters-4',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-4',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4',
    opacity: 0,
    duration: 500,
    delay: 500
  });

//---------ID Selectors and Descriptions-------------------------//

//----modal----------
// #inputName --- enter name
// #start-game --- submit button for name entry

//----player/name display-------
// #player1Name --- player 1 name
// #player2Name --- player 2 name

//----chat display---------------
// #chatArea --- displays entered chat messages
// #enterMessage --- both players use form and button to send messages

//----player 1 display-----------------
// #button1Group --- player 1's rps button display (rock, paper, scissors)
// #player1wins --- win total
// #player1ties --- tie total
// #player2losses --- loss total
// #notify1 --- player 1 display

//-----Main Update Display --------
// #notifyMain --- main display

//----player 2 display------------------------------------
// #button2Group -- player 2's rps button display (rock,paper, scissors)
// #player2wins --- win total
// #player2ties --- tie total
// #player2losses --- loss total
// #notify2 --- tells player to select or wait for next player 

//--------------FIREBASE-------------------------------
     var config = {
        apiKey: "AIzaSyBUmcws3MT-Y6iHtku4CyaNezOx-e9GfTs",
        authDomain: "rock-paper-scissors-9a32e.firebaseapp.com",
        databaseURL: "https://rock-paper-scissors-9a32e.firebaseio.com",
        projectId: "rock-paper-scissors-9a32e",
        storageBucket: "rock-paper-scissors-9a32e.appspot.com",
        messagingSenderId: "147598109544",
        appId: "1:147598109544:web:3ce65e15e08f75a8f784dd",
        measurementId: "G-7QGZR4SK1S"
    };
    firebase.initializeApp(config);

//----------trees/children in firebase---------------------------------
// players:  database.ref("/players/")
        // players : 
                // player(1 or 2)
                        //name
                        //choice
                        //win
                        //loss
                        //tie
// chat: database.ref("/chat/")
// player turn: database.ref("/playerTurn/")
// end of round: database.ref("/roundOutcome/")

//--------------create variable to reference firebase-----------------------
var database = firebase.database();

//-----------Variables--------------------------------------------
//----------player objects----------------
var p1 = null;
var p2 = null;
//--------------names---------------------------------
var p1Name = "";
var p2Name = "";
//-------------player name in browser--------------------
var userName = ""; 
//-------------turn-----------------
var playerTurn = 1;
//-------------player selection---------------------------
var p1Choice = "";
var p2Choice = "";

//-------------modal opens at document load-----------------------

$("#openingModal").modal("show");

//---------------database listener for player names-----------------
// player listener
database.ref("/players/").on("value", function(snapshot) {
    
    // check database for player 1
    if (snapshot.child("p1").exists()) {
        console.log("player 1 logged in");
    
    // set local variables for player 1
    p1 = snapshot.val().p1;
    p1Name = p1.name;
    
    // display player 1's name and scores
    $("#player1Name").html(p1Name);
    $("#player1Header").html(p1Name);
    $(".player1stats").html(`Wins: ${p1.wins} Ties: ${p1.ties} Losses: ${p1.losses} `);

    // wait for player 2 to log in
    $("#notifyMain").html("Waiting for Player 2")
    $("#notify1").html("Waiting For Player 2");
    
    } else {
        console.log("player 1 not in database");
        p1 = null; 
        p1Name = "";

    }

    // check database for player 2
    if (snapshot.child("p2").exists()) {
        console.log("player 2 logged in");

    //set local variables for player 2
    p2 = snapshot.val().p2;
    p2Name = p2.name;
    // display player 2's name and scores
    $("#player2Name").html(p2Name);
    $("#player2Header").html(p2Name);
    $(".player2stats").html(`Wins: ${p2.wins} Ties: ${p2.ties} Losses: ${p2.losses} `);

    } else {
        console.log("player 2 not in database");
        p2 = null;
        p2Name = "";
    } 

    // if both players are logged in, assign turn and start
    if (p1 && p2) {
        console.log ("both players logged in");
        
        //update main display 
        $("#notifyMain").html("Rock! Paper! Scissors! Shoot!");
        //update both players
        $("#notify1").html("It is your turn!");
        $("#notify2").html("Wait...");   
    }
    
    if (!p1 && !p2) {
        $("#player1wins").html("Wins: 0");
        $("#player1ties").html("Ties: 0");
        $("#player1losses").html("Losses: 0");
        $("#notify1").html("");

        $("#player2wins").html("Wins: 0");
        $("#player2ties").html("Ties: 0");
        $("#player2losses").html("Losses: 0");
        $("#notify2").html("");

        $("#chatArea").empty();
        
        database.ref("/chat/").remove();
        database.ref("/playerTurn/").remove();
        database.ref("/roundOutcome/").remove();
        database.ref("/players/").remove();
    }
});

//-------------------database listener for player turns--------------------

database.ref("/playerTurn/").on("value", function(snapshot) {

    //default is playerTurn = 1;
    if(snapshot.val() === 1) {
        console.log("turn1");
        $("#notify1").html("Choose Wisely");
        playerTurn = 1;
        $("#button1Group").removeClass("invisible");
        $("#button2Group").addClass("invisible");
        //highlights player card when it is their turn
        $(".player1card").addClass("turn1");
        $("#player1Header").addClass("headerTurn1");
        $("#player1Header").addClass("glow");
        $(".player2card").removeClass("turn2");
        $("#player2Header").removeClass("headerTurn2");
        $("#player2Header").removeClass("glow");
        //both players must be logged in
    if (p1 && p2) {
        $("#notify2").html("Please Wait");
        }   
    } else if (snapshot.val() === 2) {
    //same for player 2
        console.log("turn2");
        $("#notify2").html("Choose Wisely");
        playerTurn = 2;
        $("#button1Group").addClass("invisible");
        $("#button2Group").removeClass("invisible");
        //highlights player card when it is their turn
        $(".player2card").addClass("turn2");
        $("#player2Header").addClass("headerTurn2");
        $("#player2Header").addClass("glow");
        $(".player1card").removeClass("turn1");
        $("#player1Header").removeClass("headerTurn1");
        $("#player1Header").removeClass("glow");
    if (p1 && p2) {
        $("#notify1").html("Please Wait")
        }
    } else if (snapshot.val() === 3) {
        console.log("turn3");
        compare(p1.choice, p2.choice);
    }
});

//-------------player log in-----------------------------------------

//player enters name

$("#start-game").on("click", function(event) {
    event.preventDefault();

    //-------prevents player from submitting without entering name------------
    var play;
    play = document.getElementById("inputName").value;
    if (play === "") {
        alert("Please Enter a Name");
        return false;
    }
    //--------hides modal after player entry---------------
    $("#inputName").text("");
    $("#openingModal").modal("hide");

    if (p1 === null) {
        console.log("player 1 added");

        userName = $("#inputName").val().trim();
        //build player object for database
        p1 = {
            name: userName,
            wins: 0,
            losses: 0,
            ties: 0,
            choice: "",
        };
       //send object to database
       database.ref().child("/players/p1").set(p1);
       //set turn in datbase to player 1
       database.ref().child("/playerTurn").set(1);
       //upon player 1 disconnect
       database.ref("/players/p1").onDisconnect().remove();

    }  
        //if player 1 exists and player 2 is null, player 2 then added
     else if ((p1 != null) && (p2 === null)) {
         console.log("player 2 added");

         userName = $("#inputName").val().trim();
         //build player object
         p2 = {
             name: userName,
             wins: 0,
             losses: 0,
             ties: 0,
             choice: "",
         };
         //send object to database
         database.ref().child("/players/p2").set(p2);
         //upon user disconnect
         database.ref("/players/p2").onDisconnect().remove();
     } else if ((p1 != null) && (p2 != null)) {
        alert("Sorry! The Game is Full!")
     }
})

//------------------Chat Section---------------------------
//-------------listener for "/messages/"---------------
//chat display and build chat--------------
database.ref("/chat/").on("child_added", function (snapshot) {
//build message
$("#chatArea").append("<p>" + snapshot.val().chat + "</p>")
});

//---------if a user disconnects------------------------------
database.ref("/players/").on("child_removed", function(snapshot) {
    $("#chatArea").append("<p>" + snapshot.val().name + " has logged off");
});

//players sending messges-----------------
$("#enterMessage").on("click", function (event) {
        if (event.keyCode === 13) {
        $("#enterMessage").click();
        }
//this automatically scrolls the chat display to the bottom every time a message is sent
        
        $('#chatArea').animate({
        scrollTop: $('#chatArea')[0].scrollHeight
        }, "slow");
        event.preventDefault();
            
        //message input
        var chat = userName + ": " + $("#inputMessage").val();
        $("#inputMessage").val("");
        console.log(chat);
        //push to database
        database.ref("/chat/").push({
        chat: chat,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
        })

//-------------player selections-----------------------------------------

$(".select").on("click", function(event) {
    event.preventDefault();
    //----------------player 1 selections--------------------
    // both players must be active for selections
    if (p1 && p2 && (userName === p1.name) && (playerTurn === 1)) {
        // takes data value from button
        var choice = $(this).attr("data-choice");
        console.log(choice);
        p1Choice = choice;

        //send to database
        database.ref().child("/players/p1/choice").set(choice);
        
        //set turn to 2
        playerTurn = 2;
        database.ref().child("playerTurn").set(2);
    }
    //-------------player 2 selections------------------------
    if (p1 && p2 && (userName === p2.name) && (playerTurn === 2)) {
        //takes data from button
        var choice = $(this).attr("data-choice");
        console.log(choice);
        p2Choice = choice;

        //send to database
        database.ref().child("/players/p2/choice").set(choice);
        playerTurn = 3;
        database.ref().child("playerTurn").set(3);
        console.log("ok")
    }
});

//----------compare choices--------------------------------------

function compare(p1Choice, p2Choice) {
    var playerOneWon = function() {
        if (p1) {
 
            console.log("player 1 wins");
            database.ref().child("/players/p1/wins").set(p1.wins + 1);
            database.ref().child("/players/p2/losses").set(p2.losses + 1);
            $("#notifyMain").html(p1Name + " Wins!");
            $("#notify1").html("You Win!");
            $("#notify2").html("You Lose!");
        }
    };

    var playerTwoWon = function() {
        if (p2) {
  
            console.log("player 2 wins");
            database.ref().child("/players/p1/losses").set(p1.losses + 1);
            database.ref().child("/players/p2/wins").set(p2.wins + 1);
            $("#notifyMain").html(p2Name + " Wins!");
            $("#notify1").html("You Lose!");
            $("#notify2").html("You Win!");
        }
    };

    var tie = function()  {

        console.log("tie");
        database.ref().child("/players/p1/ties").set(p1.ties + 1);
        database.ref().child("/players/p2/ties").set(p2.ties + 1);
        $("#notifyMain").html("Tie Game!");
        $("#notify1").html("Draw!");
        $("#notify2").html("Draw!");
    }
    if((p1Choice === "rock1" && p2Choice === "rock2") ||
    (p1Choice === "paper1" && p2Choice === "paper2") ||
    (p1Choice === "scissors1" && p2Choice === "scissors2")) {
        tie ();
    } else if ((p1Choice === "rock1" && p2Choice === "scissors2") ||
    (p1Choice === "paper1" && p2Choice === "rock2") ||
    (p1Choice === "scissors1" && p2Choice === "paper2")) {
        playerOneWon();
    } else if ((p1Choice === "rock1" && p2Choice === "paper2") ||
    (p1Choice === "paper1" && p2Choice === "scissors2") ||
    (p1Choice === "scissors1" && p2Choice === "rock2")) {
        playerTwoWon();
    }    setTimeout(function()  {
        $("#notifyMain").html("Rock! Paper! Scissors! Shoot!")
        playerTurn = 1;
        database.ref().child("/playerTurn/").set(1);
    }, 3000);
}
})
