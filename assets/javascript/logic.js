$(document).ready(function () {

    console.log("entra a la logica");
    var config = {

        apiKey: "AIzaSyBuayaA5_zDiUpv9HEle0iityLJl5CAnrM",
        authDomain: "cryptomonstar.firebaseapp.com",
        databaseURL: "https://cryptomonstar.firebaseio.com",
        projectId: "cryptomonstar",
        storageBucket: "cryptomonstar.appspot.com",
        messagingSenderId: "600045610445"

    };
    firebase.initializeApp(config);
    database = firebase.database();

    var queryURL ="https://api.coinmarketcap.com/v2/ticker/?start=1&limit=100&sort=rank&structure=array";

    $.ajax({
        url: queryURL,
        method: "GET"
      })
      .then(function(response) {

        var results = response.data;

        for (var i = 0; i < results.length; i++) {

            var cryptoName=results[i].name;
            var symbol=results[i].symbol;
            var rank=results[i].rank;
            var price=results[i].quotes.USD.price;
            var percentageHour=results[i].quotes.USD.percent_change_1h;
            var percentageDay=results[i].quotes.USD.percent_change_24h;
            var percentageWeek=results[i].quotes.USD.percent_change_7d;

        
            database.ref().push({
                cryptoName: cryptoName,
                symbol: symbol,
                rank: rank,
                price:price,
                percentageHour: percentageHour,
                percentageDay:percentageDay,
                percentageWeek:percentageWeek,
                momentAdded: firebase.database.ServerValue.TIMESTAMP
                //the moment added will be used to comapre when the information was uploaded and to decide if we need to call the API again or not
            });
            

        }


      });

      database.ref().on("child_added", function (childSnapshot) {
        
      if(childSnapshot.val().rank<=4){
        var card=$("<div>");
        card.addClass("card");
        var cardBody=$("<div>");
        cardBody.addClass("card-body");

        var title=$("<h5>").text(childSnapshot.val().cryptoName);
        title.addClass("card-title");
        var subtitle=$("<h6>").text(childSnapshot.val().symbol);
        subtitle.addClass("card-subtitle mb-2 text-muted");

        var rank=$("<p>").text("Rank: "+childSnapshot.val().rank);
        rank.addClass("card-text");
        rank.append("<br>");
        rank.append("Price: "+childSnapshot.val().price);
        rank.append("<br>");
        rank.append("Percent change (1h): "+childSnapshot.val().percentageHour);
        rank.append("<br>");
        rank.append("Percent change (24h): "+childSnapshot.val().percentageDay);
        rank.append("<br>");
        rank.append("Percent change (7d): "+childSnapshot.val().percentageWeek);
        rank.append("<br>");
       
        var link=$("<a href='#'>").text("News");
        link.addClass("card-link");
        var link2=$("<a href='#'>").text("Bullish");
        link.addClass("card-link");
        var link3=$("<a href='#'>").text("Bearish");
        link.addClass("card-link");

        card.addClass("col-lg-3 col-md-6 col-sm-12");
        
        card.append(title).append(subtitle).append(rank).append(link).append(link2).append(link3);

        $("#cards").append(card);}
       
    

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});
