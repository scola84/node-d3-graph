import after from 'lodash-es/after';
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

    const grouped = keys !== null;
    const groups = grouped === true ?
      this._grouped(data, keys) :
      this._ungrouped(data);

    const bar = groups
      .selectAll('rect')
      .data((datum) => {
        return datum;
      });

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
      .attr('x', (datum, index) => {
        return this._attrX(datum, index, grouped);
      })
      .attr('y', (datum) => {
        return this._attrY(datum);
      })
      .attr('width', () => {
        return this._attrWidth(grouped);
      })
      .attr('height', (datum) => {
        return this._attrHeight(datum);
      })
      .style('fill', '#007AFF');

    this._enter(move.transition(), this);
  }

  _grouped(data, keys) {
    const all = [];

    data.forEach((datum, datumIndex) => {
      keys.forEach((key, keyIndex) => {
        all[keyIndex] = all[keyIndex] || [];
        all[keyIndex][datumIndex] = datum[keyIndex];
      });
    });

    this._group
      .domain(data.map((datum, index) => {
        return index;
      }))
      .range([0, this._attrWidth()]);

    let groups = this._root
      .selectAll('g')
      .data(all);

    groups = groups
      .enter()
      .append('g')
      .merge(groups)
      .attr('transform', (datum) => {
        return 'translate(' + this._attrX(datum[0]) + ',0)';
      });

    return groups;
  }

  _ungrouped(data) {
    let groups = this._root
      .selectAll('g')
      .data([data]);

    groups = groups
      .enter()
      .append('g')
      .merge(groups);

    return groups;
  }

  _attrX(datum, index, grouped = false) {
    if (grouped === false) {
      return this._x.get(datum);
    }

    return this._group(index);
  }

  _attrY(datum) {
    const barY = this._y.get(datum);
    return barY === this._height ? barY - 3 : barY;
  }

  _attrWidth(grouped = false) {
    if (grouped === false) {
      return this._x.scale().bandwidth();
    }

    return this._group.bandwidth();
  }

  _attrHeight(datum) {
    const barHeight = this._height - this._y.get(datum);
    return barHeight === 0 ? 3 : barHeight;
  }
}
