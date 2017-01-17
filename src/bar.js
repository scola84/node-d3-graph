import 'd3-transition';

export default class Bar {
  constructor() {
    this._graph = null;
    this._x = null;
    this._y = null;

    this._tip = null;

    this._enter = (s) => s.style('opacity', 1);
    this._exit = (s) => s.style('opacity', 0);
  }

  destroy() {
    if (!this._graph) {
      return this;
    }

    if (this._tip) {
      this._graph.tip(false);
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

    if (this._tip) {
      enter.on('mouseover', (datum) => {
        this._graph.tip(datum, this._tip);
      });

      enter.on('mouseout', () => {
        this._graph.tip(false);
      });
    }

    const minimize = this._exit(enter.transition());

    const position = minimize
      .transition()
      .duration(0)
      .attr('x', (datum) => this._x.get(datum))
      .attr('width', this._x.scale().bandwidth())
      .attr('y', (datum) => {
        const barY = this._y.get(datum);
        return barY === height ? barY - 3 : barY;
      })
      .attr('height', (datum) => {
        const barHeight = height - this._y.get(datum);
        return barHeight === 0 ? 3 : barHeight;
      });

    this._enter(position.transition());
  }
}
