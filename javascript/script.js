$(document).ready(function(){

  const cities = {
    "New York":{
      "latitude":40.7127,
      "longitude": -74.0059,
      "miles": 12,
      "zoom": 11
    },
    "Philadelphia": {
      "latitude":39.9500,
      "longitude": -75.1667,
      "miles": 8,
      "zoom": 12
    },
    "Montreal": {
      "latitude":45.5017,
      "longitude": -73.5673,
      "miles": 10,
      "zoom": 11
    },
    "Miami": {
      "latitude":25.7753,
      "longitude": -80.2089,
      "miles": 10,
      "zoom": 11
    },
    "Honolulu": {
      "latitude":21.3000,
      "longitude": -157.8167,
      "miles": 6,
      "zoom": 13
    },
    "Los Angeles":{
      "latitude":34.0500,
      "longitude": -118.2500,
      "miles": 18,
      "zoom": 11
    },
    "San Francisco": {
      "latitude":37.7833,
      "longitude": -122.4167,
      "miles": 10,
      "zoom": 11
    },
    "Portland": {
      "latitude":45.5200,
      "longitude": -122.6819,
      "miles": 10,
      "zoom": 11
    },
    "Denver": {
      "latitude":39.7392,
      "longitude": -104.9903,
      "miles": 8,
      "zoom": 12
    },
    "Vancouver": {
      "latitude":49.2827,
      "longitude": -123.1207,
      "miles": 10,
      "zoom": 11
    },
    "London": {
      "latitude":51.5072,
      "longitude": -0.1275,
      "miles": 10,
      "zoom": 11
    }
  }

  //adjectives that will be used as emotions
  const adjectives = ["super", "very", "really", "so", "feeling", ""]
  const words ={"happy": ["happy ", "excited ", "elated ", "joyful ","trilled ", "stoked " ],
                "sad": ["unhappy ", "sad ", "depressed ", "upset ", "ashamed ", "miserable "],
                "angry": ["angry ","pissed ", "annoyed ", "furious ", "outraged ", "mad "]
              }

  //function to create URL that will be used in the call to the twitter API
  function url(adjective, latitude, longitude, miles) {
    return (`http://cooper-union-search-proxy.herokuapp.com/twitter/search/I'm%20${adjective}?geocode=${latitude},${longitude},${miles}mi&count=1000`)
  };

  //searches all statuses that have the adjective and the emotion word
  function searchWords(word,array,response,city) {
    for(var k = 0; k<response.statuses.length; k++) {
      var str=response.statuses[k].text
      var n =str.search(word)

      //This creates an object that will be used to mark the map
      if (n != -1 && n != "undefined") {
        var obj = {}

        obj.link = `https://twitter.com/ ${response.statuses[k].user.name}/status/${response.statuses[k].id_str}`,
        obj.user =  response.statuses[k].user.name

      //if the coordiantes are null, pick a random spot close to the city center
        if (!response.statuses[k].coordinates){
          obj.long = ((cities[city].longitude) + .1*(Math.random()-.5))
          obj.lat = ((cities[city].latitude) + .1*(Math.random()-.5))
        }
        else {
          obj.long = response.statuses[k].coordinates.coordinates[0]
          obj.lat = response.statuses[k].coordinates.coordinates[1]
        }
      array.push(obj);
      }
    }
  };


  var renderCity = function(city) {
    // hide the map, average mood rating as the function runs.
    $("#averagemood").addClass("hidden")
    $("#map-canvas").addClass("hidden")
    $(".moods td").removeClass("circle");
    $("#song").html("");

    //arrays for user information to make map markers
    var happy = []
    var sad =[]
    var angry = []

    //cycles through all the adjectives and makes a call to the Twitter API using them with the
    //lattitude and longitutde of the city that the user choose

    adjectives.forEach(adjective => {

      $.getJSON(
        url(adjective, cities[city].latitude, cities[city].longitude, cities[city].miles),
        function(response){
          console.log(url(adjective, cities[city].latitude, cities[city].longitude, cities[city].miles));
          console.log(response)

          //cycles through the words associated with each emotion
          words.happy.forEach(word => {
            searchWords(word, happy, response, city)
          });

          words.sad.forEach(word => {
            searchWords(word, sad, response, city)
          })

          words.angry.forEach(word => {
            searchWords(word, angry, response, city)
          })
      });
    });

    //give JSON time to work, change the last number if the internet is really slow somewhere
    var timeout = setTimeout(function () {renderMap()}, 3000);

      function renderMap() {
        $("#averagemood").removeClass("hidden")
        $("#map-canvas").removeClass("hidden")
        $("#song").html("");

        moodarray=[happy.length, sad.length, angry.length]
        console.log(moodarray)

        //weights the sad and angry tweets more heavily because it takes more for someone to
        //tweet about these things. All this just makes things more interesting so why not.
        var rating = eval(moodarray[0]/(3*moodarray[1]+ 2.5*moodarray[2]));
        console.log(rating)

        function showRating(type, div){
          var html = `<audio controls autoplay> <source src = songs/${type}.mp3 type='audio/mp3'
                      reload='none'> Your browser does not support the audio element.</audio>
                      <br />`
          $('#song').append(html)
          $(`#${div}`).addClass("circle")
        }

        //assess rating three times as many happy people as sad people = superhappy :)
        if (rating >=  3){
          showRating("Happy","superhappy")
        }
        else if (rating >= 2) {
          showRating("Happy","happy")
        }
        else if (rating >=1) {
          showRating("Happy","neutralhappy")
        }
        // three times as many sad people as happy people = supersad  :(
        else if (rating <=0.333) {
          showRating("Sad","supersad")
        }
        else if (rating <=0.5) {
          showRating("Sad","sad")
        }
        else if (rating <1) {
          showRating("Sad","neutralsad")
        }

        var mapOptions = {
            zoom: cities[city].zoom,
            center: new google.maps.LatLng(cities[city].latitude,cities[city].longitude)
        };

        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var positions = []
        var markers = [];
        var infoWindows = [];
        var popUps = [];

        function makePositionObject(object,icon){
          positionobject = {
            'title': object.user,
            'map': new google.maps.LatLng(object.lat, object.long),
            'link':object.link,
            'icon': icon
          }
          positions.push(positionobject)
        }

        function makeMarkers(object, icon){
          var LatLng = new google.maps.LatLng(object.lat, object.long);
          var markerOptions = new google.maps.Marker({
            position: LatLng,
            map: map,
            title: object.user,
            icon: icon
           });
          markers.push(markerOptions);
        }

        happy.forEach(object => {
          var icon = "pictures/happyflag.png"
          makePositionObject(object, icon)
          makeMarkers(object, icon)
        });

        sad.forEach(object => {
          var icon = "pictures/sadflag.png"
          makePositionObject(object, icon)
          makeMarkers(object, icon)
        });

        angry.forEach(object => {
          var icon = "pictures/angryflag.png"
          makePositionObject(object, icon)
          makeMarkers(object, icon)
        });

        for (i in markers) {
          //create a template with two placeholder to replace
          var popUpTemplate = '<div class="content"><a target=_blank href="{{link}}">{{content}}</a></div>';

          //replace the content placeholder
          popUps[i] = popUpTemplate.replace('{{content}}', positions[i].title);

          //replace the link placeholder
          popUps[i] = popUps[i].replace('{{link}}', positions[i].link);

          //create a new info window

          infoWindows[i] = new google.maps.InfoWindow({
            //the contents is the string-replaced template we created within this loop
            content:popUps[i]
          });

          //when a marker is clicked on
          google.maps.event.addListener(markers[i], 'click', function(innerKey) {
            return function() {
              //comment out the for loop persist each info window
              for (j in markers) {
               infoWindows[j].close(map, markers[j]);
              }
              //open the infoWindow related to the marker clicked on
              infoWindows[innerKey].open(map, markers[innerKey]);
            }
          }(i));
        }
      }
    }

    Object.keys(cities).forEach(cityName => {
      $("header").append(`<span class="city">${cityName}</span>`)
    });

    $(".city").click(function() {
      var currentCity = $(this).text();
      console.log(currentCity)
      renderCity(currentCity);
    });

})//end document ready


