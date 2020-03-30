 // Your web app's Firebase configuration
 $(document).ready(function () {
    //open the modal!
    $("#openingModal").modal('show');
    $("#chatArea").hide();
    //initialize firebase
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

    //---------trees/children in firebase---------
    //players: database.ref("/players/")
    //chat:  database.ref("/messages/")
    //player turn: database.ref("/playerTurn/")
    //end of round: database.ref("/endRound/") 

    //-----------Global variables-------------
    // player names
    var player1name = "";
    var player2name = "";
    // player in user browser
    var yourName = "";
    // turn
    var playerTurn = 1;
    // objects for both players
    var player1 = null;
    var player2 = null;
    // player choices
    // var player1select = "";
    // var player2select = "";
    
    //create a variable to reference the database
    var database = firebase.database();


  //-----------------database listeners---------------------


  //listener for "/player/" changes
     //watcher to log name 
     database.ref("/players/").on("value", function(snapshot) {
         //check for player 1 logged in
        if (snapshot.child("player1").exists()) {
            console.log("Player 1 exists");
           //begin player object
           player1 = snapshot.val().player1;
           player1name = player1.name;
           //update display
           $("#player1name").html(player1name);
           $("#button1Group").removeClass("invisible");
           $("#round-update-2").html("Waiting for Player 2"); 
        } else {
            player1 = null;
            player1name = "";
            //update display
        //    $("#round-update-1").html("Waiting for Player 1"); 
           $("#player1Header").removeClass("cardTurn"); 
           $("#player2Header").removeClass("cardTurn");  
           $("#player1wins").html("Wins: 0");
           $("#player1losses").html("Losses: 0");
        }
        if (snapshot.child("player2").exists()) {
            console.log("Player 2 exists");
            //begin player object
            player2 = snapshot.val().player2;
            player2name = player2.name;
            //update display
            $("#player2name").html(player2name);
            $("#button2Group").removeClass("invisible");
         } else {
             player2 = null;
             player2name = "";
            //  //update display
            // $("#round-update-2").html("Waiting for Player 2"); 
            $("#player1Header").removeClass("cardTurn"); 
            $("#player2Header").removeClass("cardTurn");  
            $("#player2wins").html("Wins: 0");
            $("#player2losses").html("Losses: 0");   
         }
         //both players logged in, assign turn
         if (player1 && player2) {
            //  //player1's turn by default
            // playerTurn = 1;
            $("#player1Header").addClass("cardTurn");
            $("#round-update-1").html("It's Your Turn!");
            $("#choose-button-1").html("Choose Wisely...");
            $("#round-update-2").html("Not Your Turn!");
            $("#choose-button-2").html("Wait For It...");
         }
         //disconnect
         if (!player1 && !player2) {
            $("#player1Header").removeClass("cardTurn"); 
            $("#player2Header").removeClass("cardTurn");  
            $("#player2wins").html("Wins: 0");
            $("#player2losses").html("Losses: 0");
            $("#chatArea").empty();
            database.ref("/messages/").remove();
            database.ref("/playerTurn/").remove();
            database.ref("/endRound/").remove();  
            database.ref("/players/").remove();
         }
    });
        //chat display and build chat
        database.ref("/messages/").on("child_added", function (snapshot) {
        //build message
        $("#chatArea").append("<p>" + snapshot.val().playerName + ": " + snapshot.val().message + "</p>")
      });

        //listener for turn changes
        database.ref("/playerTurn/").on("value", function(snapshot) {
            if (snapshot.val() === 1) {
                console.log("turn1");
                playerTurn = 1;
                if (player1 && player2) {
                    $("#player1Header").addClass("cardTurn");
                    $("#round-update-1").html("It's Your Turn!");
                    $("#choose-button-1").html("Choose Wisely...");
                    $("#round-update-2").html("Not Your Turn!");
                    $("#choose-button-2").html("Wait For It...");
                } else if (snapshot.val() === 2) {
                console.log("turn2");
                playerTurn = 2;
                if (player1 && player2) {
                    $("#player2Header").addClass("cardTurn");
                    $("#round-update-2").html("It's Your Turn!");
                    $("#choose-button-2").html("Choose Wisely...");
                    $("#round-update-1").html("Not Your Turn!");
                    $("#choose-button-1").html("Wait For It...");
                }
                }
            }
        })
        
      //--------------BUTTON EVENTS---------------------------------------
      //player input
            //Name
    $("#start-game").on("click", function (event) {
        event.preventDefault();
    //-------------------------------------------------
    //prevents player from pressing submit without entering name
    var play;
    play = document.getElementById("inputName").value;
    if (play == "") {
      alert("Please Enter a Name");
      return false;
    }
    // hide the modal!
    $("#openingModal").modal('hide');
    //empty that chatArea!
    $("#chatArea").empty();
    // -----------------------------------------------------
    // if (($("#inputName").val().trim() !== "") && !(player1 && player2) ) {
    //     //player 1
        if (player1 === null) {
            yourName = $("#inputName").val().trim();
        //build player1 object
            player1 = {
                name: yourName,
                wins: 0,
                losses: 0,
                choice: ""
            };
        //add player1 to database
            database.ref().child("/players/player1").set(player1);
        //set turn to player 1 in database
            database.ref().child("/playerTurn/").set(1);
        // upon disconnect
            database.ref("/players/player1").onDisconnect().remove();
        } else if ( (player1 != null) && (player2 === null)) {
            yourName = $("#inputName").val().trim();
        //build player2 object
            player2 = {
                name: yourName,
                wins: 0,
                losses: 0,
                choice: ""
            };
             //add player2 to database
             database.ref().child("/players/player2").set(player2);
             //set turn to player 2 in database
                 database.ref().child("/playerTurn/").set(2);
             // upon disconnect
                 database.ref("/players/player2").onDisconnect().remove();
        }
    })





    //retrieve inputs from player --- build a player
    //Name
    // $("#start-game").on("click", function (event) {
    //     event.preventDefault();
    // //-------------------------------------------------
    // //prevents player from pressing submit without entering name
    // var play;
    // play = document.getElementById("inputName").value;
    // if (play == "") {
    //   alert("Please Enter a Name");
    //   return false;
    // }
    // // hide the modal!
    // $("#openingModal").modal('hide');
    // //empty that chatArea!
    // $("#chatArea").empty();
    // // -----------------------------------------------------
    // //get input for name
    // var name = $("#inputName").val().trim();
    // console.log(name);
    // database.ref("/playerName").set({
    //     name : name,
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP
    // });
    
   
        // var player1 = null;
        // player1 = snapshot.val().name;
        // console.log(player1);
        // 
        // player1object = {
        //     name: player1,
        //     choice: "" ,
        //     wins: 0,
        //     losses: 0,
    // })
    // database.ref("/playerName").on("child_added", function(snapshot) {
    // if (snapshot.child("name").exists()) {
    //     var player2 = null;
    //     player2 = snapshot.val().name;
    //     console.log(player2);
    //     $("#player2name").html(player2);
    //     player2object = {
    //         name: player2,
    //         choice: "" ,
    //         wins: 0,
    //         losses: 0,
    //     }
    //     $("#button2Group").removeClass("invisible");
    //     $("#round-update-2").html("Make a Selection!");
    //     $("#round-update-1").html("Make a Selection!");
    // } else {
    //     console.log("TESTESTESTEST");
    //     $("#button1Group").removeClass("invisible");
    //     $("#round-update-2").html("Player 2 Not Logged in")
//     }
// })
    // if (player1 = !null) {
    //     $("#button1Group").removeClass("invisible");
    //     $("#round-update-2").html("Player 2 Not Logged in")
    // } else {
    //     $("#button2Group").removeClass("invisible");
    //     $("#round-update-2").html("Make a Selection!");
    //     $("#round-update-1").html("Make a Selection!");
//     })
// })
    // 
    //select
    //read rock,paper,scissors button clicks
    //variable player1select holds player 1 choice btwn rock,paper,scissors
    // $(".select").on("click", function (event) { 
    //     var player1select = $(this).attr("data-choice");
    //     event.preventDefault();
    //     console.log(player1select);
 })