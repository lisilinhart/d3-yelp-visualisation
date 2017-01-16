import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as d3Ease from 'd3-ease';
import bindAll from '../utils/bindAll';

export default class BarChart {
  constructor({ data, container, city, colors }) {
    this.file = `data/${city}_categories_reviews.tsv`;
    this.data = data;
    this.colors = colors;
    this.container = container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.padding = 5;
    this.barWidth = 10;

    bindAll(this, ['createAxis', 'createBars', 'updateData', 'toggleCategory', 'chartHover', 'chartHoverEnd']);
    this.init();
    this.createBars();
    this.createTip();
  }

  listeners() {
    window.emitter.on('updateCharts', this.updateData);
    window.emitter.on('toggleCategory', this.toggleCategory);
  }

  init() {
    this.chart = d3.select(this.container)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height + 1}`);
    this.listeners();
  }



  updateData(city) {
    let bars = [...this.container.querySelectorAll('.bar')].reverse();

   TweenMax.staggerTo(bars, 0.11, {
      y: this.height,
      scaleY: 0,
      opacity: 0,
      ease: Sine.easeIn,
    }, 0.04, () => {
      this.chart.selectAll('.x-axis').remove();
      this.file = `data/${city}_categories_reviews.tsv`;
      this.chart.selectAll('.bar').remove();
      this.createBars();
    });
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
      .attr('opacity', 0)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(55)')
      .style('text-anchor', 'start')
      .transition()
      .duration(1000)
      .attr('opacity', 1);
  }

  createTip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        return `<span class="d3-tip-heading">${d.categories}</span>
                <span class="d3-tip-number">${d.count.toLocaleString()}</span>`;
      });

    this.chart.call(this.tip);
  }

  chartHover(e) {
    window.emitter.emit('toggleCategory', e.categories, 'show');
  }

  chartHoverEnd(e) {
    window.emitter.emit('toggleCategory', e.categories, 'hide');
  }

  toggleCategory(category, value) {
    const el = this.chart.selectAll('.bar')
      .filter(d => d.categories === category);
    if (value === 'show' && !el.empty()) {
      el.attr('fill', '#00b8d4');
      this.tip.show(el.datum(), el.node());
    } else {
      el.attr('fill', d => d.color);
      this.tip.hide();
    }
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
        .range([
          d3.rgb(this.colors[0]),
          d3.rgb(this.colors[1]),
          d3.rgb(this.colors[2]),
          d3.rgb(this.colors[3]),
          d3.rgb(this.colors[4]),
        ]);

      this.createAxis(xScale);

      this.chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color = colorScale(d.count))
        .attr('x', d => xScale(d.categories))
        .attr('width', xScale.bandwidth())
        .on('mouseover', this.chartHover)
        .on('mouseout', this.chartHoverEnd)
        .transition()
        .duration(500)
        .ease(d3Ease.easeBackOut)
        .delay((d, i) => (i * 100) + 300)
        .attr('height', d => yScale(d.count))
        .attr('y', d => height - yScale(d.count));
    });
  }
}
