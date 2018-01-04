axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json').then(function(response) {
  console.log(response.data);

  var maxVariance = response.data.monthlyVariance.map(function(v){
    return v.variance;
  }).reduce(function(a,b){
    return a > b?a:b
  },-1000);

  var minVariance = response.data.monthlyVariance.map(function(v){
    return v.variance;
  }).reduce(function(a,b){
    return a < b? a:b
  },1000000);

  makeHeatMap(response.data.monthlyVariance);

  // console.log(maxVariance); 5.2
  // console.log(minVariance); 6.9
}).catch(function(error) {
  console.log(error);
});


function makeHeatMap(data){
// 
// d3.select(".notes")
//   .append("text")
//   .text("Time In Years")
//   .style("font-weight","bold")
//

var margin = {
    top: 20,
    right: 10,
    bottom: 30,
    left: 100
  },
  width = 1120 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom ;

  const minDate = new Date('01 01 1753');
  const maxDate = new Date('12 12 2015');


formatMonths = (month) => {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month-1];
}


var yScale = d3.scale.linear()
  .domain([1,13])
  .range([0, height]);

var xScale = d3.time.scale()
  .domain([minDate, maxDate])
  .range([0, width]);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .ticks(12)
  .orient("left")
  .tickFormat(formatMonths)


var xAxis = d3.svg.axis()
  .scale(xScale)
  .ticks(d3.time.years,10)
  .orient("bottom")
//
//
//
var div = d3.select(".card").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);



var chart = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom+100)
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
  .attr("y", "-80")
  .attr("x" , "-200")
  .attr("dy", "0.8em")
  .style("text-anchor", "end")
  .text("Month")
  .style("font-weight","bold");


chart.selectAll(".svg")
  .data(data)
  .enter().append("rect")
  .attr("cursor","pointer")
  .attr("x", function(d) {
    return xScale(new Date('01 01 '+d.year));
  })
  .attr("y", function(d,i) {
    return yScale(d.month);
  })
  .attr("width",  width/263)
  .attr("height", height/12  )
  .attr("fill", function(data){
      if(data.variance <= -6) return 'rgb(126,2,250)'
      if(data.variance <= -5) return 'rgba(7,204,247,.97)'
      if(data.variance <= -4) return 'rgba(0,110,134,.88)'
      if(data.variance <= -3) return 'rgba(31,255,228,.5)'
      if(data.variance <= -2) return 'rgba(28,187,222,.74)'
      if(data.variance <= -1) return 'rgba(0,255,156,.82)'
      if(data.variance <= 0)  return 'rgba(255,252,0,.8)'
      if(data.variance <= 1)  return 'rgba(255,139,18,.84)'
      if(data.variance <= 2)  return 'rgba(255,122,14,.94)'
      if(data.variance <= 3)  return 'rgba(255,115,0,1)'
      if(data.variance <= 4)  return 'rgba(184,76,42,.77)'
      if(data.variance <= 5)  return 'rgba(255,0,0,.7)'
      if(data.variance <= 6)  return 'rgba(255,0,0,1)'
  })
  .on("mouseover", function(d) {
    var bar = d3.select(this);
  // console.log(rect);
    bar.attr("class", "mouseover");
    div.transition()
      .duration(200)
      .style("opacity", 0.9);
    div.html("<span class=`info-year`>" + d.year +"-"+formatMonths(d.month)+
    "</span><br/> <span class='info-temp'> " + (8.600 + d.variance).toPrecision(4)  +"°C"+
    "</span><br/> <span class='info'> " + d.variance +
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

var gridColorData = [
       'rgb(126,2,250)',
       'rgba(7,204,247,.97)',
       'rgba(0,110,134,.88)',
       'rgba(31,255,228,.5)'  ,
       'rgba(28,187,222,.74)',
       'rgba(0,255,156,.82)',
       'rgba(255,252,0,.8)',
       'rgba(255,139,18,.84)',
       'rgba(255,122,14,.94)',
       'rgba(255,115,0,1)',
       'rgba(184,76,42,.7)',
        'rgba(255,0,0,.7)',
       'rgba(255,0,0,1)']


       chart.selectAll(".svg")
         .data(gridColorData)
         .enter().append("rect")
         .attr("x", function(d,i){
           return 750+i*20 })
         .attr("y",480)
         .attr("width",20)
         .attr("height",10)
         .attr("fill",function(d){
          return d;
        });

        chart.selectAll(".svg")
          .data(gridColorData)
          .enter().append("text")
          .attr("x", function(d,i){
            return 765+i*20 })
          .attr("y",505)
          .attr("width",20)
          .attr("height",15)
          .text(function(d,i){
           return -7+i;
         });

         chart.append("text")
            .attr("x",500)
            .attr("y",500)
            .attr("width",20)
            .attr("height",15)
            .text("Years")
            .style("font-weight","bold")
            .style("font-size" ,"20px")

}
