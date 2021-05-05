import * as d3 from 'd3';
// import PropTypes from 'prop-types'
import { useRef, useEffect, useState } from 'react'
import 'd3';
import axios from 'axios';

// cite: https://www.d3-graph-gallery.com/graph/scatter_basic.html
var data = [
  [10, 20], [20, 100], [200, 50],
  [25, 80], [10, 200], [150, 75],
  [10, 70], [30, 150], [100, 15]
]

const ScatterChart = props => {
    const ref = useRef()


    useEffect( ()=>{

    var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

            const svg = d3.select(ref.current).attr("viewBox", [0,0, width, height])
  svg.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 200])
    .range([ 0, width ]);

  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 250])
    .range([ height, 0]);
    
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d[0]); } )
      .attr("cy", function (d) { return y(d[1]); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

    }, [data])

    const style = {
        "overflow-y": 'scroll',
    }
    return (
        <svg style={style} ref={ref}></svg>
    )
}

// ScatterChart.propTypes = {

// }

export default ScatterChart
