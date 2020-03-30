 // Your web app's Firebase configuration
 $(document).ready(function () {
    //open the modal!
    $("#openingModal").modal('show');
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
    var player1select = "";
    var player2select = "";
    
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
        //    $("#player1Header").removeClass("cardTurn"); 
        //    $("#player2Header").removeClass("cardTurn");  
        //    $("#player1wins").html("Wins: 0");
        //    $("#player1losses").html("Losses: 0");
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
            // $("#player1Header").removeClass("cardTurn"); 
            // $("#player2Header").removeClass("cardTurn");  
            // $("#player2wins").html("Wins: 0");
            // $("#player2losses").html("Losses: 0");   
         }
         //both players logged in, assign turn
         if (player1 && player2) {
            //  //player1's turn by default
            // playerTurn = 1;
            // $("#player1Header").addClass("cardTurn");
            $("#round-update-1").html("It's Your Turn!");
            $("#choose-button-1").html("Choose Wisely...");
            $("#round-update-2").html("Not Your Turn!");
            $("#choose-button-2").html("Wait For It...");
         }
         //disconnect
         if (!player1 && !player2) {
            // $("#player1Header").removeClass("cardTurn"); 
            // $("#player2Header").removeClass("cardTurn");  
            $("#player2wins").html("Wins: 0");
            $("#player2losses").html("Losses: 0");
            $("#player1wins").html("Wins: 0");
            $("#player1losses").html("Losses: 0");
            $("#chatArea").empty();
            database.ref("/messages/").remove();
            database.ref("/playerTurn/").remove();
            database.ref("/endRound/").remove();  
            database.ref("/players/").remove();
         }
    });

        //-------------listener for "/messages/"---------------
        //chat display and build chat
        database.ref("/messages/").on("child_added", function (snapshot) {
        //build message
        $("#chatArea").append("<p>" + snapshot.val().message + "</p>")
      });

        //listener for turn changes
        database.ref("/playerTurn/").on("value", function(snapshot) {
            if (snapshot.val() === 1) {
                console.log("turn1");
                playerTurn = 1;
                if (player1 && player2) {
                    // $("#player1Header").addClass("cardTurn");
                    // $("#player2Header").removeClass("cardTurn");
                    $("#round-update-1").html("It's Your Turn!");
                    $("#choose-button-1").html("Choose Wisely...");
                    $("#round-update-2").html("Not Your Turn!");
                    $("#choose-button-2").html("Wait For It...");
                } 
                else if (snapshot.val() === 2) {
                console.log("turn2");
                playerTurn = 2;
                if (player1 && player2) {
                    // $("#player1Header").removeClass("cardTurn");
                    // $("#player2Header").addClass("cardTurn");
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
    // $("#chatArea").empty();
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
                //  database.ref().child("/playerTurn/").set(2);
             // upon disconnect
                 database.ref("/players/player2").onDisconnect().remove();
        }
    })

    //------------------Chat Section---------------------------

    $("#enterMessage").on("click", function(event) {
        if (event.keyCode === 13) {
            $("#enterMessage").click();
          }
          //this automatically scrolls the chat display to the bottom every time a message is sent
          $('#chatArea').animate({
            scrollTop: $('#chatArea')[0].scrollHeight
          }, "slow");
          event.preventDefault();
            //message input
          var message = yourName + ": " + $("#inputMessage").val();
          $("#inputMessage").val("");
          console.log(message);
          //push to database
          database.ref("/messages/").push({
              message : message,
              dateAdded: firebase.database.ServerValue.TIMESTAMP})
 })
    //-------------selecting RPS------------------------
    //player1---------------------
    $(".select").on("click", function (event) { 
        event.preventDefault();
        //both players must be in to make selections
        if (player1 && player2 && (yourName === player1.name) && (playerTurn === 1)) {
            var select = $(this).attr("data-choice");
            player1select = select;
        $("#button1Group").hide();
        //push to database
        database.ref().child("/players/player1/choice").set(select);
        playerTurn = 2;
        database.ref().child("/playerTurn/").set(2);
        }
    //player2------------------------------
        else {//(player1 && player2 && (yourName === player2.name) && (playerTurn === 2)) 
            var select = $(this).attr("data-choice");
            player2select = select;
        $("#button2Group").hide();
        //push to database
        database.ref().child("/players/player2/choice").set(select);
        endRound();
        }
});

    function endRound() {
        if  ((player1.choice === "rock" && player2.choice === "rock") ||
        (player1.choice === "paper" && player2.choice === "paper") ||
        (player1.choice === "scissors" && player2.choice === "scissors"))
     { //players tie
    //  $("#round-update-1").html("There was a draw!");
    //  $("#round-update-2").html("There was a draw!");
     //push to database
     database.ref().child("/endRound/").set("Tie!");
    } else if //player 1 wins
    ((player1.choice === "rock" && player2.choice === "scissors") ||
    (player1.choice === "paper" && player2.choice === "rock") ||
    (player1.choice === "scissors" && player2.choice === "paper"))
    {
    //   $("#round-update-1").html("You won!");
    //   $("#round-update-2").html("You lose!");
        //   player1wins ++;
        //   player2losses ++;
      database.ref().child("/endRound/").set("Player1 wins!")
      database.ref().child("/players/player1/wins").set(player1.wins +1);
      database.ref().child("/players/player2/losses").set(player2.losses +1);
      $("#player1wins").html("Wins: " + player1.wins);
      $("#player2losses").html("Loses: " + player2.losses);
    } else if //player 2 wins
    ((player1.choice === "rock" && player2.choice === "paper") ||
    (player1.choice === "paper" && player2.choice === "scissors") ||
    (player1.choice === "scissors" && player2.choice === "rock"))
    {
    //   $("#round-update-1").html("You lose!");
    //   $("#round-update-2").html("You won!");
    //   player1losses ++;
    //   player2wins ++;
    database.ref().child("/endRound/").set("Player2 wins!")
    database.ref().child("/players/player2/wins").set(player2.wins +1);
    database.ref().child("/players/player1/losses").set(player1.losses +1);
    $("#player2wins").html("Wins: " + player2.wins);
    $("#player1losses").html("Loses: " + player1.losses);
    }
    setTimeout(function() {
    //reset turns
    playerTurn = 1;
    database.ref().child("/playerTurn/").set(1);
    database.ref("/endRound/").on("value", function(snapshot) {
        // $("#button1Group").removeClass("invisible");
        // $("#button2Group").removeClass("invisible");
        $("#round-update-1").html(snapshot.val());
        $("#round-update-2").html(snapshot.val());
    });
    }, 2000); 
    restartRound();  
    } 


    function restartRound() {
        $("#button1Group").show();
        $("#button2Group").show();
    }
    
})
 