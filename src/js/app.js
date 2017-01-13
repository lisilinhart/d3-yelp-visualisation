import * as d3 from 'd3';

import Navigation from './components/navigation';

import BarChart from './components/bar-chart';
import WordCloud from './components/word-cloud';

class Application {
  constructor(options) {
    console.log('--------- App Init ---------');
    this.navigation = new Navigation();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container = document.querySelector('#app');
    this.initCharts();
  }

  initCharts() {
    // this.barChart = new BarChart({
    //   file: 'edinburgh_review',
    //   container: this.container,
    //   width: parseInt(this.width / 2),
    //   height: parseInt(this.height / 2),
    //   data: {
    //     0: { count: 5 },
    //     1: { count: 7 },
    //     2: { count: 3 },
    //     3: { count: 10 }
    //   }
    // });

    this.wordCloud = new WordCloud({
      file: 'edinburgh_review',
      container: this.container,
      width: parseInt(this.width / 2),
      height: parseInt(this.height / 2),
      data: {
        0: { count: 5 },
        1: { count: 7 },
        2: { count: 3 },
        3: { count: 10 }
      }
    });
  }
}

window.Application = new Application();
