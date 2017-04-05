import after from 'lodash/after';
import Plot from './plot';

export default class ScatterPlot extends Plot {
  constructor() {
    super();

    this._root = null;

    this._enter = (s) => s.attr('r', 3);
    this._exit = (s) => s.attr('r', 0);
  }

  destroy() {
    if (this._root === null) {
      return;
    }

    const circle = this._root
      .selectAll('circle');

    this._unbindTip(circle);

    const exit = this
      ._exit(circle.transition(), this);

    const end = after(circle.size(), () => {
      this._root.remove();
      this._root = null;
    });

    exit
      .remove()
      .on('end', end);
  }

  render(data, keys = null) {
    data = keys === null ? [data] : data;

    if (this._root === null) {
      this._root = this._graph
        .group()
        .append('g')
        .classed('scola scatter', true);
    }

    let groups = this._root
      .selectAll('g')
      .data(data);

    groups = groups
      .enter()
      .append('g')
      .merge(groups);

    const circle = groups
      .selectAll('circle')
      .data((datum) => {
        return Object.values(datum);
      });

    const exit = this._exit(circle
      .exit()
      .transition(), this);

    exit.remove();

    const enter = circle
      .enter()
      .append('circle')
      .merge(circle);

    this._bindTip(enter);

    const minimize = this
      ._exit(enter.transition(), this);

    const move = minimize
      .transition()
      .duration(0)
      .attr('cx', (datum) => this._x.get(datum))
      .attr('cy', (datum) => this._y.get(datum))
      .styles({
        'fill': 'rgba(0, 0, 0, 0)',
        'stroke': '#007AFF'
      });

    this._enter(move.transition(), this);
  }
}
