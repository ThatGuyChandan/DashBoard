import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
const Scatter = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coffee")
      .then((response) => {
        drawChart(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const drawChart = (data) => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 100, left: 40 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare the data
    const intensityExtent = d3.extent(data, (d) => d.intensity);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.region))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, intensityExtent[1]])
      .nice()
      .range([height, 0]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Add dots
    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.region) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.intensity))
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .style("opacity", 0.7)
      .attr("stroke", "white");

    // Add X axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 40)
      .text("Region");

    // Add Y axis label
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -margin.top)
      .text("Intensity");
  };

  return (
    <div>
      <h2>Region vs Intensity Scatter Plot</h2>
      <div ref={chartRef}></div>
    </div>
  );
};

export default Scatter;
