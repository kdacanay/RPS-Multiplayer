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
    //create initial variables

    // var player1select = null;
    // var player2select = null;
    // var player1wins = 0;
    // var player1losses = 0;
    // var player2wins= 0;
    // var player2losses = 0;


    //retrieve inputs from player --- build a player
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
    //get input for name
    var name = $("#inputName").val().trim();
    console.log(name);
    database.ref("/playerName").set({
        name : name,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    
    //watcher to log name 
    database.ref("/playerName").on("value", function(snapshot) {
        var player1 = null;
        player1 = snapshot.val().name;
        console.log(player1);
        $("#player1name").html(player1);
    })
    database.ref("/playerName").on("child_added", function(snapshot) {
    if (snapshot.child("name").exists()) {
        var player2 = null;
        player2 = snapshot.val().name;
        console.log(player2);
        $("#player2name").html(player2);
        $("#button2Group").removeClass("invisible");
        $("#round-update-2").html("Make a Selection!");
        $("#round-update-1").html("Make a Selection!");
    } else {
        console.log("TESTESTESTEST");
        $("#button1Group").removeClass("invisible");
        $("#round-update-2").html("Player 2 Not Logged in")
    }
})
    // if (player1 = !null) {
    //     $("#button1Group").removeClass("invisible");
    //     $("#round-update-2").html("Player 2 Not Logged in")
    // } else {
    //     $("#button2Group").removeClass("invisible");
    //     $("#round-update-2").html("Make a Selection!");
    //     $("#round-update-1").html("Make a Selection!");
    })
})
    // 
    //select
    //read rock,paper,scissors button clicks
    //variable player1select holds player 1 choice btwn rock,paper,scissors
    // $(".select").on("click", function (event) { 
    //     var player1select = $(this).attr("data-choice");
    //     event.preventDefault();
    //     console.log(player1select);
