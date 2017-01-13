import * as d3 from 'd3';
import TinyEmitter from 'tiny-emitter';

import Navigation from './components/navigation';

import BarChart from './components/bar-chart';

class Application {
  constructor(options) {
    console.log('--------- App Init ---------');
    window.emitter = new TinyEmitter();

    this.navigation = new Navigation();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container = document.querySelector('#app');
    this.colors = ['#364958', '#3B6064', '#55828B', '#87BBA2', '#C9E4CA'];
    // this.colors = ['#220901', '#621708', '#941B0C', '#BC3908', '#F6AA1C'];
    // this.colors = ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#656D77'];

    this.initCharts();
  }

  initCharts() {
    this.barChart = new BarChart({
      city: 'edinburgh',
      container: this.container,
      colors: this.colors,
      width: this.width / 2,
      height: this.height / 2,
    });
  }
}

window.Application = new Application();
