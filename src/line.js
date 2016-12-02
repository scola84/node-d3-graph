import { line } from 'd3-shape';

export default class Line {
  constructor() {
    this._root = null;
    this._graph = null;
    this._x = null;
    this._y = null;

    this._factory = line()
      .x((datum) => this._x.get(datum))
      .y((datum) => this._y.get(datum));

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s.style('opacity', 0);
    this._duration = 250;
  }

  destroy() {
    const exit = this._root
      .transition()
      .duration(this._duration);

    this._exit(exit);
    exit.remove();
    
    this._root = null;
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

  duration(value = null) {
    if (value === null) {
      return this._duration;
    }

    this._duration = value;
    return this;
  }

  render(data) {
    if (!this._root) {
      this._root = this._graph
        .group()
        .append('path')
        .classed('scola-line', true);
    }

    const exit = this._root
      .styles({
        'fill': 'none'
      })
      .transition()
      .duration(this._duration);

    const enter = exit
      .transition()
      .duration(0)
      .attr('d', this._factory(data))
      .transition()
      .duration(this._duration);

    this._exit(exit);
    this._enter(enter);
  }
}
