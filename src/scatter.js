import { event } from 'd3-selection';

export default class Scatter {
  constructor() {
    this._graph = null;
    this._x = null;
    this._y = null;

    this._formatTip = null;
    this._tip = null;

    this._enter = (s) => s.attr('r', 3);
    this._exit = (s) => s.attr('r', 0);
  }

  destroy() {
    if (!this._graph) {
      return this;
    }

    if (this._tip) {
      this._tip.hide();
    }

    const scatter = this._graph
      .group()
      .selectAll('.scola-scatter');

    const exit = this._exit(scatter
      .transition());

    exit.remove();
    return this;
  }

  graph(value = null) {
    if (value === null) {
      return this._graph;
    }

    this._graph = value;
    return this;
  }

  x(value = null) {
    if (value === null) {
      return this._x;
    }

    this._x = value;
    return this;
  }

  y(value = null) {
    if (value === null) {
      return this._y;
    }

    this._y = value;
    return this;
  }

  tip(value = null) {
    if (value === null) {
      return this._tip;
    }

    this._formatTip = value;
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

  render(data, key) {
    const scatter = this._graph
      .group()
      .selectAll('.scola-scatter')
      .data(data, key);

    const exit = this._exit(scatter
      .exit()
      .transition());

    exit.remove();

    const enter = scatter
      .enter()
      .append('circle')
      .merge(scatter)
      .classed('scola-scatter', true)
      .styles({
        'fill': 'rgba(0, 0, 0, 0)'
      });

    if (this._formatTip) {
      if (!this._tip) {
        this._tip = this._graph.tip(this._formatTip);
      }

      enter
        .on('mouseover', (...args) => {
          this._tip.show(...args, event.target);
        })
        .on('mouseout', (...args) => {
          this._tip.hide(...args, event.target);
        });
    }

    const minimize = this._exit(enter.transition());

    const position = minimize
      .transition()
      .duration(0)
      .attr('cx', (datum) => this._x.get(datum))
      .attr('cy', (datum) => this._y.get(datum));

    this._enter(position.transition());
  }
}
