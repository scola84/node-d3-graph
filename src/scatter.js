export default class Scatter {
  constructor() {
    this._graph = null;
    this._tip = null;
  }

  graph(value) {
    this._graph = value;
    return this;
  }

  tip(value) {
    this._tip = this._graph.tip(value);
    return this;
  }

  x(value) {
    this._x = value;
    return this;
  }

  y(value) {
    this._y = value;
    return this;
  }

  render(data) {
    this._graph
      .group()
      .selectAll('.scola-mark')
      .remove();

    this._graph
      .group()
      .selectAll('.scola-mark')
      .data(data)
      .enter()
      .append('circle')
      .classed('scola-mark', true)
      .styles({
        'fill': 'rgba(0, 0, 0, 0)',
        'stroke': '#FECE50',
        'stroke-width': '1.5px'
      })
      .attr('r', 3.5)
      .attr('cx', (datum) => this._x.get(datum))
      .attr('cy', (datum) => this._y.get(datum))
      .on('mouseover', (...args) => {
        this._tip.show(...args, event.target);
      })
      .on('mouseout', (...args) => {
        this._tip.hide(...args, event.target);
      });
  }
}
