import * as d3 from 'd3';

class Application {
  constructor(options) {
    console.log('App Init');
  }

  init (options) {
    const margin = {top: 40, bottom: 10, left: 120, right: 20};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
      // Creates sources <svg> element
      const svg = d3.select('#app').append('svg')
      .attr('width', width+margin.left+margin.right)
      .attr('height', height+margin.top+margin.bottom);
    }
}

window.Application = new Application();
