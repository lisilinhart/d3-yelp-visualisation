import * as d3 from 'd3';

export default class BarChart {
  constructor({ data, container, width, height, city, colors }) {
    console.log('----- Bar Chart Init -----');
    this.file = `../data/${city}_categories_reviews.csv`;
    this.data = data;
    this.colors = colors;
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
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    window.emitter.on('updateCharts', this.updateData.bind(this));
  }

  updateData(city) {
    this.file = `../data/${city}_categories_reviews.csv`;
    this.chart.selectAll('.bar').remove();
    this.createBars();
  }

  createBars() {
    d3.tsv(this.file, (d) => {
      const data = d;
      data.count = +data.count;
      return data;
    }, (error, data) => {
      if (error) throw error;

      data = data.slice(0, 10);
      const height = this.height;
      const width = this.width;
      const maxValue = d3.max(data, d => d.count);

      const xScale = d3.scaleBand()
        .rangeRound([0, width]).padding(0.5)
        .domain(data.map(d => d.categories));

      const yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([maxValue, 0]);

      const colorScale = d3.scaleLinear()
        .domain([0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue])
        .interpolate(d3.interpolateHcl)
          .range([d3.rgb(this.colors[0]),
            d3.rgb(this.colors[1]),
            d3.rgb(this.colors[2]),
            d3.rgb(this.colors[3]),
            d3.rgb(this.colors[4]),
          ]);

      const chartBars = this.chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('y', d => height + yScale(d.count))
        .attr('fill', (d, i) => colorScale(d.count))
        .attr('x', d => xScale(d.categories))
        .attr('width', xScale.bandwidth())
        .transition()
          .duration(1000)
          .delay((d, i) => i * 15)
          .attr('height', d => yScale(d.count))
          .attr('y', d => height - yScale(d.count));
    });
  }
}
