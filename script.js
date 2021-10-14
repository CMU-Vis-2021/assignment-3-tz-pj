let fetchData = async () => {
        //I've handily uploaded the data to this site for easy reference.
        let url = "https://api.myjson.com/bins/cgbm8";
        //'fetch()' returns a promise
        let response= await fetch(url);
        //'json()' also returns a promise
        return response.json();
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

d3.csv("data_aggregation.csv", function(data) {
    console.log(data);

        // checking the min and max of the inventor_percent
    let max = d3.max(data, function (d, i) {
        return d.inventor_percent;
    });
    let min = d3.min(data, function (d, i) {
        return d.inventor_percent;
    });
    console.log(max);
    console.log(min);


var color = d3.scaleQuantize()
     .domain([min, max])
     //.range(d3.schemePurples[5]);
     //.range(["#00806D", "#00BC4C", "#00F200", "#85FB44"]);
     // .range(["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"]);
      .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

const colorScale = d3.scaleLinear()
    .domain([min, max])
    .range(["#00806D", "#00BC4C", "#00F200", "#85FB44"].reverse());
    


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
        .attr('class', 'state')
        // .style("fill", d => color(idata.get(d.inventor_percent)))
        .style("fill", function(d) { 
            return colorScale(d.inventor_percent) 
        });
        // .style('fill', function (d, i) {
        // let inventor = d.inventor_percent;
        // return inventor ? colorScale(inventor) : "#ccc";
    })
        // .style("fill", function(d){
        //     return color(d);
        // };
        // .style("fill", function(d, i) {
        //                         //Get data value
        //                         var value = idata[d.inventor_percent];
        //                         if (value) {
        //                                 //If value exists…
        //                                 return color(value);
        //                         } else {
        //                                 //If value is undefined…
        //                                 return "#ccc";
        //                         }





});