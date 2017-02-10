export default class ScatterPlot {
  constructor() {
    this._graph = null;
    this._x = null;
    this._y = null;

    this._tip = null;

    this._enter = (s) => s.attr('r', 3);
    this._exit = (s) => s.attr('r', 0);
  }

  destroy() {
    if (!this._graph) {
      return;
    }

    if (this._tip) {
      this._graph.tip(false);
    }

    const scatter = this._graph
      .group()
      .selectAll('.scola-scatter');

    const exit = this
      ._exit(scatter.transition(), this);

    exit.remove();
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

    this._tip = value;
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
      .transition(), this);

    exit.remove();

    const enter = scatter
      .enter()
      .append('circle')
      .merge(scatter)
      .classed('scola-scatter', true)
      .style('fill', 'rgba(0, 0, 0, 0)');

    if (this._tip) {
      enter.on('mouseover.scola-graph', (datum) => {
        this._graph.tip(datum, this._tip);
      });

      enter.on('mouseout.scola-graph', () => {
        this._graph.tip(false);
      });
    }

    const minimize = this
      ._exit(enter.transition(), this);

    const position = minimize
      .transition()
      .duration(0)
      .attr('cx', (datum) => this._x.get(datum))
      .attr('cy', (datum) => this._y.get(datum));

    this._enter(position.transition(), this);
  }
}
