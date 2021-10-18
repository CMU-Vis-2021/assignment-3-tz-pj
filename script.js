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
};

const width = 800;
const height = 500;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append('g');

 
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
    var percent = 'inventor_percent'
    // console.log(genderValue)

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
        .style("fill", function(d) { 
            return ramp(d[percent]);
        })

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
                .style("fill", tinycolor(ramp(d[percent])).darken(25).toString())
                .style("cursor", "pointer")
                displayGender(d);
                drawChart(d);

        })
        .on("mouseout", function (d, i) {
            d3.select(this).style("fill", function (d) {
                return ramp(d[percent]);
            });
            tooltip.transition()
                .duration(500)
                .style("opacity", 0)
            d3.select("#gender")
                .transition()
                .duration(200)
                .style("opacity", 0)
            d3.select("#title")
                .transition()
                .duration(200)
                .style("opacity", 0)
           //hideGender;
        });

        svg.selectAll("text")
        .data(uState.features)
        .enter()
        .append("svg:text")
        .text(function(d){
            return d.state_abbr;
        })
        .attr("x", function(d){
            return path.centroid(d)[0];
        })
        .attr("y", function(d){
            return  path.centroid(d)[1];
        })
        .attr("text-anchor","middle")
        .attr('font-size','5pt')
        .attr('color','darkgray')

            var w = 100, h = 300;
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
                .attr("width", w - 75)
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
            
            function displayGender(d){
                d3.select("#title")
                .transition()
                .duration(100)
                .style("opacity", 1)
                .text('Inventor Gender Distribution in ' + `${(d.state)}` + '\n')

                d3.select("#gender")
                .transition()
                .duration(100)
                .style("opacity", 1)
                .text(()=> `Male: ${(d.inventor_percent_m)}%; \n\n Female: ${(d.inventor_percent_f)}%`)
            }
            
            let gd = data.map(function (d, i) {
                //return [{'value': d.state, 'male' : d.inventor_percent_m, 'female' : d.inventor_percent_f}];
                return [{'tag': 'Male', 'value' : d.inventor_percent_m}, {'tag':'Female', 'value' : d.inventor_percent_f}];
            });
            console.log(gd);
            
            var margin = {
                top: 15,
                right: 25,
                bottom: 15,
                left: 60
            };
    
            var chartWidth = 900 - margin.left - margin.right,
                chartHeight = 300 - margin.top - margin.bottom;

            
            //draw bar chart for gender distribution
            function drawChart(d){
                var graph = d3.select("#pieChart")
                    .append("svg")
                    .attr("width", chartWidth + margin.left + margin.right)
                    .attr("height", chartHeight + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                    //X axis adn Y axis
                    var graphx = d3.scaleLinear()
                        .range([0, chartWidth])
                        .domain([0, d3.max(gd, function (d) {
                            return d['value'];
                        })]);
                    // var graphx = d3.scaleBand()
                    //     .domain(d3.range(gd.length))
                    //     .rangeRound([0, chartWidth], 0.05)
                    //     .paddingInner(0.05);
                    var graphy = d3.scaleOrdinal()
                        //.rangeRoundBands([chartHeight, 0], .1)
                        .range([0, chartHeight])
                        //.padding(0.1)
                        .domain(gd.map(function (d) {
                            return d['tag'];
                        }));

                    // var graphy =  d3.scaleBand()
                    //     .domain(d3.range(gd.length))
                    //     .rangeRound([0, chartWidth], 0.05)
                    //     .paddingInner(0.05);

                    //make y axis to show bar names
                    var yAxis = d3.axisLeft(graphy)
                        .scale(graphy)
                        //no tick marks
                        .tickSize(0)
                        //.orient("left");

                    var gy = graph.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)

                    var bars = graph.selectAll(".bar")
                        .data(gd)
                        .enter()
                        .append("g")

                    //append rects
                    bars.append("rect")
                    .attr("class", "bar")
                    .attr("y", function (d) {
                        return graphy(d['tag']);
                    })
                    //.attr("height", graphy.rangeBand())
                    .attr("height", graphy.bandwidth())
                    .attr("x", 0)
                    .attr("width", function (d) {
                        return graphx(d['value']);
                    });

                    bars.append("text")
                        .attr("class", "label")
                        //y position of the label is halfway down the bar
                        .attr("y", function (d) {
                            return graphy(d['tag']) + graphy.bandwidth() / 2 + 4;
                        })
                        //x position is 3 pixels to the right of the bar
                        .attr("x", function (d) {
                            return graphx(d['value']) + 3;
                        })
                        .text(function (d) {
                            return d['value'];
                        });
                }
});