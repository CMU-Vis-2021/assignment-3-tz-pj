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
d3.csv("data_aggregation.csv", function(data) {
    console.log(data);
 
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
     });


    // checking the min and max of the inventor_percent
    let max = d3.max(data, function (d, i) {
        return d.inventor_percent;
    });
    let min = d3.min(data, function (d, i) {
        return d.inventor_percent;
    });
    console.log(max);
    console.log(min);

    const colorScale = d3.scaleLinear()
    .domain([min, max])
    .range(["#00806D", "#00BC4C", "#00F200", "#85FB44"].reverse());
    

});