
        $(document).ready(function(){

          console.log("hi")
         var cities = {
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
            "miles": 8,
            "zoom": 12
          },
           "Los Angeles":{
            "latitude":34.0500,
            "longitude": -118.2500, 
            "miles": 18,
            "zoom": 10
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
      
  
          var renderCity = function(city) {
           //make an the adjectives and emotions into objects and arrays
          var adjectives = [" m super", " m very", " m really", " m so", " m feeling" ]
          var emotions ={"happy": ["happy ", "excited ", "elated ", "joyful ","trilled ", "stoked " ],
                         "sad": ["unhappy ", "sad ", "depressed ", "upset ", "ashamed ", "miserable "],
                        "angry": ["angry ","pissed ", "annoyed ", "furious ", "outraged ", "mad "] 
                        }
          $("#averagemood").addClass("hidden")
          $("#map-canvas").addClass("hidden")
          $(".moods td").removeClass("circle"); 
          $("#song").html("");  
         
          //makes it easier to just make these things variables to refer to them
          var url = "http://cooper-union-search-proxy.herokuapp.com/twitter/search/I"
          var url2 = "?geocode="+cities[city].latitude+"," + cities[city].longitude +","+ cities[city].miles + "mi&count=100"   
         
          //arrays for counting
          var sadarray =[]
          var angryarray =[]
          var happyarray = []

          //arrays for longitude and latitudes
          var happylong = []
          var happylat = []
          var happylink =[]
          var happyuser=[]

          var sadlong = []
          var sadlat = []
          var sadlink= []
          var saduser=[]

          var angrylong = []
          var angrylat = []
          var angrylink=[]
          var angryuser =[]

        //cycles through all the adjectives and looks for them on twitter
         for (var j=0; j<adjectives.length; j++) {
               var adjective = adjectives[j];
        //has the function run with the value at the bottom
            (function(adjective){

            $.getJSON(url + adjective + url2, function(response){ 
              console.log(url+adjective +url2)
              console.log(response)
              //cycles through the emotion words associated with happy
               for (var i=0; i<emotions.happy.length; i++) { 
                  var emotion=emotions.happy[i]
                  //searches all statuses that have the adjective and the emotion word
                  for(var k = 0; k<response.statuses.length; k++) {
                     var str=response.statuses[k].text
                      var n =str.search(emotion)
                      //if the emotion word is in there it pushes the word "avocado" onto an array
                      //I thought it was visually misleading to count tweets that can't be plotted
                      //if the emotion word is in there and if the tweet has a location it will push the coordinates onto a latitude and longitude array associated
                        if ((n != -1 && n != "undefined") && (response.statuses[k].coordinates != "null" && response.statuses[k].coordinates != null)){
                          happyarray.push("avocado")
                          happylong.push(response.statuses[k].coordinates.coordinates[0])
                          happylat.push(response.statuses[k].coordinates.coordinates[1])
                          happylink.push("https://twitter.com/" + response.statuses[k].user.name + "/status/" + response.statuses[k].id_str)
                          happyuser.push(response.statuses[k].created_at)
                        }
                  }  
                } 
              //cycles through the emotion words associated with happy
                for (var i=0; i<emotions.sad.length; i++) { 
                  var emotion=emotions.sad[i]
                     for(var k = 0; k<response.statuses.length; k++) {
                     var str=response.statuses[k].text
                      var n =str.search(emotion)
                         if ((n != -1 && n != "undefined") && (response.statuses[k].coordinates != "null" && response.statuses[k].coordinates != null)){
                          sadarray.push("avocado")
                          sadlong.push(response.statuses[k].coordinates.coordinates[0])
                          sadlat.push(response.statuses[k].coordinates.coordinates[1])
                          sadlink.push("https://twitter.com/" + response.statuses[k].user.name + "/status/" + response.statuses[k].id_str)
                          saduser.push(response.statuses[k].created_at)
                        }
                        }
                        }  
                         
              //cycles through the emotion words associated with angry
                 for (var i=0; i<emotions.angry.length; i++) { 
                 var  emotion=emotions.angry[i]   
                     for(var k = 0; k<response.statuses.length; k++) {
                     var str=response.statuses[k].text   
                      var n =str.search(emotion)
                        if ((n != -1 && n != "undefined") && (response.statuses[k].coordinates != "null" && response.statuses[k].coordinates != null)){
                          angryarray.push("avocado")
                          angrylong.push(response.statuses[k].coordinates.coordinates[0])
                          angrylat.push(response.statuses[k].coordinates.coordinates[1])
                          angrylink.push("https://twitter.com/" + response.statuses[k].user.name + "/status/" + response.statuses[k].id_str)
                          angryuser.push(response.statuses[k].created_at
                        }
                        }  
                        }   
                        });  
                  })(adjective)
                        }
        //give JSON time to work, change the last number if the internet is really slow somewhere
        var timeout=setTimeout(function () {everythingelse()}, 3000);
         function everythingelse() {
        $("#averagemood").removeClass("hidden")
        $("#map-canvas").removeClass("hidden")
        $("#song").html("");  
        moodarray=[happyarray.length, sadarray.length,angryarray.length]
        console.log(moodarray)
        console.log(happyuser)
        console.log(saduser)
        console.log(angryuser)

        //weights the sad and angry tweets more heavily because it takes more for someone to tweet about these thigns. All this just makes things more interesting so why not.
        var rating = eval(moodarray[0]/(3*moodarray[1]+ 2.5*moodarray[2]));
        console.log(rating)

        var html1 = "<audio controls autoplay> <source src = songs/"
        var html2 = ".mp3 type='audio/mp3' reload='none'> Your browser does not support the audio element.</audio> <br />"

        //assess rating three times as many happy people as sad people = superhappy :)
        if (rating >=  3){
          var type = "Happy"   
          var html = html1 + type + html2  
           $('#song').append(html) 
          $("#superhappy").addClass("circle")
        }
        else if (rating >= 2) {
          var type = "Happy"   
          var html = html1 + type + html2  
           $('#song').append(html) 
          $("#happy").addClass("circle")
        }
        else if (rating >=1) {
          var type = "Happy"   
          var html = html1 + type + html2  
           $('#song').append(html) 
          $("#neutralhappy").addClass("circle")
        }
        // three times as many sad people as happy people = supersad  :(
        else if (rating <=0.333) {
          var type = "Sad"   
          var html = html1 + type + html2  
           $('#song').append(html) 
          $("#supersad").addClass("circle")
        }
        else if (rating <=0.5) {
          var type = "Sad"   
          var html = html1 + type + html2  
           $('#song').append(html) 
          $("#sad").addClass("circle")
        }
        else if (rating <1) {
          var type = "Sad"   
          var html = html1 + type + html2  
           $('#song').append(html) 
          $("#neutralsad").addClass("circle")
        }



         var mapOptions = {
             zoom: cities[city].zoom, 
              center: new google.maps.LatLng(cities[city].latitude,cities[city].longitude) 
                 };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var myLatlng = new google.maps.LatLng(cities[city].latitude,cities[city].longitude);
        var positions = []

        for (var i=0; i<happylat.length; i++) {
          positionobject = {
            'title': happyuser[i],
            'map': new google.maps.LatLng(happylat[i], happylong[i]),
            'link':happylink[i],
            'icon': "pictures/happyflag.png"
          }
          positions.push(positionobject)
        };
        for (var i=0; i<sadlat.length; i++) {
          positionobject = {
            'title': saduser[i],
            'map': new google.maps.LatLng(sadlat[i], sadlong[i]),
            'link':sadlink[i],
            'icon': "pictures/sadflag.png"
          }
          positions.push(positionobject)
        };
        for (var i=0; i<angrylat.length; i++) {
          positionobject = {
            'title': angryuser[i],
            'map': new google.maps.LatLng(angrylat[i], angrylong[i]),
            'link':angrylink[i],
            'icon': "pictures/angryflag.png"
          }
          positions.push(positionobject)
        };


        var markers = [];
        var infoWindows = [];
        var popUps = [];
        

      for (var i=0; i<happylat.length; i++) { 
        var happyicon = "pictures/happyflag.png"
         var LatLng = new google.maps.LatLng(happylat[i], happylong[i]);
         var markerOptions = new google.maps.Marker({
               position: LatLng,
               map: map,
               title: happyuser[i],
              icon: happyicon
           });
         markers.push(markerOptions);
       }

    for (var i=0; i<sadlat.length; i++) {
        var sadicon ="pictures/sadflag.png"
         var LatLng = new google.maps.LatLng(sadlat[i], sadlong[i]);
         var markerOptions = new google.maps.Marker({
               position: LatLng,
               map: map,
               title:saduser[i],
                icon: sadicon
           });
       
        markers.push(markerOptions);
  
          }

      for (var i=0; i<angrylat.length; i++) {
        var madicon = "pictures/angryflag.png"
         var LatLng = new google.maps.LatLng(angrylat[i], angrylong[i]);
         var markerOptions = new google.maps.Marker({
               position: LatLng,
               map: map,
               title:angryuser[i],
              icon: madicon
           });
         markers.push(markerOptions);
          }


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
    $.each(cities, function(cityName, cityData){

        var button ="<span>" + cityName+ "</span>"
      $(button).appendTo("header").click(function(){  
        var currentCity = $(this).text();
        console.log(currentCity)
        renderCity(currentCity);
        
      })

    })

})//end document ready


     