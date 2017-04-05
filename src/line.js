import { line } from 'd3';
import after from 'lodash/after';
import Plot from './plot';

export default class LinePlot extends Plot {
  constructor() {
    super();

    this._root = null;

    this._factory = line()
      .x((datum) => this._x.get(datum))
      .y((datum) => this._y.get(datum));

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s.style('opacity', 0);
  }

  destroy() {
    if (this._root === null) {
      return;
    }

    const path = this._root
      .selectAll('path');

    const exit = this
      ._exit(path.transition(), this);

    const end = after(path.size(), () => {
      this._root.remove();
      this._root = null;
    });

    exit
      .remove()
      .on('end', end);
  }

  factory() {
    return this._factory;
  }

  render(data, keys = null) {
    data = keys === null ? [data] : data;

    if (this._root === null) {
      this._root = this._graph
        .group()
        .append('g')
        .classed('scola line', true);
    }

    const path = this._root
      .selectAll('path')
      .data(data);

    const exit = this._exit(path
      .exit()
      .transition(), this);

    exit.remove();

    const enter = path
      .enter()
      .append('path')
      .merge(path);

    const minimize = this
      ._exit(enter.transition(), this);

    const move = minimize
      .transition()
      .duration(0)
      .attr('d', (datum) => {
        return this._factory(Object.values(datum));
      })
      .styles({
        'fill': 'none',
        'stroke': '#007AFF'
      });

    this._enter(move.transition(), this);
  }
}
