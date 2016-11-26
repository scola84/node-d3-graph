export default class Axis {
  constructor() {
    this._root = null;
    this._graph = null;
    this._axis = null;
    this._scale = null;
    this._domain = null;
    this._value = null;
  }

  root() {
    if (!this._root) {
      this._root = this._graph
        .group()
        .append('g');
    }

    return this._root;
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

    this._axis = value;
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

  domain(value = null) {
    if (value === null) {
      return this._domain;
    }

    this._domain = value;
    return this;
  }

  value(v = null) {
    if (v === null) {
      return this._value;
    }

    this._value = v;
    return this;
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

  get(datum) {
    return this._value(datum, this._scale);
  }

  _size(attr) {
    const longest = this._scale
      .ticks(5)
      .reduce((m, c) => {
        return String(c).length > m.length ? String(c) : m;
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
