/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file which you need to add in the index.html file. 
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
        {
            "tas": 1.96318,
            "pr": 37.2661,
            "Year": 1991,
            "Month": 1,
            "Country": "DEU"
        }
        ....
 */

console.log("Raw Data:", data);


/* TASK: Retrieve (select) the visualization container node of the div element declared within the index.html by its identifier. */
var vis = d3.select("#vis-container");


// Specify margins such that the visualization is clearly visible and no elements are invisible due to the svg border
var margins = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
};

// Specify the width and height of the svg as well as the width height of the viewport of the visualization.
var width = 800;
var height = 400;
var visWidth = width - margins.left - margins.right;
var visHeight = height - margins.top - margins.bottom;

/* TASK: Append an svg element to the vis-container, set its width and height (in pixels), add it to the vis-container, and save the element to variable called 'svg' */
var svg = vis.append("svg").attr("width", width).attr("height", height);


/* TASK: Add a group element to the svg to realize the margin by translating the group, and save the element to variable called 'viewport'. */
var viewport = svg.append("g").attr("width", visWidth).attr("height", visHeight).attr("transform", "translate(${margins.left}, ${margins.top})");


// Data Preparation: For each year we want the average rain and temperature
// TASK: Use d3.group() to group the data entries by year (see https://github.com/d3/d3-array#group)
var dataByYears = d3.group(data, d => d.Year);


// TASK: convert the Map dataByYears from d3.group() to an array to iterate over it. Read the documentation (https://github.com/d3/d3-array#group) to see how 
var dataByYearsArray = Array.from(dataByYears, ([key, value]) => ({year, entries}));


// We intialize an empty array 'avgData' which will hold the average values and the respective years
var avgData = [];

// TASK: iterate through the data by years and use the d3.mean() function to calculate the mean values of temperature and rainfall for each year
// Similarly to Ex. 1: Push one object for each year onto the 'avgData' array
dataByYearsArray.forEach((y) => {
    avgTemp = d3.mean(y.entries, d => d["tas"]);
    avgRain = d3.mean(y.entries, d => d["pr"]);

    avgData.push({
        year : y.year,
        temperature : avgTemp,
        rain : avgRain
    });
});


console.log("Average Data per Year:", avgData);

// TASK: Initialize Scales using d3.linearScale function (see https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales)
// You can make use of the d3.extent and d3.max function to calculate the domains. (see https://github.com/d3/d3-array/blob/master/README.md#statistics)
const xScale = d3.scaleLinear().domain(d3.extent(avgData.map(d => d["year"]))).range([margins.left, margins.left + visWidth]);
const yTempScale = d3.scaleLinear().domain(d3.extent(avgData.map(d => d["temperature"]))).range([margins.top + visHeight, margins.top]);
const yRainScale = d3.scaleLinear().domain(d3.extent(avgData.map(d => d["rain"]))).range([margins.top + visHeight, margins.top]);


// In order to organize our code, we add another group which will hold all elements (circles and paths) of the visualization
var visualization = viewport.append("g");
var circles = visualization.selectAll("circle")
    .data(avgData).enter();

console.log("Entered Data:", circles);

// TASK: Append one blue circle for each rain data point. Make use of the previously initialized scales and anonymous functions.
var rainCircles = circles.append("circle")
    .attr("cx", d => xScale(d["year"]))
    .attr("cy", d => yRainScale(d["rain"]))
    .attr("r", 4)
    .attr("fill", d => d3.color("blue"));


// TASK: Append one red circle for each tempera data point. Make use of the previously initialized scales and anonymous functions.
var tempCircles = circles.append("circle")
    .attr("cx", d => xScale(d["year"]))
    .attr("cy", d => yTempScale(d["temperature"]))
    .attr("r", 4)
    .attr("fill", d => d3.color("red"));


// TASK: Initialize a line generator for each line (rain and temperature) and define the generators x and y value.
// Save the line-generator to a variable
var rainLineGenerator = d3.line()
    .x(d => xScale(d["year"]))
    .y(d => yRainScale(d["rain"]));

var tempLineGenerator = d3.line()
    .x(d => xScale(d["year"]))
    .y(d => yTempScale(d["temperature"]));


// TASK: Append two path elements to the 'visualization' group. Set its 'd' attribute respectively using the linegenerators from above
// Do not forget to set the correct class attributes in order to have the stylesheet applied (.line-temp, .line-rain, .line)
var rainPath = visualization.append(path).attr("d", rainLineGenerator(avgData)).classed("line-rain", true);
var tempPath = visualization.append(path).attr("d", tempLineGenerator(avgData)).classed("line-temp", true);


// At this point we have similar state as in Exercise 1

// Lets add some axis (check https://github.com/d3/d3-axis for an example)
var axisG = viewport.append("g");

// Add X Axis for years
axisG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// TASK: append a group for the axis of the temperature on the left side (d3.axisLeft)
axisG.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yTempScale));


// TASK: append a group for the axis of the rain on the right side (d3.axisRight)
axisG.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,${visWidth})")
    .call(d3.axisLeft(yRainScale));


// TASK: append three text elements to the axisG group and label the axes respectively
axisG.append("text")
    .attr("x", width/2)
    .attr("y", height)
    .text("Year");

axisG.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text("Temperature");

axisG.append("text")
    .attr("x", width)
    .attr("y", 0)
    .text("Rain");
