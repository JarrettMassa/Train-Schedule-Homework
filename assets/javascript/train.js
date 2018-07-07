$(document).ready(function() {



var trainName = "";
var trainDestination = "";
var trainFrequency = "";
var trainFirstTime = "";
var trainMinutes = ""
var minutes = 0;
var nextTrain;

var config = {
	apiKey: "AIzaSyB29AfKLUiToYPv5rbd_lD63zuc2HZLIoI",
    authDomain: "trainproject-b9189.firebaseapp.com",
    databaseURL: "https://trainproject-b9189.firebaseio.com",
    projectId: "trainproject-b9189",
    storageBucket: "",
    messagingSenderId: "562334637404"
};

firebase.initializeApp(config);

var database = firebase.database();


$('.submit-button').on("click", function(event){
	event.preventDefault();

	trainName = $('#trainName').val();
	trainDestination = $('#trainDestination').val();
	trainFrequency = $('#trainFrequency').val();
	trainFirstTime = $('#trainTime').val();
	
  	var newTrain = {
  		name: trainName,
    	destination: trainDestination,
    	frequency: trainFrequency,
    	time: trainFirstTime
  	};

  	database.ref().push(newTrain);

  	$('#trainName').val("");
	$('#trainDestination').val("");
	$('#trainFrequency').val("");
	$('#trainTime').val("");

}); // End $('.submit-button')

database.ref().on("child_added", function(childSnapshot) {

	var currentTime = moment().format("HH:mm");


	if (childSnapshot.val().time >= currentTime){
		nextTrain = childSnapshot.val().time;
		minutes = moment().diff(moment(nextTrain, "HH:mm"), "minutes");
		minutes = Math.abs(minutes);
	}
	else{
		minutes = moment().diff(moment(childSnapshot.val().time, "HH:mm"), "minutes");
		minutes = Math.abs(minutes);
		minutes = minutes % childSnapshot.val().frequency;
		nextTrain = moment().add(minutes, "minutes");
		var x = moment().add(minutes, "minutes");
		nextTrain = moment(x).format("hh:mm");
	}

	
    var newRow = $("<tr>").append(
		$('<td>').html(childSnapshot.val().name),
		$('<td>').html(childSnapshot.val().destination),
		$('<td>').html(childSnapshot.val().frequency),
		$('<td>').html(nextTrain),
		$('<td>').html(minutes)
  	);

	$('.train-body').append(newRow);        
      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

}); // End $(document).ready