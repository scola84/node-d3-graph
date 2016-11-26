import { line } from 'd3-shape';

export default class Line {
  constructor() {
    this._graph = null;
    this._factory = line()
      .x((datum) => this._x.get(datum))
      .y((datum) => this._y.get(datum));
  }

  factory() {
    return this._factory;
  }

  graph(value) {
    this._graph = value;
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
      .selectAll('.scola-line')
      .remove();

    this._graph
      .group()
      .append('path')
      .classed('scola-line', true)
      .datum(data)
      .attr('d', this._factory)
      .styles({
        'fill': 'none',
        'stroke': '#FECE50',
        'stroke-width': '1.5px'
      });
  }
}
