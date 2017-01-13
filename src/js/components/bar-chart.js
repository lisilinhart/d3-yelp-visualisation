import * as d3 from 'd3';

export default class BarChart {
  constructor({ data, container, width, height, file }) {
    console.log('----- Bar Chart Init -----');
    this.file = `../data/${file}.csv`;
    this.data = data;
    this.container = container;
    this.width = width;
    this.height = height;

    this.padding = 5;
    this.barWidth = 10;

    this.init();
    this.createBars();
  }

  init() {
    this.chart = d3.select(this.container)
      .style('background', 'rgb(240, 240, 240)')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  createBars() {
    d3.tsv(this.file, (d) => {
      const data = d;
      data.count = +data.count;
      return data;
    }, (error, data) => {
      if (error) throw error;

      data = data.slice(1, 10);
      const height = this.height;

      const xScale = d3.scaleBand()
        .rangeRound([0, this.width]).padding(0.5)
        .domain(data.map(d => d.name));
      const yScale = d3.scaleLinear()
        .rangeRound([this.height, 0])
        .domain([0, d3.max(data, d => d.count)]);
      const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb('#64b5f6'), d3.rgb('#0d47a1')]);

      const chartBars = this.chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('fill', (d, i) => colorScale(i))
        .attr('x', d => xScale(d.name))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count));
    });
  }
}
