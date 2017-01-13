export default class Navigation {
  constructor() {
    this.links = [...document.querySelectorAll('nav a')];
    this.listen();
  }

  listen() {
    this.links.map(el => el.addEventListener('click', this.linkClick));
  }

  linkClick(e) {
    e.preventDefault();
    const target = e.currentTarget;
    window.emitter.emit('updateCharts', target.getAttribute('href'));
  }
}
