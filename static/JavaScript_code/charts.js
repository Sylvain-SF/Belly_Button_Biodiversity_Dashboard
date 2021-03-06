function init() {
    // Grab a reference to the dropdown select element:
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options:
    d3.json("static/data/samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots:
        var firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });
}

// Initialize the dashboard:
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
};

// Demographics Panel:
function buildMetadata(sample) {
    d3.json("static/data/samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        // Use d3 to select the panel with id of '#sample-metadata':
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};

// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file
    d3.json("static/data/samples.json").then((data) => {
        // 3. Create a variable that holds the samples array.
        var samples = data.samples

        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var sampleResultArray = samples.filter(duVeau => duVeau.id == sample);
        console.log(sampleResultArray);

        //  5. Create a variable that holds the first sample in the array.
        var firstSample = sampleResultArray[0];
        console.log(firstSample);

        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var ids = firstSample.otu_ids;
        console.log(ids);
        var labels = firstSample.otu_labels.slice(0, 10).reverse();
        console.log(labels);
        var values = firstSample.sample_values.slice(0, 10).sort((a, b) => a - b);
        console.log(values);

        // 7. Create the yticks for the bar chart.
        // Hint: Get the top 10 otu_ids and map them in descending order
        //  so the otu_ids with the most bacteria are last.
        var yticks = ids.map(michel => "OTU " + michel).slice(0, 10).reverse();

        // 8. Create the trace for the  horizontal bar chart.
        var barData = [{
        x: values,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: labels
        }];
        // 9. Create the layout for the bar chart.
        var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        height:450
        }

        // 10. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bar", barData, barLayout)

        // Create variables that hold otu_labels, and sample_values for the bubble chart.
        var bubbleLabels = firstSample.otu_labels
        var bubbleValues = firstSample.sample_values

        // 1. Create the trace for the bubble chart.
        var bubbleData = [{
            x: ids,
            y: bubbleValues,
            mode: "markers",
            marker:{
                size: bubbleValues,
                color: ids
                },
            text: bubbleLabels
        }];

        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
          title: 'Bacteria Cultures Per Sample',
          height:600,
          xaxis: {
            title: "OTU ID"
          },
          hovermode: "closest"
          };

        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout)

        // Create variables that hold the washing frequency from the metadata.
        const metadata = data.metadata
        const sampleMetadata = metadata.filter(duVeau => duVeau.id == sample);
        const washingFreq = sampleMetadata[0].wfreq

        // 4. Create the trace for the gauge chart.
        var gaugeData = [
        {
            value: washingFreq,
            type: "indicator",
		    mode: "gauge+number",
		      gauge: {
		      bar: { color: "black" },
              axis: { range: [0, 10] },
              steps:[
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "orange" },
                    { range: [4, 6], color: "yellow" },
                    { range: [6, 8], color: "lightgreen" },
                    { range: [8, 10], color: "green" }
                    ],
            }
        }];

        // 5. Create the layout for the gauge chart.
        var gaugeLayout = {
            title:{text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week</br>"}
            };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout)

    });
}