import { select } from 'd3-selection';
import tip from 'd3-tip';
import Axis from './axis';
import Line from './line';
import Scatter from './scatter';
import 'd3-selection-multi';

export default class Graph {
  constructor() {
    this._innerHeight = 0;
    this._innerWidth = 0;

    this._margin = {
      bottom: 16,
      left: 16,
      right: 16,
      top: 16
    };

    this._offset = -1;
    this._ratio = 1;

    this._bottom = null;
    this._left = null;
    this._right = null;
    this._top = null;

    this._collection = [];

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola graph', true);

    this._svg = this._root
      .append('svg')
      .styles({
        'background': '#FFF',
        'border-bottom': '1px solid #CCC',
        'border-top': '1px solid #CCC',
        'height': '100%',
        'width': '100%'
      });

    this._group = this._svg
      .append('g');
  }

  root() {
    return this._root;
  }

  svg() {
    return this._svg;
  }

  group() {
    return this._group;
  }

  innerHeight() {
    return this._innerHeight;
  }

  innerWidth() {
    return this._innerWidth;
  }

  width(value = null) {
    if (value === null) {
      return parseInt(this._root.style('width'), 10) -
        parseInt(this._root.style('padding-left'), 10) -
        parseInt(this._root.style('padding-right'), 10);
    }

    this._root.style('width', value + 'px');
    return this;
  }

  height(value = null) {
    if (value === null) {
      return parseInt(this._root.style('height'), 10) -
        parseInt(this._root.style('padding-top'), 10) -
        parseInt(this._root.style('padding-bottom'), 10);
    }

    this._root.style('height', value + 'px');
    return this;
  }

  margin(value = null) {
    if (value === null) {
      return this._margin;
    }

    if (typeof value === 'number') {
      return this.margin({
        bottom: value,
        left: value,
        right: value,
        top: value
      });
    }

    Object.assign(this._margin, value);
    return this;
  }

  ratio(value = null) {
    if (value === null) {
      return this._ratio;
    }

    this._ratio = value;
    return this;
  }

  inset() {
    this._root.styles({
      'padding-left': '1em',
      'padding-right': '1em'
    });

    this._svg.styles({
      'border-style': 'none',
      'border-radius': '0.5em'
    });

    return this;
  }

  tip(value) {
    const instance = tip()
      .attr('class', 'scola tip')
      .style('background', '#000')
      .style('color', '#FFF')
      .style('line-height', '1.65em')
      .style('padding', '0.25em 0.5em')
      .style('font-size', '0.9em')
      .style('border-radius', '0.3em')
      .offset([-10, 0])
      .html(value);

    this._group.call(instance);

    return instance;
  }

  bottom() {
    if (!this._bottom) {
      this._bottom = new Axis()
        .graph(this);
    }

    return this._bottom;
  }

  left() {
    if (!this._left) {
      this._left = new Axis()
        .graph(this);
    }

    return this._left;
  }

  right() {
    if (!this._right) {
      this._right = new Axis()
        .graph(this);
    }

    return this._right;
  }

  top() {
    if (!this._top) {
      this._top = new Axis()
        .graph(this);
    }

    return this._top;
  }

  line() {
    const l = new Line()
      .graph(this);

    this._collection.push(l);

    return l;
  }

  scatter() {
    const s = new Scatter()
      .graph(this);

    this._collection.push(s);

    return s;
  }

  render(data) {
    const width = this.width();
    const height = width * this._ratio;

    this.height(height);

    const marginBottom =
      this._margin.bottom +
      this._bottom.data(data).height();

    const marginLeft =
      this._margin.left +
      this._left.data(data).width();

    const marginRight =
      this._margin.right +
      this._right.data(data).width();

    const marginTop =
      this._margin.top +
      this._top.data(data).height();

    this._innerHeight = height -
      marginTop -
      marginBottom;

    this._innerWidth = width -
      marginLeft -
      marginRight;

    this._bottom
      .scale()
      .range([0, this._innerWidth]);

    this._left
      .scale()
      .range([this._innerHeight, 0]);

    this._right
      .scale()
      .range([this._innerHeight, 0]);

    this._top
      .scale()
      .range([0, this._innerWidth]);

    this._bottom.bottom();
    this._left.left();
    this._right.right();
    this._top.top();

    this._group
      .attr('transform', `translate(${marginLeft},${marginTop})`)
      .selectAll('text')
      .style('font-size', '0.9em');

    this._collection.forEach((item) => {
      item.render(data);
    });
  }
}
