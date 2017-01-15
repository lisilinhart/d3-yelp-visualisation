import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import bindAll from '../utils/bindAll';
import * as d3Ease from 'd3-ease';

export default class DonutChart {
  constructor({ data, container, city, colors }) {
    this.file = `../data/${city}_checkins_by_category.tsv`;
    this.data = data;
    this.colors = colors;
    this.container = container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.padding = 0.05;
    this.radius = Math.min(this.width, this.height) / 2;
    this.innerRadius = 0.2 * this.radius;

    bindAll(this, ['createSlices', 'updateData', 'toggleCategory', 'chartHover', 'chartHoverEnd']);
    this.init();
    this.createSlices(this.radius, this.innerRadius);
  }

  listeners() {
    window.emitter.on('updateCharts', this.updateData);
    window.emitter.on('toggleCategory', this.toggleCategory);
  }

  init() {
    this.chart = d3.select(this.container)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr('transform', `translate( ${this.width / 2}, ${this.height / 2} )`);

    this.createTip();
    this.listeners();
  }

  updateData(city) {
    this.chart.selectAll('path').remove();
    this.file = `../data/${city}_checkins_by_category.tsv`;
    this.createSlices(this.radius, this.innerRadius);
  }

  createTip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(d => `
        <span class="d3-tip-heading">${d.data.category}</span>
        <span class="d3-tip-number">${d.data.count}</span>
      `);

    this.chart.call(this.tip);
  }

  chartHover(e) {
    window.emitter.emit('toggleCategory', e.data.category, 'show');
    this.tip.show(e);
  }

  chartHoverEnd(e) {
    window.emitter.emit('toggleCategory', e.data.category, 'hide');
    this.tip.hide();
  }

  toggleCategory(category, value) {
    if (value === 'show') {
      this.chart.selectAll('.arc')
        .filter(d => d.data.category === category)
        .attr('fill', '#00b8d4');
    } else {
      this.chart.selectAll('.arc')
        .filter(d => d.data.category === category)
        .attr('fill', d => d.color);
    }
  }

  createSlices(radius, innerRadius) {
    d3.tsv(this.file, (d) => {
      const data = d;
      data.count = +data.count;
      return data;
    }, (error, data) => {
      if (error) throw error;

      this.data = data.slice(0, 10);

      const maxValue = d3.max(this.data, d => d.count);
      const minValue = d3.min(this.data, d => d.count);

      const scale = d3.scaleLinear()
      .domain([minValue - minValue * 0.4, maxValue])
      .range([0, 1]);

      const pie = d3.pie()
        .value((d) => d.count)
        .padAngle(this.padding)
        .sort(function(a, b) { return .5 - Math.random() })
        (this.data);

      const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(function (d) {
        return (radius - innerRadius) * (scale(d.data.count)) + innerRadius;
      });

      const colorScale = d3.scaleLinear()
      .domain([minValue,maxValue* 0.25,maxValue* 0.5, maxValue* 0.75,maxValue])
      .range(this.colors);

      const path = this.chart.selectAll('.solidArc')
        .data(pie)
        .enter().append('path')
        .attr('fill', d => d.color = colorScale(d.data.count))
        .attr('class', 'arc')
        .attr('transform', 'scale(0)')
        .attr('d', arc)
        .on('mouseover', this.chartHover)
        .on('mouseout', this.chartHoverEnd)
        .transition()
        .duration(1000)
        .ease(d3Ease.easeSinOut)
        .delay((d,i) => i * 100)
        .attr('transform', 'scale(1)');
    });
  }
}
