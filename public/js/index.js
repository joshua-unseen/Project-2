// we only need 2 decimal places in our lat/long: xx.xx, xxx.xx

const timer = document.querySelector('.timepicker');
M.Timepicker.init(timer, {
  showClearBtn: true
});

var myPlan = {};

function initMap() {
  var geocoder = new google.maps.Geocoder();

  $("#submit").on("click", function () {
    myPlan.arriveBy = getArrivalTime();
    geocodeAddress(geocoder);
  });
}

function geocodeAddress(geocoder) {
  var origin = $("#origin").val().trim();
  var destination = $("#destination").val().trim();

  geocoder.geocode({ "address": origin }, function (result, status) {
    if (status === 'OK') {
      var newLat = result[0].geometry.location.lat();
      var newLong = result[0].geometry.location.lng();
      newLat = parseFloat(newLat).toFixed(2);
      newLong = parseFloat(newLong).toFixed(2);
      myPlan.currLat = newLat;
      myPlan.currLong = newLong;
      console.log(myPlan);
      geocoder.geocode({ "address": destination }, function (result, status) {
        if (status === 'OK') {
          // console.log(result);
          var newLat = result[0].geometry.location.lat();
          var newLong = result[0].geometry.location.lng();
          newLat = parseFloat(newLat).toFixed(2);
          newLong = parseFloat(newLong).toFixed(2);    
          myPlan.destLat = newLat;
          myPlan.destLong = newLong;
          console.log(myPlan);
          $.ajax("/api/plans", {
            type: "POST",
            data: myPlan // myPlan when map is integrated.
          }).then(
            function (response) {
              // 'response' holds the users plan data.  (We've already got that in myPlan, so we don't really need it.)
              // Now we need to get matches from the database and render the result
              console.log("created new user input");
              console.log(response);
              // Reload the page to get the updated list
              // location.reload();
            }
          );
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getArrivalTime() {
  var dateText = $("#calendar").val();
  var timeText = $("#clock").val();
  var newTimeText = convertTimeStringformat(24, timeText);
  var selectedTime = new Date(dateText + ' ' + newTimeText);
  return selectedTime;
}

$(document).ready(function () {
  $('.sidenav').sidenav();
  $('select').formSelect();
  $('.parallax').parallax();
});

// $("#submit").on("click", function (event) {
//   // Make sure to preventDefault on a submit event.
//   event.preventDefault();

//   //alert the user if any input field is empty
//   if ($.trim($("#destination").val()) === "" || $.trim($("#calendar").val()) === "" || $.trim($("#clock").val()) === "" || $.trim($("#transMethod").val()) === "") {
//     alert('Please fiil out all the fields');
//     return false;
//   }

//   //get the value of user input


//   // var myPlan = new Plan(currLat, currLong, destLat, destLong, destTime);  // Make active when map is integrated.
//   var newPlan = {
//     destination: $("#destination").val().trim(),
//     arrivalDateTime: selectedTime,
//     transMethod: $("#transMethod").children("option:selected").val()

//   }

//   console.log(newPlan)

//   $.ajax("/api/plans", {
//     type: "POST",
//     data: newPlan // myPlan when map is integrated.
//   }).then(
//     function (response) {
//       // 'response' holds the users plan data.  (We've already got that in myPlan, so we don't really need it.)
//       // Now we need to get matches from the database and render the result
//       console.log("created new user input");
//       console.log(response);
//       // Reload the page to get the updated list
//       // location.reload();
//     }
//   );
// });

//alert user if past or today is selected. allow user to choose today after alerting.
function checkDate() {
  var dateText = $("#calendar").val();
  var selectedDate = new Date(dateText);
  var now = new Date();
  if (selectedDate < now) {
    alert("Date must be in the future");
  }
}

//alert user if past time is selected, and clear the form until user selects future time

function checkTime() {

  var dateText = $("#calendar").val();
  var timeText = $("#clock").val();
  var newTimeText = convertTimeStringformat(24, timeText);
  var selectedTime = new Date(dateText + ' ' + newTimeText);
  var now = new Date();

  console.log(selectedTime);
  console.log(now);

  if (selectedTime < now) {
    alert("Time must be in the future");
    $("#clock").val('')
  }
}

//convert 12h time string to 24h time string
function convertTimeStringformat(format, str) {
  var time = $("#clock").val();
  var hours = Number(time.match(/^(\d+)/)[1]);
  var minutes = Number(time.match(/:(\d+)/)[1]);
  var AMPM = time.match(/\s(.*)$/)[1];
  if (AMPM == "PM" && hours < 12) hours = hours + 12;
  if (AMPM == "AM" && hours == 12) hours = hours - 12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if (hours < 10) sHours = "0" + sHours;
  if (minutes < 10) sMinutes = "0" + sMinutes;
  return (sHours + ":" + sMinutes);
}

