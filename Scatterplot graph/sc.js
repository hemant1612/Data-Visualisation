axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function(response) {

    console.log(response);
    makeGraph(response.data);
  })
  .catch(function(error) {
    console.log(error);
  });


function makeGraph(data){

  var formatCount = d3.format(",.0f"),
  formatTime = d3.time.format("%H:%M"),
  formatMinutes = function(d) {
    var t = new Date(2012, 0, 1, 0,d)
    t.setSeconds(t.getSeconds() + d);
    return formatTime(t);
  };

  d3.select(".notes")
    .append("text")
    .text("Minutes Behind Fastest Time");


  var margin = {
      top: 20,
      right: 10,
      bottom: 30,
      left: 75
    },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


  var minTime = d3.min(data, function(d){
      return d.Seconds;
  })

  var maxTime = d3.max(data,function(d){
    return d.Seconds;
  })

  var minDate =  new Date('01 04 2018 01:00:37');
  var maxDate =  new Date('01 04 2018 01:04:00');

  var yScale = d3.scale.linear()
    .domain([1, 36])
    .range([0, height]);

  var xScale = d3.scale.linear()
    .domain([60 * 3.5, 0])
    .range([0, width]);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(8)
    .orient("left");

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(6)
    .orient("bottom")
    .tickFormat(formatMinutes);


  var div = d3.select(".card").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.8em")
    .style("text-anchor", "end")
    .text("World Ranking");




  chart.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cursor","pointer")
    .attr("cx", function(d) {
      return xScale(d.Seconds - 2210);
    })
    .attr("cy", function(d,i) {
      return (width/52.5)*i;
    })
    .attr("r",   5 )
    .attr("fill", function(data){
      return data.Doping ? "rgba(3,102,78,.98)" : "rgb(101,241,16)"
    })
    .on("mouseover", function(d) {
      var circ = d3.select(this);
     //console.log(rect);
      circ.attr("class", "mouseover");
      div.transition()
        .duration(200)
        .style("opacity", 0.9);
      div.html("<span class=`info`>" + d.Name +
      "</span><br/> <span class='info'>Nation: " + d.Nationality +
      "</span><br/> <span class='info'>Time: " + d.Time +
      "</span><br/> <span class='info'> " + (d.Doping? d.Doping : "No Doping") +
      "</span>")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 50) + "px");
    })
    .on("mouseout", function() {
      var rect = d3.select(this);
      rect.attr("class", "mouseoff");
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })


    // chart.selectAll("text")
    //   .data(data)
    //   .enter().append("text")
    //   .text(function(d,i) {
    //     return i;
    //   })
    //
    //   .attr("x", function(d) {
    //     return xScale(d.Seconds - 2210);
    //   })
    //   .attr("y", function(d,i) {
    //     return (width/52.5)*i;
    //   })
    //   .attr("transform","rotate(10 10,20)")





}
