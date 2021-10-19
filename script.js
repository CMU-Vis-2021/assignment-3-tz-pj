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

    // let maxCount = d3.max(data, function (d, i) {
    //     return d['inventor_count'];
    // });
    // console.log('max:' + maxCount)


    //set colors 
    lowColor = '#EBF5FB';
    highColor = '#2874A6';

    var ramp = d3.scaleLinear()
        .domain([min,max])
        .range([lowColor,highColor]);
    //console.log(max);
    //console.log(min);

    // let inventor = data.map(function (d, i) {
    //     return d[percent];
    // });
    //console.log(inventor);
 
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

        //see this
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", tinycolor(ramp(d[percent])).darken(25).toString())
                .style("cursor", "pointer")
                displayGender(d)
                drawChart(d)
                console.log(d);
            graph.transition()
                .duration(100)
                .style("opacity", .8);
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
            d3.select("#chart")
                .transition()
                .duration(200)
                .style("opacity", 0)
                .style("display", null)
            d3.selectAll(".label")
                 .remove()
                .transition()
                .duration(100)
            // d3.selectAll(".label")
            //      .text("")
            //      .remove()
            d3.select("#chart.svg")
                .style("opacity", 0)
        //});
        });

    //state abbr
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

        //legend
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
            
        //display gender distribution
        //see this
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
            .text(()=> `Male: ${(d.inventor_count_m)} (${(d.inventor_percent_m)}%); \n\n  Female:  ${(d.inventor_count_f)} (${(d.inventor_percent_f)}%)`)

            d3.select("#chart")
            .transition()
            .duration(100)
            .style("opacity", 1)
        }
            
        //bar chart for gender distribution
        var margin = {
            top: 14,
            right: 25,
            bottom: 15,
            left: 60
        };
    
        var chartWidth = 600 - margin.left - margin.right,
            chartHeight = 100 - margin.top - margin.bottom;

        const graph = d3.select("#chart")
            .append("svg")
            .attr("width", chartWidth + margin.left + margin.right)
            .attr("height", chartHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            // var maxCount = d3.max(data, function (d) {
            //    return (datainventor_count);
            // });
            var label = ['Male','Female']

            //x scale
            //see this
            var graphx = d3.scaleLinear()
            .range([0, chartWidth])
            .domain([0,4000]);
            //.domain(d3.max(data.inventor_count))
            // .domain([0, d3.max(data, function (d) {
            //     return d.inventor_count;
            // })]);

            //y scale
            var graphy = d3.scaleOrdinal()
                .range([0, chartHeight])
                .domain(label);  //not sure if this is correct

           var y_axis = d3.axisLeft(graphy)
                .scale(graphy)
                .tickSize(0) //no tick

            graph.append("g")
                .attr("class", "y axis")
                .call(y_axis)

        // draw bar chart for gender distribution
        function drawChart(d){
            graph.selectAll('.bar2').remove()
            graph.selectAll('.bar').remove()
                        
            //draw bar1 - male
            var bar1 = graph.selectAll(".bar")
                .data(data)
                .enter()
                .append("g") 
            
            var mcount = d.inventor_count_m

            //append rects
            bar1.append("rect")
                .attr("class", "bar")
                .attr("y", d => graphy(label)) 
                .attr("height", 25) //height of the bar
                .attr("x", 5) //x position for the bar
                .attr("width", graphx(mcount))
                //console.log('mcount :' + mcount)
            
            bar1.append("text")
                    .attr("class", "label")
                    //align with the center of the bar
                    .attr("y", function (d) {
                        return graphy(label)+ 17;
                    })
                    //50px right to the bar
                    .attr("x", function (d) {
                        return graphx(mcount) + 30;
                    })
                    .attr("width", 50)
                    .attr("font-size", 10)
                    .text(mcount)

                    console.log('d.inventor_count_m :' + d.inventor_count_m)
            
            //bar 2 - female
            var bar2 = graph.selectAll(".bar2")
                    .data(data)
                    .enter()
                    .append("g") 
    
            var gcount = d.inventor_count_f
            //console.log(gcount)
                //append rects
                bar2.append("rect")
                    .attr("class", "bar")
                    .attr("y", 50) 
                    .attr("height", 25) //height of the bar
                    .attr("x", 5) //x position for the bar
                    .style("fill","lightpink")
                    //need help with the following part
                    .attr("width", function(d) {
                        return graphx(gcount);
                    });
                    console.log('d.inventor_count_f :' + d.inventor_count_f)
                
                // //append text
                bar2.append("text")
                        .attr("class", "label")
                        //align with the center of the bar
                        .attr("y", function (d) {
                            return graphy(label)+ 67;
                        })
                        //50px right to the bar
                        .attr("x", graphx(gcount) + 30)
                        //.attr("width", 10)
                        //.attr("font-size", 10)
                        .text(gcount)
                }
});