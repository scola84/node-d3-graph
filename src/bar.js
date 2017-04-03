import after from 'lodash/after';
import Plot from './plot';

export default class BarPlot extends Plot {
  constructor() {
    super();

    this._root = null;
    this._group = null;
    this._height = 0;

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s.style('opacity', 0);
  }

  destroy() {
    if (this._root === null) {
      return;
    }

    const rect = this._root
      .selectAll('rect');

    this._unbindTip(rect);

    const exit = this
      ._exit(rect.transition(), this);

    const end = after(rect.size(), () => {
      this._root.remove();
      this._root = null;
    });

    exit
      .remove()
      .on('end', end);
  }

  group(value = null) {
    if (value === null) {
      return this._group;
    }

    this._group = value;
    return this;
  }

  render(data, keys = null) {
    if (this._root === null) {
      this._root = this._graph
        .group()
        .append('g')
        .classed('scola bar', true);
    }

    this._height = this._graph
      .innerHeight();

    let groups = this._root;

    if (keys !== null) {
      this._group
        .domain(keys)
        .range([0, this._attrWidth()]);

      groups = groups
        .selectAll('g')
        .data(data);

      groups = groups
        .enter()
        .append('g')
        .attr('transform', (d) => this._attrTransform(d))
        .merge(groups);

      data = (d) => this._data(d, keys);
    }

    const bar = groups
      .selectAll('rect')
      .data(data);

    const exit = this._exit(bar
      .exit()
      .transition(), this);

    exit.remove();

    const enter = bar
      .enter()
      .append('rect')
      .merge(bar);

    this._bindTip(enter);

    const minimize = this
      ._exit(enter.transition(), this);

    const move = minimize
      .transition()
      .duration(0)
      .attr('x', (d) => this._attrX(d, keys))
      .attr('y', (d) => this._attrY(d))
      .attr('width', () => this._attrWidth(keys))
      .attr('height', (d) => this._attrHeight(d));

    this._enter(move.transition(), this);
  }

  _attrX(datum, keys = null) {
    if (keys === null) {
      return this._x.get(datum);
    }

    return this._group(datum.key);
  }

  _attrY(datum) {
    const barY = this._y.get(datum);
    return barY === this._height ? barY - 3 : barY;
  }

  _attrWidth(keys = null) {
    if (keys === null) {
      return this._x.scale().bandwidth();
    }

    return this._group.bandwidth();
  }

  _attrHeight(datum) {
    const barHeight = this._height - this._y.get(datum);
    return barHeight === 0 ? 3 : barHeight;
  }

  _attrTransform(datum) {
    return 'translate(' + this._attrX(datum) + ',0)';
  }

  _data(datum, keys = null) {
    return keys === null ? datum : keys.map((key) => {
      return Object.assign({}, datum, {
        key
      });
    });
  }
}
