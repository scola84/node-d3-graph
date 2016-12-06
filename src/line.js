import { line } from 'd3-shape';

export default class Line {
  constructor() {
    this._graph = null;
    this._x = null;
    this._y = null;
    this._root = null;

    this._factory = line()
      .x((datum) => this._x.get(datum))
      .y((datum) => this._y.get(datum));

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s.style('opacity', 0);
  }

  destroy() {
    if (!this._root) {
      return this;
    }

    const exit = this._exit(this._root.transition());
    this._root = null;
    exit.remove();

    return this;
  }

  root() {
    return this._root;
  }

  factory() {
    return this._factory;
  }

  graph(value) {
    if (value === null) {
      return this._graph;
    }

    this._graph = value;
    return this;
  }

  x(value) {
    if (value === null) {
      return this._x;
    }

    this._x = value;
    return this;
  }

  y(value) {
    if (value === null) {
      return this._y;
    }

    this._y = value;
    return this;
  }

  enter(value = null) {
    if (value === null) {
      return this._enter;
    }

    this._enter = value;
    return this;
  }

  exit(value = null) {
    if (value === null) {
      return this._exit;
    }

    this._exit = value;
    return this;
  }

  render(data) {
    if (!this._root) {
      this._root = this._graph
        .group()
        .append('path')
        .classed('scola-line', true)
        .styles({
          'fill': 'none'
        });
    }

    const exit = this._exit(this._root.transition());

    const enter = exit
      .transition()
      .duration(0)
      .attr('d', this._factory(data))
      .transition();

    this._enter(enter);
  }
}
