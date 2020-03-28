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

    //create a variable to reference the database
    var database = firebase.database();
    //create variables for connections
    // var playersReference = database.ref("/players");
    // var messageReference = database.ref("/messages");
    // var connectedReference = database.ref("info/connected");

    //create initial variables for player data
    //chat messages
    // var messages = [];
    // holds player
    var name1 = null;
    var name2 = null;
    //booleans to check if player logged 
    var player1Logged = false;
    //variables for players selections (default to player2)
    player1select = null;
    player2select = null;
    //wins and losses
    var player1wins = 0;
    var player1losses = 0;
    var player2wins = 0;
    var player2losses = 0;



    //---------PLAYER1--------------------

    //when player 1 clicks submit name

    //Submit Name  
    $("#start-game").on("click", function (event) {
      event.preventDefault();
      $("#chatArea").show().empty();

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
      //get input
      var name = $("#inputName").val().trim();
      console.log(name);

      //
      if (name1 === null) {
        name1 = name;
        player1Logged = true;
        //player name 1 to html 
        $("#player1name").html(name1);
        //push to firebase
        database.ref("/gameStatus").push({
          playerName: name1,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        database.ref("/gameStatus").onDisconnect().remove();
        
      } else if ((name1 !== null) && (name2 === null)) {
        name2 = name;
        player1Logged = false;
        //player name 2 to html
        $("#player2name").html(name2);
        database.ref("/gameStatus").push({
          playerName: name2,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        database.ref("/gameStatus").onDisconnect().remove();
      };

     if (player1Logged === true) {
         $("#button1Group").removeClass("invisible");
         $("#round-update-2").html("Player 2 Not Logged in")
     } else {
         $("#button2Group").removeClass("invisible");
         $("#round-update-2").html("Make a Selection!");
         $("#round-update-1").html("Make a Selection!");
     }
    })

    //player 1 enter message
    $("#enterMessage1").on("click", function (event) {
      //press enter to...uh enter...
      if (event.keyCode === 13) {
        $("#enterMessage1").click();
      }
      //this automatically scrolls the chat display to the bottom every time a message is sent
      $('#chatArea').animate({
        scrollTop: $('#chatArea')[0].scrollHeight
      }, "slow");
      event.preventDefault();
      //message 1 input
      var message1 = $("#inputMessage1").val();
      $("#inputMessage1").val("");
      console.log(message1);
      //push to database
      database.ref("/messages").push({
        message: message1,
        playerName: name1,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    })

    //chat display and build chat
    database.ref("/messages").on("child_added", function (snapshot) {
      //build message
      $("#chatArea").append("<p>" + snapshot.val().playerName + ": " + snapshot.val().message + "</p>")
    });

    //read rock,paper,scissors button clicks
    //variable player1select holds player 1 choice btwn rock,paper,scissors
    $(".select").on("click", function (event) { 
      var player1select = $(this).attr("data-choice");
      event.preventDefault();
      console.log(player1select);
     //send to firebase 
      //push to database
      database.ref("/gameStatus").push( {
        playerChoice : player1select,
        playerName : name1,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
     
    //   //send to update display
    //   database.ref("/gameStatus").on("child_added", function(snapshot) {
    //     console.log(snapshot.val());
      
    })
//-----------CONNECTIONS------------------
var connectionsRef = database.ref("/connections");
//boolean
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function(user) {
  // If they are connected..
  if (user.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user
    con.onDisconnect().remove();
  }
});
// connectionsRef.on("value", function(user) {
//   // Display the viewer count in the html.
//   $("#connected-viewers").text(user.numChildren());
// });


    // /------------firebase watch
    // database.ref("/gameStatus").on("value", function(snapshot) {}
    database.ref("/gameStatus").on("child_added", function (snapshot) {
        // updata variables with database
        // if (snapshot.child("playerName").exists() && snapshot.child("playerChoice").exists()) {
        //     name = snapshot.val().playerName;
        //     player1select = snapshot.val().playerChoice;

        //     console.log(snapshot.val().playerName);
        //     console.log(snapshot.val().playerChoice);
    var updateActivity = snapshot.val();
    if (player1select === "rock" || player1select === "scissors" || player1select === "paper") {
     
        $("#button1Group").addClass("invisible");
        $("#round-update-1").html("Waiting for your opponent to select");
    }
     if (player2select === "rock" || player2select === "scissors" || player2select === "paper") {
       console.log(updateActivity.player2select);
        $("#button2Group").addClass("invisible");
        $("#round-update-2").html("Waiting for your opponent to select");
    
    } else {
        roundUpdate();
    }
    })

    function roundUpdate() {
        if  ((player1select === "rock" && player2select === "rock") ||
            (player1select === "paper" && player2select === "paper") ||
            (player1select === "scissors" && player2select === "scissors"))
         {  //players tie
         $("#round-update-1").html("There was a draw!");
         $("#round-update-2").html("There was a draw!");
         } else if //player 1 wins
         ((player1select === "rock" && player2select === "scissors") ||
         (player1select === "paper" && player2select === "rock") ||
         (player1select === "scissors" && player2select === "paper"))
         {
           $("#round-update-1").html("You won!");
           $("#round-update-2").html("You lose!");
           player1wins ++;
           player2losses ++;
         } else if //player 2 wins
         ((player1select === "rock" && player2select === "paper") ||
         (player1select === "paper" && player2select === "scissors") ||
         (player1select === "scissors" && player2select === "rock"))
         {
           $("#round-update-1").html("You lose!");
           $("#round-update-2").html("You won!");
           player1losses ++;
           player2wins ++;
         }
        }







// //------------PLAYER 2-------------------------------------
// $("#start-game").on("click", function (event) {
//     event.preventDefault();
//     $("#chatArea").show().empty();

//     //prevents player from pressing submit without entering name
//     var play;
//     play = document.getElementById("inputName").value;
//     if (play == "") {
//       alert("Please Enter a Name");
//       return false;
//     }

//     // hide the modal!
//     $("#openingModal").modal('hide');
//     //empty that chatArea!
//     $("#chatArea").empty();
//     //get input
//     var name = $("#inputName").val().trim();
//     console.log(name);

    //
    // if (!name1) {
    //   name1 = name;
    //   player1Logged = true;
    //   //player name 1 to html 
    //   $("#player1name").html(name);
    //   //push to firebas
    //   database.ref().push({
    //     name1: name,
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP
    //   });
    // } else {
    //   name2 = name;
    //   player2Logged = true;
    //   player1Logged = false;
    //   //player name 2 to html
    //   $("#player2name").html(name);
    //   database.ref().push({
    //     name2: name,
    //     dateAdded: firebase.database.ServerValue.TIMESTAMP
    //   })
    // }
//   })


//   player 2 enter message
//   $("#enterMessage2").on("click", function (event) {
//     //press enter to...uh enter...
//     if (event.keyCode === 13) {
//       $("#enterMessage2").click();
//     }
//        //this automatically scrolls the chat display to the bottom every time a message is sent
//        $('#chatArea').animate({
//         scrollTop: $('#chatArea')[0].scrollHeight
//       }, "slow");
//     event.preventDefault();
//     //message 2 input
//     var message2 = $("#inputMessage2").val();
//     $("#inputMessage2").val("");
//     console.log(message2);

//     database.ref("/messages").push({
//       message: message2,
//       playerName: name2,
//       dateAdded: firebase.database.ServerValue.TIMESTAMP
//     });
//   })

//   //read rock,paper,scissors button clicks
//   //variable player1select holds player 1 choice btwn rock,paper,scissors
//   $(".select").on("click", function (event) {
//     var player2select = $(this).attr("data-choice");
//     event.preventDefault();
//     console.log(player2select);
//    //send to firebase 
//     database.ref("/gameStatus").push( {
//       playerChoice : player2select,
//       playerName : name,
//       dateAdded: firebase.database.ServerValue.TIMESTAMP
//     })
// //     //send to update display
// //     database.ref("/gameStatus").on("child_added", function(snapshot) {
// //       console.log(snapshot.val());
// //     $("#round-update-2").html("You have chosen " + player2select + " !")
// //     });
// //     if (player1select = null) {
// //       $("#round-update-2").html("Waiting for" + name1 + "to choose")
// //     } else {
// //       roundUpdate();
//     }
//   })
    }) 
// })

