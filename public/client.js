$("#target").click(function () {
    var result = null;
    var scriptUrl = "/search?name=" + $("#artistTextBox").val();
    var Artist;
    $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            result = data.artists.items[0].id;
        }
    });

    $.get("/artist?id=" + result, function (data) {

        //calculate aci
        //var num = (parseFloat(data.followers.total) + parseFloat(data.popularity)) /100;
        var num = (parseFloat(data.followers.total));
        var dollars = num / 1000;
        aci = dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});

        //create entry
        Artist = {
            "artist": data.id.toString(),
            "name": data.name.toString(),
            "aci": aci.toString(),
            "timestamp": Date.now().toString()
        };
        postEntry(Artist);

        //set ui elements
        $("#artistImage").attr("src", data.images[2].url);
        $("#artistName").html(JSON.stringify(data.name));
        $("#artistId").html(JSON.stringify(data.id));
        $("#artistFollowers").html(JSON.stringify(data.followers.total));
        $("#artistPopularity").html(JSON.stringify(data.popularity));
        $("#artistAci").html(aci);
    }, "json");

    $.get("/single?id=" + result, function (data) {
                $("#DBData").html(JSON.stringify(data));
                updateChart(data);
    }, "json");

    

    $(".content").show();
});

function postEntry(artist) {
    
    $.ajax({
        url: 'http://localhost:3000/api/artists/send',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(artist)
    })
}

function updateChart(data) {
    
    var history = [];
    for(var i = 0; i < data.length; i++) {
        var aci = parseFloat(data[i].aci.replace("$", ""));
        history.push({y: aci});
    }
    history.reverse()

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Artist ACI"
        },
        axisX: {
            interval:1,
            intervalType: "month",
        },
        axisY: {
            prefix: "$",
            title: "Price"
        },
        data: [{        
            type: "line",
              indexLabelFontSize: 16,
            dataPoints: history
        }]
    });

    chart.render();
    
    }