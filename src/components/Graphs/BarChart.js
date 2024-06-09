import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const TotalInsightsBySector = () => {
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
    const filteredData = data.filter((d) => d.sector);

    const margin = { top: 20, right: 150, bottom: 40, left: 40 };
    const width = 990 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Aggregate data by sector
    const sectorData = d3.rollup(
      filteredData,
      (v) => v.length,
      (d) => d.sector
    );

    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3
      .scaleBand()
      .domain(Array.from(sectorData.keys()))
      .range([0, width])
      .padding(0.2)
      .paddingOuter(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(Array.from(sectorData.values()))])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .selectAll(".bar")
      .data(Array.from(sectorData.entries()))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[0]))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => colors(i))
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => height - y(d[1]));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0));

    svg.select(".x-axis").selectAll("text").remove();

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
    const legend = svg
      .selectAll(".legend")
      .data(Array.from(sectorData.keys()))
      .enter()
      .append("g")
      .attr("class", "legend")

      .attr("transform", (d, i) => `translate(${width + 10},${i * 20})`);

    legend
      .append("rect")

      .attr("width", 18)
      .attr("height", 18)

      .style("fill", (d, i) => colors(i));

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".20rem")
      .style("font-size", "10px")
      .text((d) => d);
  };

  return (
    <div>
      <h1>Total Insights by Sector</h1>
      <div ref={chartRef}></div>
    </div>
  );
};

export default TotalInsightsBySector;
