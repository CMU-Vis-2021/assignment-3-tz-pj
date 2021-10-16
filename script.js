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

// function selectDivisionNumber(array) {
//     let arraySize = array.length,
//         halfArray = Math.round(arraySize / 2);
//     let newArr = [];
//     //Take first and last item and push them to the array
//     newArr.push(array[0])
//     newArr.push(array[arraySize - 1]);
//     //Don't mind the order, they will be sorted later.
//     //Divide the array in two
//     let firstHalf = array.slice(0, halfArray);
//     let firstHalfSelection = firstHalf[Math.round(firstHalf.length / 2)];
//     newArr.push(firstHalfSelection);
 
//     let secondHalf = array.slice(halfArray, arraySize);
//     let secondHalfSelection = secondHalf[Math.round(secondHalf.length / 2)];
//     newArr.push(secondHalfSelection);
//     return newArr;
// }

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

//  fetchData().then(response => {
//create tooltip
const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

// let sampleMap = d3.map(item => {
//     return Number(item.inventor_percent);
// });
// let domain = selectDivisionNumber(sampleMap).sort();


d3.csv("data_aggregation.csv", function(data) {
    console.log(data);

    // checking the min and max of the inventor_percent
    let max = d3.max(data, function (d, i) {
        return d.inventor_percent;
    });
    let min = d3.min(data, function (d, i) {
        return d.inventor_percent;
    });

    lowColor = '#EBF5FB';
    highColor = '#2874A6';
    var ramp = d3.scaleLinear()
        .domain([min,max])
        .range([lowColor,highColor]);
    //console.log(max);
    //console.log(min);

// var color = d3.scaleQuantize()
//      .domain([min, max])
//      //.range(d3.schemePurples[5]);
//       .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

// const colorScale = d3.scaleLinear()
//     .domain([min, max])
//     // .range(["#00806D", "#00BC4C", "#00F200", "#85FB44"].reverse());
//     .range(d3.schemePurples[3]);
    

    let inventor = data.map(function (d, i) {
        return d.inventor_percent;
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
            return ramp(d.inventor_percent);
        })
        

        //adding hover interactions
        .on('mousemove', function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);

            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text(()=> `${d.state}: ${(d.inventor_percent)}%; \n\n Total: ${(d.inventor_count)}`)
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", tinycolor(ramp(d.inventor_percent)).darken(15).toString())
                .style("cursor", "pointer");

        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", function (d) {
                return ramp(d.inventor_percent);
            });

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
        
        // // adding legend
        // const legend = d3.select("body").append('svg')
        // //add it with the '.legend' class
        //     .attr('class', 'legend')
        //     .attr('width', 148)
        //     .attr('height', 148)
        //     //then either select all the 'g's inside the svg
        //     //or create placeholders
        //     .selectAll('g')
        //     //Fill the data into our placeholders in reverse order
        //     //This arranges our legend in descending order.
        //     //The 'data' here is the items we entered in the 'domain',
        //     //in this case [min, max]
        //     //We use 'slice()' to create a shallow copy of the array
        //     //Since we don't want to modify the original one
        //     .data(ramp.domain().slice().reverse())
        //     //Every node in teh data should have a 'g' appended
        //     .enter().append('g')
        //     //the 'g' should have this attribute
        //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        // //Inside every 'legend', insert a rect
        // legend.append("rect")
        //     .attr("width", 18)
        //     .attr("height", 18)
        //     //then fill it will the color assigned by the scale
        //     .style("fill", ramp);
        // legend.append("text")
        //     .attr("x", 24)
        //     .attr("y", 9)
        //     .attr("dy", ".35em")
        //     .text(function(d) {return `${(d).round(3).toFixed(3)}%`})    

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

});