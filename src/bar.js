import { event } from 'd3-selection';

export default class Bar {
  constructor() {
    this._graph = null;
    this._x = null;
    this._y = null;

    this._formatTip = null;
    this._tip = null;

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s.style('opacity', 0);
  }

  destroy() {
    if (!this._graph) {
      return this;
    }

    if (this._tip) {
      this._tip.hide();
    }

    const bar = this._graph
      .group()
      .selectAll('.scola-bar');

    const exit = this._exit(bar
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
    const height = this._graph.innerHeight();
    const bar = this._graph
      .group()
      .selectAll('.scola-bar')
      .data(data, key);

    const exit = this._exit(bar
      .exit()
      .transition());

    exit.remove();

    const enter = bar
      .enter()
      .append('rect')
      .merge(bar)
      .classed('scola-bar', true);

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
      .attr('x', (datum) => this._x.get(datum))
      .attr('y', (datum) => this._y.get(datum))
      .attr('width', this._x.scale().bandwidth())
      .attr('height', (datum) => {
        return height - this._y.get(datum);
      });

    this._enter(position.transition());
  }
}
