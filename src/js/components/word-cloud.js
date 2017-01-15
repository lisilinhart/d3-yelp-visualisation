import * as d3 from 'd3';
import cloud from 'd3-cloud';

export default class WordCloud {
  constructor({ container, width, height, city, reviewStars, colors }) {
    console.log('----- Word Cloud Init -----');
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
  }

  updateData(city) {
    this.file = `../data/review_words_${city}_${this.reviewStars}_star.json`;
    d3.select(this.container).selectAll('svg').remove();
    this.init();
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
      .fontSize(d => fontScale(d.size))
      .padding(5)
      .on('end', this.createCloud.bind(this))
      .start();
  }

  createCloud(words) {
    const colorScale = this.colorScale;
    const opacityScale = this.opacityScale;

    this.chart = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'wordcloud')
      .append('g')
      .attr('class', 'wordgroup')
      .attr('transform', `translate(${this.height / 1.3}, ${this.height / 2})`)
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style('fill', d => colorScale(d.size))
      .style('opacity', d => opacityScale(d.size))
      .attr('transform', d => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
}
