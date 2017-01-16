import * as d3 from 'd3';
import cloud from 'd3-cloud';
import d3Tip from 'd3-tip';
import * as d3Ease from 'd3-ease';
import bindAll from '../utils/bindAll';

export default class WordCloud {
  constructor({
    container,
    city,
    reviewStars,
    colors
  }) {
    this.file = `data/review_words_${city}_${reviewStars}_star.json`;
    this.reviewStars = reviewStars;
    this.colors = colors;
    this.container = container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    bindAll(this, ['updateData', 'toggleWord', 'wordHover', 'wordHoverEnd']);
    window.emitter.on('updateCharts', this.updateData);
    window.emitter.on('toggleWord', this.toggleWord);
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
    let textEl = this.container.querySelectorAll('text');

    TweenMax.set(textEl, {transformOrigin: `50% 50%`});
    TweenMax.staggerTo(textEl, 0.05, {
      scale: 0,
      ease: Sine.easeIn,
    }, 0.01, () => {
      this.file = `data/review_words_${city}_${this.reviewStars}_star.json`;
      d3.select(this.container).selectAll('svg').remove();
      this.init();
    });
  }

  createTip() {
    this.tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(d => `
        <span class="d3-tip-heading">Word Occurence</span>
        <span class="d3-tip-number">${d.wordcount.toLocaleString()}</span>
      `);
  }

  wordHover(e) {
    window.emitter.emit('toggleWord', e.text, 'show');
  }

  wordHoverEnd(e) {
    window.emitter.emit('toggleWord', e.text, 'hide');
  }

  toggleWord(word, value) {
    const el = d3.select(this.container).selectAll('text')
      .filter(d => d.text === word);
    if (value === 'show' && !el.empty()) {
      el.style('fill', '#00b8d4');
      this.tip.show(el.datum(), el.node());
    } else {
      el.style('fill', d => d.color);
      this.tip.hide();
    }
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

    const fontSize = this.width / 8;

    this.fontScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([10, fontSize]);

    const fontScale = this.fontScale;

    cloud().size([this.width - 50, this.height - 50])
      .words(this.words)
      .rotate(0)
      .fontSize((d) => {
        d.wordcount = d.size;
        return fontScale(d.size);
      })
      .padding(3)
      .on('end', this.createCloud.bind(this))
      .start();
  }

  createCloud(words) {
    const colorScale = this.colorScale;
    const opacityScale = this.opacityScale;

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
      .style('fill', d => d.color = colorScale(d.size))
      .style('opacity', d => opacityScale(d.size))
      .attr('transform', d => `scale(0) translate(${[d.x, d.y]}) rotate(${d.rotate})`)
      .text(d => d.text)
      .on('mouseover', this.wordHover)
      .on('mouseout', this.wordHoverEnd)
      .transition()
      .duration(1000)
      .ease(d3Ease.easeBackOut)
      .delay((d, i) => i * 15)
      .attr('transform', d => `scale(1) translate(${[d.x, d.y]}) rotate(${d.rotate})`);

    this.chart.call(this.tip);
  }
}