import TinyEmitter from 'tiny-emitter';
import Navigation from './components/navigation';
import BarChart from './components/bar-chart';
import WordCloud from './components/word-cloud';
import DonutChart from './components/donut-chart';

class Application {
  constructor() {
    window.emitter = new TinyEmitter();

    this.navigation = new Navigation();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container = document.querySelector('#app');
    this.colors = ['#C9E4CA', '#87BBA2', '#55828B', '#3B6064', '#364958'];
    // this.colors = ['#220901', '#621708', '#941B0C', '#BC3908', '#F6AA1C'];
    // this.colors = ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#656D77'];

    this.initCharts();
  }

  initCharts() {
    this.barChart = new BarChart({
      city: 'edinburgh',
      container: this.container.querySelector('.bar-chart'),
      colors: this.colors,
    });

    this.wordCloud = new WordCloud({
      city: 'edinburgh',
      reviewStars: 5,
      container: this.container.querySelector('.word-cloud-positive'),
      colors: this.colors,
    });

    this.wordCloud = new WordCloud({
      city: 'edinburgh',
      reviewStars: 1,
      container: this.container.querySelector('.word-cloud-negative'),
      colors: this.colors,
    });

    this.donutChart = new DonutChart({
      city: 'edinburgh',
      container: this.container.querySelector('.donut-chart'),
      colors: this.colors,
    });
  }
}

window.Application = new Application();
