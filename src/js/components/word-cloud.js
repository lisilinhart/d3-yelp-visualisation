import * as d3 from 'd3';
import cloud from 'd3-cloud';
import d3Tip from 'd3-tip';

export default class WordCloud {
  constructor({ container, width, height, city, reviewStars, colors }) {
    this.file = `../data/review_words_${city}_${reviewStars}_star.json`;
    this.reviewStars = reviewStars;
    this.colors = colors;
    this.container = container;
    this.width = width;
    this.height = height;

    window.emitter.on('updateCharts', this.updateData.bind(this));
    this.init();
  }

  init() {
    d3.json(this.file, (json) => {
      this.words = json;
      this.processWords();
    });
    this.createTip();
  }

  updateData(city) {
    this.file = `../data/review_words_${city}_${this.reviewStars}_star.json`;
    d3.select(this.container).selectAll('svg').remove();
    this.init();
  }

  createTip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html((d) => {
        return `Occurence: <span>${d.wordcount}</span>`;
      });
  }

  processWords() {
    const maxValue = d3.max(this.words, d => d.size);
    const minValue = d3.min(this.words, d => d.size);

    this.colorScale = d3.scaleLinear()
      .domain([0, 30, 50, 80, 100])
      .interpolate(d3.interpolateHcl)
      .range([
        d3.rgb(this.colors[0]),
        d3.rgb(this.colors[1]),
        d3.rgb(this.colors[2]),
        d3.rgb(this.colors[3]),
        d3.rgb(this.colors[4]),
      ]);

    this.opacityScale = d3.scaleLinear()
      .domain([0, 100])
      .range([1.0, 0.2]);

    this.fontScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([10, 100]);

    const fontScale = this.fontScale;

    cloud().size([this.width - 50, this.height - 50])
      .words(this.words)
      .rotate(0)
      .fontSize((d) => {
        d.wordcount = d.size;
        return fontScale(d.size);
      })
      .padding(5)
      .on('end', this.createCloud.bind(this))
      .start();
  }

  createCloud(words) {
    const colorScale = this.colorScale;
    const opacityScale = this.opacityScale;
    const tip = this.tip;

    this.chart = d3.select(this.container)
      .append('svg')
      .attr('class', 'wordcloud')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .append('g')
      .attr('class', 'wordgroup')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('fill', d => colorScale(d.size))
      .style('opacity', d => opacityScale(d.size))
      .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
      .text(d => d.text)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    this.chart.call(this.tip);
  }
}
