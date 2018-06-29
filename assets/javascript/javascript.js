$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyCQpg2tARqJsQHc0hrN18dZE7L_0x1qQMo",
        authDomain: "trains-time.firebaseapp.com",
        databaseURL: "https://trains-time.firebaseio.com",
        projectId: "trains-time",
        storageBucket: "trains-time.appspot.com",
        messagingSenderId: "313434120143"
    };

    firebase.initializeApp(config);

    var database = firebase.database();
    
    $("#submit").on("click", function(event) {
        event.preventDefault();
        var name = $("#TrainName").val().trim();
        var dest = $("#Destination").val().trim();
        var time = $("#TrainTime").val().trim();
        var freq = $("#Frequency").val().trim();

        database.ref().push({
                name: name,
                dest: dest,
                time:time,
                freq: freq,
                timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("input").val('');
        return false;
    });

    database.ref().on("child_added", function(childSnapshot){
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;

        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);

        var freq = parseInt(freq);
        var ConvertedTime = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        var trainTime = moment(ConvertedTime).format('HH:mm');
        var tConverted = moment(trainTime, "HH:mm").subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        var remainder = tDifference % freq;
        var minsAway = freq - remainder;
        var nextTrain = moment().add(minsAway, 'minutes');
        var update = setInterval(update, 1000);

        function update() {
            var updateTime = moment();
            $('#currentTime').text(updateTime);
        }

        $('#panel2').append("<div class='col-lg-2 text-line'>" + childSnapshot.val().name + "<div>");
        $('#panel2').append("<div class='col-lg-2 text-line'>" + childSnapshot.val().dest + "<div>");
        $('#panel2').append("<div class='col-lg-2 text-line'>" + childSnapshot.val().freq + "<div>");
        $('#panel2').append("<div class='col-lg-2 text-line'>" + moment(nextTrain).format('HH:mm') + "<div>");
        $('#panel2').append("<div class='col-lg-2 text-line'>" + minsAway + "<div>");
    },

    function(errorObject){
        console.log("The read failed :" + errorObject.code)
    });

});
