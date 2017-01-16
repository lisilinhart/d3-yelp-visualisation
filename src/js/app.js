import TinyEmitter from 'tiny-emitter';
import TweenMax from 'gsap';
import Navigation from './components/navigation';
import BarChart from './components/bar-chart';
import WordCloud from './components/word-cloud';
import DonutChart from './components/donut-chart';

class Application {
  constructor() {
    window.emitter = new TinyEmitter();

    this.tl = new TimelineLite();
    this.nav = new Navigation();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container = document.querySelector('#app');
    this.colors = ['#C9E4CA', '#87BBA2', '#55828B', '#3B6064', '#364958'];
    this.colorsNegative = ['#FF9996', '#FC716C', '#E55752', '#C4302B', '#93221F'];
    this.headings = document.querySelectorAll('.chart-container h2');

    this.animateIn();
  }

  animateIn() {
    TweenMax.set(this.headings, { autoAlpha: 0 });

    TweenMax.staggerFromTo([this.nav.heading, ...this.nav.links, this.nav.yelp], 0.35, {
      autoAlpha: 0,
      y: 80,
    }, {
      autoAlpha: 1,
      y: 0,
      ease: Back.easeOut,
    }, 0.15, this.initCharts.bind(this));
  }

  initCharts() {
    TweenMax.delayedCall(0.2, () => {
      this.donutChart = new DonutChart({
        city: 'edinburgh',
        container: this.container.querySelector('.donut-chart'),
        colors: this.colors,
      });
      TweenMax.to(this.headings[0], 0.3, { autoAlpha: 1 });
    });


    TweenMax.delayedCall(0.8, () => {
      this.barChart = new BarChart({
        city: 'edinburgh',
        container: this.container.querySelector('.bar-chart'),
        colors: this.colors,
      });
      TweenMax.to(this.headings[1], 0.3, { autoAlpha: 1 });
    });

    TweenMax.delayedCall(2, () => {
      this.wordCloud = new WordCloud({
        city: 'edinburgh',
        reviewStars: 5,
        container: this.container.querySelector('.word-cloud-positive'),
        colors: this.colors,
      });
      TweenMax.to(this.headings[2], 0.3, { autoAlpha: 1 });
    });

    TweenMax.delayedCall(3.4, () => {
      this.wordCloud2 = new WordCloud({
        city: 'edinburgh',
        reviewStars: 1,
        container: this.container.querySelector('.word-cloud-negative'),
        colors: this.colorsNegative,
      });
      TweenMax.to(this.headings[3], 0.3, { autoAlpha: 1 });
    });
  }
}

window.Application = new Application();