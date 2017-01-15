import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import bindAll from '../utils/bindAll';

export default class BarChart {
  constructor({ data, container, city, colors }) {
    console.log('----- Bar Chart Init -----');
    this.file = `../data/${city}_categories_reviews.tsv`;
    this.data = data;
    this.colors = colors;
    this.container = container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.padding = 5;
    this.barWidth = 10;

    bindAll(this, ['createAxis', 'createBars', 'updateData']);
    this.init();
    this.createBars();
    this.createTip();
  }

  init() {
    this.chart = d3.select(this.container)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width + 10} ${this.height + 80}`);

    window.emitter.on('updateCharts', this.updateData.bind(this));
  }

  updateData(city) {
    this.chart.selectAll('.x-axis').remove();
    this.file = `../data/${city}_categories_reviews.tsv`;
    this.chart.selectAll('.bar').remove();
    this.createBars();
  }

  createAxis(xScale) {
    const xAxis = d3.axisBottom(xScale);

    this.chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.height} )`)
      .call(xAxis)
      .selectAll('text')
      .attr('y', 0)
      .attr('x', 9)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(55)')
      .style('text-anchor', 'start');
  }

  createTip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        return `<strong>Reviews:</strong> <span>${d.count}</span>`;
      });

    this.chart.call(this.tip);
  }

  createBars() {
    d3.tsv(this.file, (d) => {
      const data = d;
      data.count = +data.count;
      return data;
    }, (error, data) => {
      if (error) throw error;

      data = data.slice(0, 10);
      this.data = data;
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

      this.createAxis(xScale);
      const tip = this.tip;

      const chartBars = this.chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('transform-origin', '100% 100%')
        .attr('y', d => height)
        .attr('height', d => 0)
        .attr('fill', (d, i) => colorScale(d.count))
        .attr('x', d => xScale(d.categories))
        .attr('width', xScale.bandwidth())
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 15)
        .attr('height', d => yScale(d.count))
        .attr('y', d => height - yScale(d.count));
    });
  }
}
