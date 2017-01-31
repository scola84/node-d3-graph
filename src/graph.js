import { event, select } from 'd3-selection';
import isEqual from 'lodash-es/isEqual';
import { mainBar } from '@scola/d3-control';
import 'd3-selection-multi';
import 'd3-transition';
import '@scola/d3-media';

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

    this._rootMedia = null;
    this._bodyMedia = null;

    this._header = null;
    this._footer = null;
    this._tip = null;

    this._message = null;
    this._timeout = null;

    this._bottom = null;
    this._left = null;
    this._right = null;
    this._top = null;

    this._collection = new Set();
    this._data = null;
    this._key = null;

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
        'border-color': '#CCC',
        'border-style': 'solid',
        'border-width': '1px 0',
        'display': 'flex',
        'flex-direction': 'column',
        'overflow': 'hidden'
      });

    this._outer = this._body
      .append('div')
      .classed('scola svg', true)
      .styles({
        'order': 2,
        'position': 'relative'
      });

    this._svg = this._outer
      .append('svg')
      .attrs({
        'width': '100%',
        'height': '100%'
      });

    this._group = this._svg
      .append('g');
  }

  destroy() {
    this._deleteInset();
    this._deleteHeader();
    this._deleteFooter();
    this._deleteTip();
    this._deleteMessage();

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

  innerHeight() {
    return this._innerHeight;
  }

  innerWidth() {
    return this._innerWidth;
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

  height(value = null) {
    if (value === null) {
      return parseFloat(this._svg.style('height'));
    }

    this._svg.style('height', value + 'px');
    return this;
  }

  width(value = null) {
    if (value === null) {
      return parseFloat(this._svg.style('width'));
    }

    this._svg.style('width', value + 'px');
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

  inset(width = '48em') {
    if (width === false) {
      return this._deleteInset();
    }

    if (!this._rootMedia) {
      this._insertInset(width);
    }

    return this;
  }

  header(action = true) {
    if (action === false) {
      return this._deleteHeader();
    }

    if (!this._header) {
      this._insertHeader();
    }

    return this._header;
  }

  footer(action = true) {
    if (action === false) {
      return this._deleteFooter();
    }

    if (!this._footer) {
      this._insertFooter();
    }

    return this._footer;
  }

  tip(datum = null, format = null) {
    if (datum === null) {
      return this._tip;
    }

    if (datum === false) {
      return this._deleteTip();
    }

    return this._insertTip(datum, format);
  }

  message(value = null) {
    if (value === null) {
      return this._message;
    }

    clearTimeout(this._timeout);

    if (value === false) {
      return this._deleteMessage();
    }

    this._data = null;

    if (this._message) {
      return this._updateMessage(value);
    }

    return this._insertMessage(value);
  }

  loading(value = null, delay = 250) {
    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      this.message(value);
    }, delay);
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

  append(item, action = true) {
    if (action === true) {
      this._collection.add(item.graph(this));
    } else if (action === false) {
      this._collection.delete(item);
    }

    return this;
  }

  render(data = null, key = null) {
    if (data === null) {
      data = this._data;
      key = this._key;

      this._data = null;
      this._key = null;
    }

    if (isEqual(data, this._data)) {
      return this;
    }

    this.message(false);


    this._data = data;
    this._key = key;

    const width = this.width();
    const height = this.height();

    let marginBottom = this._margin.bottom;
    let marginLeft = this._margin.left;
    let marginRight = this._margin.right;
    let marginTop = this._margin.top;

    if (this._bottom) {
      marginBottom += this._bottom
        .data(this._data)
        .height();
    }

    if (this._left) {
      marginLeft += this._left
        .data(this._data)
        .width();
    }

    if (this._right) {
      marginRight += this._right
        .data(this._data)
        .width();
    }

    if (this._top) {
      marginTop += this._top
        .data(this._data)
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

    if (this._data.length > 0) {
      this._setPosition(marginLeft, marginTop);
    }

    this._collection.forEach((item) => {
      item.render(this._data, this._key);
    });

    return this;
  }

  resize() {
    const width = this.width();

    if (Number.isNaN(width)) {
      return this;
    }

    const oldHeight = this.height();
    const newHeight = width * this._ratio;

    if (oldHeight === newHeight) {
      return this;
    }

    this.height(newHeight);
    this.render();

    return this;
  }

  _insertInset(width) {
    this._rootMedia = this._root
      .media(`(min-width: ${width})`)
      .styles({
        'padding-left': '1em',
        'padding-right': '1em'
      })
      .start();

    this._bodyMedia = this._body
      .media(`(min-width: ${width})`)
      .styles({
        'border-radius': '0.5em',
        'border-style': 'none',
        'overflow': 'hidden'
      })
      .start();

    return this;
  }

  _deleteInset() {
    if (this._rootMedia) {
      this._rootMedia.destroy();
      this._rootMedia = null;
    }

    if (this._bodyMedia) {
      this._bodyMedia.destroy();
      this._bodyMedia = null;
    }

    return this;
  }

  _insertHeader() {
    this._header = mainBar();

    this._header.root()
      .classed('scola header', true)
      .styles({
        'border-bottom': '1px solid #CCC',
        'order': 1
      });

    this._body.node()
      .insertBefore(this._header.root().node(), this._outer.node());

    return this;
  }

  _deleteHeader() {
    if (this._header) {
      this._header.destroy();
      this._header = null;
    }

    return this;
  }

  _insertFooter() {
    this._footer = mainBar();

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

  _deleteFooter() {
    if (this._footer) {
      this._footer.destroy();
      this._footer = null;
    }

    return this;
  }

  _insertTip(datum, format) {
    this._tip = select('body')
      .append('div')
      .attr('class', 'scola tip')
      .styles({
        'background': '#000',
        'color': '#FFF',
        'line-height': '1.65em',
        'padding': '0.25em 0.5em',
        'position': 'absolute',
        'white-space': 'nowrap',
        'border-radius': '0.3em'
      });

    this._tip = format(this._tip, datum);

    const targetRect = event.target.getBoundingClientRect();
    const tipRect = this._tip.node().getBoundingClientRect();

    const left = targetRect.left +
      (targetRect.width / 2) -
      (tipRect.width / 2);
    const top = targetRect.top -
      tipRect.height;

    this._tip.styles({
      top: top + 'px',
      left: left + 'px',
      width: tipRect.width + 'px',
      height: tipRect.height + 'px'
    });

    return this;
  }

  _deleteTip() {
    if (this._tip) {
      this._tip.remove();
      this._tip = null;
    }

    return this;
  }

  _insertMessage(text) {
    this._message = this._outer
      .append('div')
      .classed('scola message', true)
      .styles({
        'align-items': 'center',
        'background': '#FFF',
        'display': 'flex',
        'height': '100%',
        'justify-content': 'center',
        'left': 0,
        'position': 'absolute',
        'top': 0,
        'width': '100%',
        'z-index': 1
      })
      .text(text);

    return this;
  }

  _updateMessage(text) {
    this._message.text(text);
    return this;
  }

  _deleteMessage() {
    if (this._message) {
      this._message.remove();
      this._message = null;
    }

    return this;
  }

  _setPosition(left, top) {
    this._group
      .attr('transform', `translate(${left},${top})`)
      .selectAll('text')
      .style('font-size', '0.9em');
  }
}
