export default class Navigation {
  constructor() {
    this.links = [...document.querySelectorAll('nav a')];
    this.listen();
  }

  listen() {
    this.links.map(el => el.addEventListener('click', this.linkClick.bind(this)));
  }

  linkClick(e) {
    e.preventDefault();
    this.links.map(el => el.classList.remove('active'));
    const target = e.currentTarget;
    target.classList.add('active');
    window.emitter.emit('updateCharts', target.getAttribute('href'));
  }
}
