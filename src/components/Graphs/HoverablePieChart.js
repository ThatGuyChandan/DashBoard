import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const HoverablePieChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState("intensityCountry");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coffee")
      .then((response) => {
        setData(response.data);
        drawChart(response.data, selectedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedData]);

  const drawChart = (data, dataType) => {
    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const width = 350;
    const height = 350;
    const margin = 10;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height + margin * 2)
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2 + margin}, ${height / 2 + margin})`
      );

    // Filter out entries with null or empty values
    const filteredData = data.filter((d) =>
      dataType === "intensityCountry" ? d.country : d.region
    );

    // Create a tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("opacity", 0);

    // Aggregate data based on selected type
    const aggregatedData = d3.rollup(
      filteredData,
      (v) => v.length,
      (d) => (dataType === "intensityCountry" ? d.country : d.region)
    );

    const color = d3
      .scaleOrdinal()
      .domain(aggregatedData.keys())
      .range(d3.schemeCategory10);

    const pie = d3.pie().value((d) => d[1]);

    const data_ready = pie(Array.from(aggregatedData));

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(d.data[0])
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      })
      .on("mouseleave", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  };

  return (
    <div>
      <h2>Hoverable Pie Chart</h2>
      <div>
        <label>Select Data: </label>
        <select onChange={(e) => setSelectedData(e.target.value)}>
          <option value="intensityCountry">Intensity vs Country</option>
          <option value="regionIntensity">Region vs Intensity</option>
        </select>
      </div>
      <div ref={chartRef}></div>
    </div>
  );
};

export default HoverablePieChart;
