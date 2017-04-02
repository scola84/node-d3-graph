export default class Plot {
  constructor() {
    this._name = null;
    this._graph = null;

    this._x = null;
    this._y = null;

    this._tip = null;

    this._enter = null;
    this._exit = null;
  }

  name(value = null) {
    if (value === null) {
      return this._name;
    }

    this._name = value;
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

  _bindTip(selection) {
    if (this._tip) {
      selection.on('mouseover.scola-graph', (datum) => {
        this._graph.tip(datum, this._tip);
      });

      selection.on('mouseout.scola-graph', () => {
        this._graph.tip(false);
      });
    }
  }

  _unbindTip(selection) {
    if (this._tip) {
      selection.on('mouseover.scola-graph', null);
      selection.on('mouseout.scola-graph', null);
      this._graph.tip(false);
    }
  }
}
