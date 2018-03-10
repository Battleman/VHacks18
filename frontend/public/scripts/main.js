mapboxgl.accessToken = 'pk.eyJ1Ijoibmlja3J1YmluIiwiYSI6ImNqNWd2ZTdiMDFoNnoyd282b3RiYno4ZXoifQ.WzFhnOnZiK6nSJSB8Gtxwg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
	center: [12.455581, 41.902115],
    zoom: 14
});

map.on('click', function(e) {
    var latitude = e.lngLat.lat;
    var longitude = e.lngLat.lng;
	$("#add-location").val(latitude + "," + longitude);
	$("#activity-location").val(latitude + "," + longitude);
});

$("#sidebar-submit-form").click(function(event) {
	var location = $("#add-location").val();
	var description = $("#add-description").val();
	description = description.replace(/'/g, "$$$");
	var times = $("#add-time").val();
	var name = localStorage.getItem("name");
	
	var data = {
		"body": {
			"name": name,
			"coordinates": location,
			"description": description,
			"times": times,
			"city": "Rome" //GETS CITY FROM COORDINATES
		}
	}
	
	$.ajax({
		type: "POST",
		url: "http://localhost:8000/hilocal/event/",
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function(result) {
			loadMap();
		},
		error: function(res) {
			console.log(res);
		}
	});
});

$("#sidebar-activity-form").click(function(event) {
	var location = $("#add-location").val();
	var description = $("#add-description").val();
	var times = $("#add-time").val();
	var name = localStorage.getItem("name");
	
	var data = {
		"body": {
			"name": name,
			"coordinates": location,
			"description": description,
			"times": times,
			"city": "Rome" //GETS CITY FROM COORDINATES
		}
	}
	
	$.ajax({
		type: "POST",
		url: "http://localhost:8000/hilocal/event/",
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function(result) {
			loadMap();
		},
		error: function(res) {
			console.log(res);
		}
	});
});

$("#sidebar-submit").click(function(event) {
	$("#sidebar-meetup-container").show();
	$("#sidebar-main-container").hide();
});

$("#sidebar-activity").click(function(event) {
	$("#sidebar-activity-container").show();
	$("#sidebar-main-container").hide();
});

$("#sidebar-login").click(function(event) {
	$("#sidebar-buttons-container").hide();
	$("#sidebar-login-container").show();
});

$("#sidebar-register").click(function(event) {
	$("#sidebar-buttons-container").hide();
	$("#sidebar-register-container").show();
});

$("#sidebar-login-form").click(function(event) {
	
	var email = $("#login-email").val();
	var password = $("#login-password").val();
		
	$.ajax({
		type: "GET",
		url: "http://localhost:8000/hilocal/user/",
		contentType: 'application/json',
		success: function(result) {
			console.log(result);
			for (var i = 0; i < result.objects.length; i++) {
				var json = result.objects[i];
				if (json.body) {
					var body = JSON.parse(json.body.replace(/'/g, "\""));
					if (json.username == email && password == json.password) {
						localStorage.setItem("name", body.name);
						localStorage.setItem("phone", body.phone);
						$("#sidebar-login-container").hide();
						$("#sidebar-main-container").show();
						return;
					}
				}
			}
		},
		error: function(res) {
			console.log(res);
		}
	});
});

$("#sidebar-register-form").click(function(event) {
	var email = $("#register-email").val();
	var fullName = $("#register-name").val();
	var phone = $("#register-phone").val();
	var password = $("#register-password").val();
	
	var data = {
		"username": email,
		"password": password,
		"body": {
			"name": fullName,
			"phone": phone
		}
	}
		
	$.ajax({
		type: "POST",
		url: "http://localhost:8000/hilocal/user/",
		contentType: 'application/json',
		data: JSON.stringify(data),
		success: function(result) {
			localStorage.setItem("name", fullName);
			localStorage.setItem("phone", phone);
			setTimeout(function() {
				$("#sidebar-title").html("Welcome, " + fullName.split(" ")[0]);
				$("#sidebar-register-container").hide(); // Put this where Done!
				$("#sidebar-main-container").show();
			}, 200);
		},
		error: function(res) {
			console.log(res);
		}
	});
});

$("#darken").click(function(event) {
	$("#darken").hide();
	$("#alert").hide();
	$("#alert-confirm").hide();
});

$("#sidebar-logout").click(function(event) {
	localStorage.setItem("name", "");
	localStorage.setItem("phone", "");
	$("#sidebar-title").click();
});

$("#sidebar-title").click(function(event) {
	if (localStorage.getItem("name")) {
		$("#sidebar-login-container").hide();
		$("#sidebar-register-container").hide();
		$("#sidebar-main-container").show();
		$("#sidebar-meetup-container").hide();
		$("#sidebar-activity-container").hide();
		$("#sidebar-buttons-container").hide();
	} else {
		$("#sidebar-login-container").hide();
		$("#sidebar-register-container").hide();
		$("#sidebar-main-container").hide();
		$("#sidebar-meetup-container").hide();
		$("#sidebar-activity-container").hide();
		$("#sidebar-buttons-container").show();
	}
});

$("#alert-cancel").click(function(event) {
	$("#darken").hide();
	$("#alert").hide();
	$("#phone-alert").hide();
});

$("#phone-alert-confirm").click(function(event) {
	$("#phone-alert").hide();
	$("#darken").hide();
});

function showMarker(time, name, phoneNumber) {
	$("#darken").show();
	$("#alert").show();
	$("#alert-title").html("Confirm meetup with <span id='name123'>" + name + "</span>!");
	$("#alert-description").html("You'll be meeting with " + name + " at <span id='time123'>" + time + "</span>. If this looks correct, please confirm below.")
	
	$("#alert-confirm").click(function(event) {
		var hostName = $('#name123').html().split(" ")[0];
		var time = $('#time123').html();
		var phone = phoneNumber;
		$("#phone-alert-description").html(hostName + "'s phone number is " + phone + ". He'll see you at " + time + ".");
		$("#alert").hide();
		$("#phone-alert").show();
	});
}

$(document).ready(function() {
	$("#sidebar-title").click();
	loadMap();
});

function loadMap() {
	$(".marker").remove();
	$.ajax({
		type: "GET",
		url: "http://localhost:8000/hilocal/event/",
		contentType: 'application/json',
		success: function(result) {
			console.log(result);
			for (var i = 0; i < result.objects.length; i++) {
				var json = result.objects[i];
				if (json.body) {
					var body = JSON.parse(json.body.replace(/'/g, "\""));
					var firstName = body.name.split(" ")[0];
					
					var description = body.description.replace("$$$", "'");
					
					while (description.includes("$$$")) {
						description = description.replace("$$$", "'");
					}
					
					var bigger = document.createElement('div');
					bigger.className = "marker-container c-" + firstName;
	
					var el = document.createElement('div');
					el.className = 'marker ' + firstName;
	
					bigger.appendChild(el);
	
					var rating = Math.floor(Math.random() * 2) + 4;
	
					var div = "<div class='popover-container'>";
					div += "<div class='popover-title t-" + firstName + "'>" + body.name + "</div>";
					div += "<div class='popover-stars-container'>";
	
					for (var k = 0; k < rating; k++) {
						div += "<img src='../images/star.png' class='popover-star' />";
					}
	
					for (var x = 0; x < 5 - rating; x++) {
						div += "<img src='../images/empty-star.png' class='popover-star' />";
					}

					div += "</div>";
					div += "<div class='popover-location'>" + body.city + "</div>";
					div += "<div class='popover-description'>" + description + "</div>";
					div += "<div class='popover-times-container'>";
					
					var parsedTimes = body.times.split(",");
										
					for (var z = 0; z < parsedTimes.length; z++) {
						div += "<div class='popover-time' onclick='showMarker(\"" + parsedTimes[z].trim() + "\", \"" + body.name + "\", \"" + "+1 206 913 8297" +"\")'>" + parsedTimes[z].trim() + "</div>";
					}
					
					div += "</div>";
					div += "</div>";
	
					var popup = new mapboxgl.Popup({
						anchor: "bottom",
						offset: 20
					})
						.setHTML(div);
 					   	
					var parsedCoordinates = body.coordinates.split(",");
					var coordinates = [Number(parsedCoordinates[1]), Number(parsedCoordinates[0])];
					
					console.log(coordinates);
 
					new mapboxgl.Marker(bigger)
					.setLngLat(coordinates)
					.setPopup(popup)
					.addTo(map);
				}
			}
		},
		error: function(res) {
			console.log(res);
		}
	});
}