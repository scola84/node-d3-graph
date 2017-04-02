/* eslint prefer-reflect: "off" */

export default class Axis {
  constructor() {
    this._root = null;
    this._name = null;

    this._graph = null;
    this._axis = null;

    this._domain = null;
    this._scale = null;
    this._value = null;

    this._grid = false;

    this._data = [];
    this._keys = null;

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s;
  }

  destroy() {
    if (this._root === null) {
      return;
    }

    const exit = this
      ._exit(this._root.transition(), this);

    exit.remove();
    this._root = null;
  }

  root() {
    return this._root;
  }

  name(value = null) {
    if (value === null) {
      return this._name;
    }

    this._name = value;
    return this;
  }

  graph(value = null) {
    if (value === null) {
      return this._graph;
    }

    this._graph = value;
    return this;
  }

  axis(value = null) {
    if (value === null) {
      return this._axis;
    }

    this._axis = value
      .tickPadding(10)
      .tickSize(0);

    return this;
  }

  domain(value = null) {
    if (value === null) {
      return this._domain;
    }

    this._domain = value;
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

  value(axisValue = null) {
    if (axisValue === null) {
      return this._value;
    }

    this._value = axisValue;
    return this;
  }

  data(value = null) {
    if (value === null) {
      return this._data;
    }

    this._data = value;

    const domain = this._domain(this._data,
      this._keys, this);
    this._scale.domain(domain);

    return this;
  }

  keys(value = null) {
    if (value === null) {
      return this._keys;
    }

    this._keys = value;
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
    this._root.classed('bottom', true);

    if (this._data.length > 0) {
      this._all();
      this._horizontal();
      this._bottom();
    }

    return this;
  }

  left() {
    this._render(-this._graph.innerWidth());
    this._root.classed('left', true);

    this._all();
    this._vertical();
    this._left();

    return this;
  }

  right() {
    this._render(-this._graph.innerWidth());
    this._root.classed('right', true);

    if (this._data.length > 0) {
      this._all();
      this._vertical();
      this._right();
    }

    return this;
  }

  top() {
    this._render(-this._graph.innerHeight());
    this._root.classed('top', true);

    this._all();
    this._horizontal();

    return this;
  }

  _render(gridSize) {
    if (this._grid === true) {
      this._axis.tickSizeInner(gridSize);
    }

    if (this._root === null) {
      this._root = this._graph
        .group()
        .append('g')
        .classed('scola axis', true)
        .style('opacity', 0);
    }

    if (this._data.length === 0) {
      this._exit(this._root.transition(), this);
      return;
    }

    this
      ._enter(this._root.transition(), this)
      .call(this._axis);
  }

  _size(attr) {
    const format =
      this._axis.tickFormat() ||
      this._scale.tickFormat &&
      this._scale.tickFormat();

    let longest = '0';

    if (typeof this._scale.ticks === 'function') {
      longest = this._scale
        .ticks(...this._axis.tickArguments())
        .map(format)
        .reduce((max, tick) => {
          return String(tick).length > max.length ?
            String(tick) :
            max;
        }, '');
    }

    const node = this._graph
      .svg()
      .append('text')
      .style('font-size', '0.9em')
      .text(longest);

    const size = node.node().getBBox()[attr];
    node.remove();

    return size;
  }

  _all() {
    this._root
      .select('path')
      .style('display', 'none');

    this._root
      .selectAll('line')
      .style('opacity', 0.2);
  }

  _horizontal() {
    const ticks = this._root
      .selectAll('.tick');

    ticks
      .filter((datum, index) => {
        return index % Math.ceil(ticks.size() /
          (this._graph.innerWidth() / 100)) !== 0;
      })
      .remove();
  }

  _vertical() {
    this._root
      .selectAll('text')
      .attr('dy', '-0.35em');
  }

  _bottom() {
    this._root.attr('transform',
      `translate(0,${this._graph.innerHeight()})`);
  }

  _left() {
    this._root
      .selectAll('line')
      .attr('x1', -this.width());

    this._root
      .selectAll('text')
      .attr('text-anchor', 'start')
      .attr('dx', -this.width() + 16);
  }

  _right() {
    this._root.attr('transform',
      `translate(${this._graph.innerWidth()},0)`);

    this._root
      .selectAll('line')
      .attr('x1', this.width());

    this._root
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('dx', this.width() - 16);
  }
}
