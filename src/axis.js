export default class Axis {
  constructor() {
    this._root = null;
    this._graph = null;
    this._axis = null;
    this._scale = null;
    this._domain = null;
    this._value = null;
    this._grid = false;

    this._enter = () => {};
    this._exit = () => {};
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

  root() {
    return this._root;
  }

  axis(value = null) {
    if (value === null) {
      return this._axis;
    }

    this._axis = value;
    return this;
  }

  domain(value = null) {
    if (value === null) {
      return this._domain;
    }

    this._domain = value;
    return this;
  }

  graph(value = null) {
    if (value === null) {
      return this._graph;
    }

    this._graph = value;
    return this;
  }

  scale(value = null) {
    if (value === null) {
      return this._scale;
    }

    this._scale = value;
    this._axis.scale(value);

    return this;
  }

  value(v = null) {
    if (v === null) {
      return this._value;
    }

    this._value = v;
    return this;
  }

  grid(value = null) {
    if (value === null) {
      return this._grid;
    }

    this._grid = value;
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

  get(datum) {
    return this._value(datum, this._scale);
  }

  data(value) {
    this._scale.domain(this._domain(value));
    return this;
  }

  height() {
    return this._axis.tickPadding() +
      this._size('height');
  }

  width() {
    return this._axis.tickPadding() +
      this._size('width');
  }

  bottom() {
    this._render(-this._graph.innerHeight());

    this._root
      .attr('transform', `translate(0,${this._graph.innerHeight()})`);

    return this;
  }

  left() {
    return this._render(-this._graph.innerWidth());
  }

  right() {
    this._render(-this._graph.innerWidth());

    this._root
      .attr('transform', `translate(${this._graph.innerWidth()},0)`);

    return this;
  }

  top() {
    return this._render(-this._graph.innerHeight());
  }

  _render(gridSize) {
    if (this._grid === true) {
      this._axis.tickSizeInner(gridSize);
    }

    if (!this._root) {
      this._root = this._graph
        .group()
        .append('g');
    }

    this._root
      .transition()
      .duration(this._duration)
      .call(this._axis);

    this._enter(this._root);
    return this;
  }

  _size(attr) {
    const format = this._axis.tickFormat() ||
      this._scale.tickFormat();

    const longest = this._scale
      .ticks(5)
      .map(format)
      .reduce((max, tick) => {
        return String(tick).length > max.length ?
          String(tick) :
          max;
      }, '');

    const node = this._graph
      .svg()
      .append('text')
      .style('font-size', '0.9em')
      .text(longest);

    const size = node.node().getBBox()[attr];
    node.remove();

    return size;
  }
}
