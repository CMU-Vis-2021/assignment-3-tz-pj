let fetchData = async () => {
        //I've handily uploaded the data to this site for easy reference.
        let url = "https://api.myjson.com/bins/cgbm8";
        //'fetch()' returns a promise
        let response = await fetch(url);
        //'json()' also returns a promise
        return response.json();
    };

Number.prototype.round = function (decimals) {
    return Number((Math.round(this + "e" + decimals) + "e-" + decimals));
    // return Number((Math.round(this + "e" + decimals) + "e-" + decimals));
};

const width = 900;
const height = 600;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
 
const projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2]) // translate to center of screen
        .scale([1000]); // scale things down so see entire US
 
const path = d3.geoPath().projection(projection);

//import the csv data 
const idata = d3.csv("data_aggregation.csv");

//create tooltip
const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

d3.csv("data_aggregation.csv", function(data) {
    //console.log(data);

    var gender = document.getElementById("gender-select");
    var genderValue = gender.value;
    var percent = 'inventor_percent'
    //console.log(genderValue)

    // get the gender dropdown value and update the percent
    let inventorPercent = data.map(function (d, i) {
        if(genderValue == "female"){
            percent = 'inventor_percent_f';
        }
        else if(genderValue == "male"){
            percent = 'inventor_percent_m';
        }
        else if (genderValue == "all"){
            percent = 'inventor_percent';
        }
        else {
            percent = 'inventor_percent';
        }
    });
    console.log(genderValue +': ' +inventorPercent);


// d3.select("#gender-select")
//           .selectAll("option")
//         //   .data(dropdown_options)
//           .enter()
//           .append("option")
//           .attr("value", function(option) { return option.value; })
//           .text(function(option) { return option.text; });

    // checking the min and max of the inventor_percent
    let max = d3.max(data, function (d, i) {
        return d[percent];
    });
    let min = d3.min(data, function (d, i) {
        return d[percent];
    });

    //set colors 
    lowColor = '#EBF5FB';
    highColor = '#2874A6';

    var ramp = d3.scaleLinear()
        .domain([min,max])
        .range([lowColor,highColor]);
    //console.log(max);
    //console.log(min);

    let inventor = data.map(function (d, i) {
        return d[percent];
    });
    console.log(inventor);
 
d3.json("https://gist.githubusercontent.com/Bradleykingz/3aa5206b6819a3c38b5d73cb814ed470/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json", function(error, uState) {
    if (error) throw error;
    _(uState.features)
    .keyBy('properties.name')
    .merge(_.keyBy(data, 'state'))
    .values()
    .value();

     svg.selectAll('path')
        .data(uState.features)
        .enter()
        .append('path')
        .attr("d", path)
         .style('transition', "all 0.2s ease-in-out")

        .attr('class', 'state')
        // .style("fill", d => color(idata.get(d.inventor_percent)))
        .style("fill", function(d) { 
            return ramp(d[percent]);
        })

        // .append("text")
        // .attr("text-anchor", "middle")  
        // .style("font-size", "20px") 
        // .text("US Innovation Rates by Childhood State and Gender");
        
        //adding hover interactions
        .on('mousemove', function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text(()=> `${d.state}: ${(d[percent])}%; \n\n Total: ${(d.inventor_count)}`)
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", tinycolor(ramp(d[percent])).darken(15).toString())
                .style("cursor", "pointer");

        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", function (d) {
                return ramp(d[percent]);
            });

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

        // var dropDown = d3.select("#gender-select");

        // dropDown.on("change", function() {
            var w = 140, h = 300;
            var key = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("class", "legend");
    
            var legend = key.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "100%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");
    
            legend.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", highColor)
                .attr("stop-opacity", 1);
                
            legend.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", lowColor)
                .attr("stop-opacity", 1);
    
            key.append("rect")
                .attr("width", w - 100)
                .attr("height", h)
                .style("fill", "url(#gradient)")
                .attr("transform", "translate(0,10)");
    
            var y = d3.scaleLinear()
                .range([h, 0])
                .domain([min, max]);
    
            var yAxis = d3.axisRight(y);
    
            key.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(41,10)")
                .call(yAxis)

            });
        //});
});