import * as d3 from "d3";

const margin = {top: 40, bottom: 10, left: 120, right: 20};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
// Creates sources <svg> element
const svg = d3.select('#app').append('svg')
            .attr('width', width+margin.left+margin.right)
            .attr('height', height+margin.top+margin.bottom);
// Group used to enforce margin
const data = [66.38, 21.51, 23.37, 34.17, 36.21];

const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);



// Global variable for all data
const bar_height = 50;
const rects = g.selectAll('rects').data(data)

const rect_enter = rects.enter().append('rect');
rect_enter.append('title');

rects.merge(rect_enter)
  .attr('height', bar_height)
  .attr('width', (d,i) => d*7)
  .attr('fill', '#ff0000')
  .attr('y', (d,i) => i*(bar_height + 5))
  .select('title').text((d) => d);

rects.exit().remove();
