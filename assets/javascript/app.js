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
    var player2Logged = false;
    //variables for players selections
    player1select = null;
<<<<<<< HEAD
    player2select = null;
    //function to compare playerChoices and reveal wins or losses
    
=======
    // player2select = null;
>>>>>>> 27edd706e7e364b1c5bfc71a82a753d9102e9239

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
      if (!name1) {
        name1 = name;
        player1Logged = true;
        //player name 1 to html 
        $("#player1name").html(name);
        //push to firebas
        database.ref().push({
          name1: name,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
      } else {
        name2 = name;
        player2Logged = true;
        player1Logged = false;
        //player name 2 to html
        $("#player2name").html(name);
        database.ref().push({
          name2: name,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
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

      database.ref("/messages/").push({
        message: message1,
        playerName: name1,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    })

    //chat display and build chat
    database.ref("/messages/").on("child_added", function (snapshot) {
      //test it!
      console.log(snapshot.val());
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
      database.ref("/playerStatus/").push( {
        player1select : player1select,
        playerName : name1,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      })
      //send to update display
      database.ref("/playerStatus/").on("child_added", function(snapshot) {
        console.log(snapshot.val());
      $("#round-update-1").html("You have chosen " + player1select + " !")
      });
      if (player2select = null) {
        $("#round-update-1").html("Waiting for" + name2 + "to choose")
      } else {
        roundUpdate();
      }
    })
    function roundUpdate() {
     if  ((player1select === "rock" && player2select === "rock") ||
         (player1select === "paper" && player2select === "paper") ||
         (player1select === "scissors" && player2select === "scissors"))
      {
      $("#round-update-1").html("There was a draw!");
      $("#round-update-2").html("There was a draw!");
      }
    