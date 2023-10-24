const h1Element = d3.select("#result");

function sum() {
  var value_1 = parseInt(d3.select("#number-1").property("value"));
  var value_2 = parseInt(d3.select("#number-2").property("value"));
  var result = value_1 + value_2;
  addResultToList(result);
  h1Element.text(result);
  console.log(result);
  updateChart()
}

function minus() {
  var value_1 = parseInt(d3.select("#number-1").property("value"));
  var value_2 = parseInt(d3.select("#number-2").property("value"));
  var result = value_1 - value_2;
  addResultToList(result);
  console.log(result);
  h1Element.text(result);
  updateChart()
}

function multip() {
  var value_1 = parseInt(d3.select("#number-1").property("value"));
  var value_2 = parseInt(d3.select("#number-2").property("value"));
  var result = value_1 * value_2;
  addResultToList(result);
  console.log(result);
  h1Element.text(result);
  updateChart()
}

function division() {
  var value_1 = parseInt(d3.select("#number-1").property("value"));
  var value_2 = parseInt(d3.select("#number-2").property("value"));
  var result = value_1 / value_2;
  addResultToList(result);
  console.log(result);
  h1Element.text(result);
  updateChart()
}

function clearCalculator() {
  var value_1 = d3.select("#number-1");
  var value_2 = d3.select("#number-2");
  value_1.property("value", "");
  value_2.property("value", "");
  h1Element.text("");
}

function addResultToList(sonuc) {
  const tarih = new Date();
  const saat = `${tarih.getHours()}:${tarih.getMinutes()}:${tarih.getSeconds()}`;

  const yeniSonuc = { result: Math.abs(sonuc), time: saat };

  let sonuclar = JSON.parse(localStorage.getItem("result")) || [];

  sonuclar.push(yeniSonuc);

  localStorage.setItem("result", JSON.stringify(sonuclar));
}

function clearLocalStorage() {
    localStorage.clear();
    alert("Your chart has been cleared.");
    updateChart()
}

function updateChart() {
    // Define the data from localStorage
    var data = JSON.parse(localStorage.getItem("result")) || [];

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 90, left: 40 },
        width = 460 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // Clear the existing chart
    d3.select("#chart").html("");

    // append the svg object to the body of the page
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d.time; }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.result; })])
        .nice()
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.time); })
        .attr("width", x.bandwidth())
        .attr("fill",  (d, i) => { return color(i); }) // Her çubuğa farklı renk atama
        .attr("y", function (d) { return y(0); })
        .attr("height", 0);

    // Animation
    svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", function (d) { return y(d.result); })
        .attr("height", function (d) { return height - y(d.result); })
        .delay(function (d, i) { return i * 100; });
}


updateChart()