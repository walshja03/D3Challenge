var svgWidth = 900;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
// Try a group separate from the Axis Group(Chart Group) for just the circles
// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]),
    d3.max(censusData, d => d[chosenXAxis])
    ])
    .range([0, width]);

    return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d[chosenYAxis])])
        .range([height, 0]);
    
        return yLinearScale;
    
    }


// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on yxis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
    .duration(1000)
    .call(leftAxis);
    console.log("yaxes rendered");

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, textGroup, newScale, chosenAxis) {
    xoptions =["age","income"]
    if (chosenAxis === "age"){
        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newScale(d[chosenAxis]));
        textGroup.transition()
        .duration(1000)
        .attr("x", d => newScale(d[chosenAxis]));

        return circlesGroup;
        }
    else if(chosenAxis === "income"){
        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newScale(d[chosenAxis]));
        textGroup.transition()
        .duration(1000)
        .attr("x", d => newScale(d[chosenAxis]));

        return circlesGroup;
        }
    else if(chosenAxis === "poverty"){
        console.log("Y axis coord updated")
        console.log(`newscale: ${newScale} chosenAxis: ${chosenAxis}`)
        circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newScale(d[chosenAxis]));
        textGroup.transition()
        .duration(1000)
        .attr("y", d => newScale(d[chosenAxis]));

        return circlesGroup;
        }
    else{
        circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newScale(d[chosenAxis]));
        textGroup.transition()
        .duration(1000)
        .attr("y", d => newScale(d[chosenAxis]));

        return circlesGroup;
        }
    }


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenYAxis,circlesGroup) {
    console.log(`${chosenXAxis} vs ${chosenYAxis}`)
    var label1;
    var label2;

    if (chosenXAxis === "age") {
        label1 = "Age:";
        }
    else {
        label1 = "Income:";
        }
    if (chosenYAxis === "poverty") {
        label2 = "Poverty:";
        }
    else {
        label2 = "Healthcare:";
        }
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>${label1} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

  // parse data
    censusData.forEach(function(data) {
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.healthcare = +data.healthcare
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(censusData,chosenYAxis)

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis",true)
    .call(leftAxis);

    // append a group for circles and text labels
    circleGroup =chartGroup.append("g")

    // append initial circles
    var circlesGroup =circleGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "green")
    .attr("opacity", ".5");

    //add text abbr to circles
    var textGroup= circleGroup.selectAll('text')
        .data(censusData)
        .enter()
        .append('svg:text')
        .style("text-anchor", "middle")
        .attr('font-size', '12px')
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .text(d =>{
            console.log(d.abbr)
            return d.abbr
        });

    // Create group for two x-axis labels
    var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .classed("inactive",false)
    .text("Median Age");

    var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .classed("active",false)
    .text("Median Household Income");

    var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "translate(0, 0)");

    // append y axis
    var povertyLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "poverty")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Population in Poverty (%)");

    var healthcareLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value","healthcare")
    .classed("axis-text", true)
    .classed("inactive", true)
    .text("Lacks HealthCare (%)");

  // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);
    console.log(xLabelsGroup.selectAll("text"))
    console.log(yLabelsGroup.selectAll("text"))
    console.log(chosenXAxis)
    console.log(chosenYAxis)
    // x axis labels event listener
    xLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
            console.log(circlesGroup)
            console.log(xLinearScale)
            console.log(chosenXAxis)
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
            console.log("Income Bold")
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
            ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            console.log("age bold")
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
    });
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        console.log("ylabel clicked")
        var value = d3.select(this).attr("value");
        console.log(value)
        if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);
        console.log(circlesGroup)
        console.log(yLinearScale)
        console.log(chosenYAxis)
        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, textGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "poverty") {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
            healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
    }
    });
}).catch(function(error) {
    console.log(error);
});
