export default class Navigation {
  constructor() {
    this.links = [...document.querySelectorAll('nav a')];
    this.heading = document.querySelector('.sidebar__heading');
    this.yelp = document.querySelector('.sidebar__yelp');

    TweenMax.set([this.links, this.heading, this.yelp], { autoAlpha: 0 });

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
