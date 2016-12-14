export default class Axis {
  constructor() {
    this._root = null;
    this._graph = null;
    this._axis = null;
    this._scale = null;
    this._domain = null;
    this._value = null;
    this._grid = false;
    this._data = [];

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s;
  }

  destroy() {
    if (!this._root) {
      return;
    }

    const exit = this._exit(this._root.transition());
    this._root = null;
    exit.remove();
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

  data(value) {
    this._data = value;
    this._scale.domain(this._domain(value));

    return this;
  }

  get(datum) {
    return this._value(datum, this._scale);
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

    if (this._data.length > 0) {
      this._root.attr('transform',
        `translate(0,${this._graph.innerHeight()})`);
    }

    return this;
  }

  left() {
    this._render(-this._graph.innerWidth());
    return this;
  }

  right() {
    this._render(-this._graph.innerWidth());

    if (this._data.length > 0) {
      this._root.attr('transform',
        `translate(${this._graph.innerWidth()},0)`);
    }

    return this;
  }

  top() {
    this._render(-this._graph.innerHeight());
    return this;
  }

  _render(gridSize) {
    if (this._grid === true) {
      this._axis.tickSizeInner(gridSize);
    }

    if (!this._root) {
      this._root = this._graph
        .group()
        .append('g')
        .style('opacity', 0);
    }

    if (this._data.length === 0) {
      this._exit(this._root.transition());
      return;
    }

    this
      ._enter(this._root.transition(), this._data)
      .call(this._axis);
  }

  _size(attr) {
    const format = this._axis.tickFormat() ||
      this._scale.tickFormat && this._scale.tickFormat();

    const longest = !this._scale.ticks ? '0' : this._scale
      .ticks(...this._axis.tickArguments())
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
