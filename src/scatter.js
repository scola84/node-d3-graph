export default class Scatter {
  constructor() {
    this._graph = null;
    this._x = null;
    this._y = null;
    this._tip = null;

    this._enter = (s) => s.attr('r', 3);
    this._exit = (s) => s.attr('r', 0);
    this._duration = 250;
  }

  destroy() {
    const exit = this._graph
      .group()
      .selectAll('.scola-scatter')
      .transition()
      .duration(this._duration);

    this._exit(exit);
    exit.remove();
  }

  graph(value) {
    if (value === null) {
      return this._graph;
    }

    this._graph = value;
    return this;
  }

  x(value) {
    if (value === null) {
      return this._x;
    }

    this._x = value;
    return this;
  }

  y(value) {
    if (value === null) {
      return this._y;
    }

    this._y = value;
    return this;
  }

  tip(value) {
    if (value === null) {
      return this._tip;
    }

    this._tip = this._graph.tip(value);
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

  render(data, key) {
    const scatter = this._graph
      .group()
      .selectAll('.scola-scatter')
      .data(data, key);

    const exit = scatter
      .exit()
      .transition()
      .duration(this._duration);

    const enter = scatter
      .enter()
      .append('circle')
      .merge(scatter)
      .classed('scola-scatter', true)
      .styles({
        'fill': 'rgba(0, 0, 0, 0)'
      })
      .on('mouseover', (...args) => {
        this._tip.show(...args, event.target);
      })
      .on('mouseout', (...args) => {
        this._tip.hide(...args, event.target);
      })
      .transition()
      .duration(this._duration)
      .attr('r', 0)
      .transition()
      .duration(0)
      .attr('cx', (datum) => this._x.get(datum))
      .attr('cy', (datum) => this._y.get(datum))
      .transition()
      .duration(this._duration);

    this._exit(exit);
    this._enter(enter);

    exit.remove();
  }
}
