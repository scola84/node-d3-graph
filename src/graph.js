import { select } from 'd3-selection';
import tip from 'd3-tip';
import { controlBar } from '@scola/d3-generic';
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
    this._duration = 250;

    this._message = null;
    this._bottom = null;
    this._left = null;
    this._right = null;
    this._top = null;

    this._collection = new Set();

    this._root = select('body')
      .append('div')
      .remove()
      .classed('scola graph', true)
      .styles({
        'padding-bottom': '3em'
      });

    this._body = this._root
      .append('div')
      .classed('scola body', true)
      .styles({
        'background': '#FFF',
        'border-bottom': '1px solid #CCC',
        'border-top': '1px solid #CCC',
        'display': 'flex',
        'flex-direction': 'column',
        'overflow': 'hidden'
      });

    this._svg = this._body
      .append('svg')
      .styles({
        'height': '100%',
        'order': 2,
        'width': '100%'
      });

    this._group = this._svg
      .append('g');
  }

  destroy() {
    if (this._message) {
      this._deleteMessage();
    }

    if (this._bottom) {
      this._bottom.destroy();
      this._bottom = null;
    }

    if (this._left) {
      this._left.destroy();
      this._left = null;
    }

    if (this._right) {
      this._right.destroy();
      this._right = null;
    }

    if (this._top) {
      this._top.destroy();
      this._top = null;
    }

    this._collection.forEach((item) => {
      item.destroy();
    });

    this._collection.clear();

    this._root.remove();
    this._root = null;
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

  footer(action) {
    if (typeof action === 'undefined') {
      return this._footer;
    }

    if (action === false) {
      this._footer.destroy();
      this._footer = null;

      return this;
    }

    this._footer = controlBar();

    this._footer.root()
      .classed('scola footer', true)
      .styles({
        'border-top': '1px solid #CCC',
        'order': 3
      });

    this._body.node()
      .appendChild(this._footer.root().node());

    return this;
  }

  header(action) {
    if (typeof action === 'undefined') {
      return this._header;
    }

    if (action === false) {
      this._header.destroy();
      this._header = null;

      return this;
    }

    this._header = controlBar();

    this._header.root()
      .classed('scola header', true)
      .styles({
        'border-bottom': '1px solid #CCC',
        'order': 1
      });

    this._body.node()
      .appendChild(this._header.root().node());

    return this;
  }

  innerHeight() {
    return this._innerHeight;
  }

  innerWidth() {
    return this._innerWidth;
  }

  width(value = null) {
    if (value === null) {
      return parseInt(this._svg.style('width'), 10);
    }

    this._svg.style('width', value + 'px');
    return this;
  }

  height(value = null) {
    if (value === null) {
      return parseInt(this._svg.style('height'), 10);
    }

    this._svg.style('height', value + 'px');
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

  duration(value = null) {
    if (value === null) {
      return this._duration;
    }

    this._duration = value;
    return this;
  }

  append(item, action) {
    if (action === true) {
      this._collection.add(item.graph(this));
    } else if (action === false) {
      this._collection.delete(item);
    }

    return this;
  }

  bottom(value = null) {
    if (value === null) {
      return this._bottom;
    }

    this._bottom = value.graph(this);
    return this;
  }

  left(value = null) {
    if (value === null) {
      return this._left;
    }

    this._left = value.graph(this);
    return this;
  }

  right(value = null) {
    if (value === null) {
      return this._right;
    }

    this._right = value.graph(this);
    return this;
  }

  top(value = null) {
    if (value === null) {
      return this._top;
    }

    this._top = value.graph(this);
    return this;
  }

  message(text) {
    if (!this._message) {
      this._insertMessage();
    }

    if (this._message) {
      this._message.text(text);
    }

    return this;
  }

  inset() {
    this._root.styles({
      'padding-left': '1em',
      'padding-right': '1em'
    });

    this._body.styles({
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

  render(data, key) {
    if (this._message) {
      this._deleteMessage();
    }

    const width = this.width();

    if (Number.isNaN(width)) {
      return this;
    }

    const height = width * this._ratio;
    this.height(height);

    let marginBottom = this._margin.bottom;
    let marginLeft = this._margin.left;
    let marginRight = this._margin.right;
    let marginTop = this._margin.top;

    if (this._bottom) {
      marginBottom += this._bottom
        .data(data)
        .height();
    }

    if (this._left) {
      marginLeft += this._left
        .data(data)
        .width();
    }

    if (this._right) {
      marginRight += this._right
        .data(data)
        .width();
    }

    if (this._top) {
      marginTop += this._top
        .data(data)
        .height();
    }

    this._innerHeight = height -
      marginTop -
      marginBottom;

    this._innerWidth = width -
      marginLeft -
      marginRight;

    if (this._bottom) {
      this._bottom
        .scale()
        .range([0, this._innerWidth]);

      this._bottom.bottom();
    }

    if (this._left) {
      this._left
        .scale()
        .range([this._innerHeight, 0]);

      this._left.left();
    }

    if (this._right) {
      this._right
        .scale()
        .range([this._innerHeight, 0]);

      this._right.right();
    }

    if (this._top) {
      this._top
        .scale()
        .range([0, this._innerWidth]);

      this._top.top();
    }

    if (data.length > 0) {
      this._setPosition(marginLeft, marginTop);
    }

    this._collection.forEach((item) => {
      item.render(data, key);
    });

    return this;
  }

  _setPosition(left, top) {
    this._group
      .attr('transform', `translate(${left},${top})`)
      .selectAll('text')
      .style('font-size', '0.9em');
  }

  _insertMessage() {
    const x = this.width() / 2;
    const y = this.height() / 2;

    if (Number.isNaN(x)) {
      return;
    }

    this._message = this._svg
      .append('text')
      .classed('scola message', true)
      .attrs({
        'alignment-baseline': 'central',
        'text-anchor': 'middle',
        'transform': `translate(${x}, ${y})`
      })
      .style('opacity', 0);

    this._message
      .transition()
      .duration(this._duration)
      .style('opacity', 1);
  }

  _deleteMessage() {
    this._message
      .transition()
      .duration(this._duration)
      .style('opacity', 0)
      .remove();

    this._message = null;
  }
}
