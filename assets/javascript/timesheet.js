var config = {
    apiKey: "AIzaSyCLsYpIAqEe0W3C3LOQzGy1ZVyRCJUsh-I",
    authDomain: "first-project-bc4fe.firebaseapp.com",
    databaseURL: "https://first-project-bc4fe.firebaseio.com",
    projectId: "first-project-bc4fe",
    storageBucket: "first-project-bc4fe.appspot.com",
    messagingSenderId: "176138417750"
};
firebase.initializeApp(config);



var database = firebase.database();


$("#submit").on("click", function (event) {

    event.preventDefault();


    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();

    if (validateTime(firstTrain)) {

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });

        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
    }


});

database.ref().on("child_added", function (childSnapshot) {
    var frequency = childSnapshot.val().frequency
    var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
    var minutesAway = frequency - (timeDifference % frequency);
    var nextTrain = moment().add(minutesAway, "minutes");

    $("#all-trains").append("<tr>" + "<td>" + childSnapshot.val().trainName + "</td>" +
        "<td>" + childSnapshot.val().destination + "</td>" +
        "<td>" + childSnapshot.val().frequency + "</td>" +
        "<td>" + moment(nextTrain).format("hh:mm A") + "</td>" +
        "<td>" + minutesAway + "</td>" + "</tr>");


}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

function validateTime(obj) {
    var timeValue = obj;
    if (timeValue == "" || timeValue.indexOf(":") < 0) {
        alert("Invalid Time format");
        return false;
    }
    else {
        var sHours = timeValue.split(':')[0];
        var sMinutes = timeValue.split(':')[1];

        if (sHours == "" || isNaN(sHours) || parseInt(sHours) > 23) {
            alert("Invalid Time format");
            return false;
        }
        else if (parseInt(sHours) == 0)
            sHours = "00";
        else if (sHours < 10)
            sHours = "0" + sHours;

        if (sMinutes == "" || isNaN(sMinutes) || parseInt(sMinutes) > 59) {
            alert("Invalid Time format");
            return false;
        }
        else if (parseInt(sMinutes) == 0)
            sMinutes = "00";
        else if (sMinutes < 10)
            sMinutes = "0" + sMinutes;

        obj = sHours + ":" + sMinutes;
    }

    return true;
}