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

    // var gender = document.getElementById("gender-select");
    // var genderValue = gender.value;
    var percent = 'inventor_percent'
    // console.log(genderValue)

// get the gender dropdown value and update the percent
//     let inventorPercent = data.map(function (d, i) {
//         if(genderValue == "female"){
//             return d.inventor_percent_f;
//         }
//         else if(genderValue == "male"){
//             return d.inventor_percent_m;
//         }
//         else if (genderValue == "all"){
//             return d.inventor_percent;
//         }
//         else {
//             percent = 'inventor_percent';
//         }
//     });
// }
//     console.log(genderValue +': ' +inventorPercent);


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

//     var pie_m = d3.pie().value(function(d, i) { 
//         return d.inventor_percent_m; 
//     });

//     var pie_f = d3.pie().value(function(d, i) { 
//         return d.inventor_percent_f; 
//     });
//     var arc = d3.selectAll("#vis")
//            .data(pie_m(data))
//            .data(pie_f(data))
//            .enter();

//    var path = d3.arc()
//        .outerRadius(200)
//        .innerRadius(0);

//     arc.append("path")
//        .attr("d", path)
//         .attr("fill", function(d) { return ramp(d.data.name); });

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
                //drawChart(d);

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


            // function updateLegend(newData) {

            //     // bind data
            //     var appending = svg.selectAll('rect')
            //        .data(newData);
            
            //     // add new elements
            //     appending.enter().append('rect');
            
            //     // update both new and existing elements
            //     appending.transition()
            //         .duration(0)
            //         .attr("width",function (d) {return d.y; });
            
            //     // remove old elements
            //     appending.exit().remove();
            
            // }

            // updateLegend(inventor);

            // d3.select('#gender-select')
            //     .on('change', function() {
            //     var newData = eval(d3.select(this).property('value'));
            //     updateLegend(newData);
            //     });
            
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

            // function hideGender(d){
            //     // d3.select("#gender")
            //     //   .text("\u00A0");
            //     d3.select("#gender")
            //       .transition()
            //       .duration(200)
            //       .style("opacity", 0)
            //     d3.select("#title")
            //       .transition()
            //       .duration(200)
            //       .style("opacity", 0)
            // }
            
            let gd = data.map(function (d, i) {
                return [{'value': d.state, 'male' : d.inventor_percent_m, 'female' : d.inventor_percent_f}];
            });
            console.log(gd);
            

            function drawChart(d){
                var graph = d3.select("#pieChart")
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", 200)
                    .append("g")
                    .attr("transform",
                        "translate(" + 60 + "," + 30 + ")");
                var mi = data.map(function(d,i){
                    if (d.state == d.value) {
                    return d.inventor_percent_m
                }
                })
                var fi = data.map(function(d,i){
                    if (d.state == d.value){
                    return d.inventor_percent_f
                    }
                })

                var newData = [mi,fi];
                    // X axis
                    var x = d3.scaleBand()
                    .range([ 0, 300])
                    .domain(data.map(function(d) { return d.value; }))
                    .padding(0.2);
                    graph.append("g")
                    .attr("transform", "translate(0," + 200 + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                    // Add Y axis
                    var y = d3.scaleLinear()
                    .domain([0, 13000])
                    .range([ 200, 0]);
                    graph.append("g")
                    .call(d3.axisLeft(y));

                    // Bars
                    graph.selectAll("mybar")
                    .data(newData)
                    .enter()
                    .append("rect")
                    .attr("x", function(d) {return x(d.state); })
                    .attr("y", function(d) {return y(d.inventor_percent_m);})
                    .attr("y2", function(d) {return y(d.inventor_percent_f);})
                    .attr("width", x.bandwidth())
                    .attr("height", function(d) { return 200 - y(d.inventor_percent_f); })
                    .attr("fill", "#69b3a2")

                    }
                                    
                    // var bar = graph.selectAll("g") 
                    // .data(gd)
                    // .enter()
                    // .append("g")
                    
                    // bar.append("rect")
                    //     .attr("width", function(d) {
                    //         return d.value * 20;
                    // })
                    // .attr("height", 20 - 1);

                    // bar.append("text")
                    //     .attr("x", function(d) { return (d.value*20); })
                    //     .attr("y", 20 / 2)
                    //     //.attr("dy", ".35em")
                    //     .text(function(d) { return d.key;});
 //           }
});