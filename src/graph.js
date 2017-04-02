/* eslint prefer-reflect: "off" */

import { event, select } from 'd3';
import isEqual from 'lodash-es/isEqual';
import { controlBar } from '@scola/d3-control';

export default class Graph {
  constructor() {
    this._innerHeight = 0;
    this._innerWidth = 0;

    this._margin = () => 16;

    this._offset = -1;
    this._ratio = 1;

    this._gesture = null;
    this._rootMedia = null;
    this._bodyMedia = null;
    this._inset = false;

    this._header = null;
    this._footer = null;
    this._tip = null;
    this._equalizer = null;

    this._message = null;
    this._timeout = null;

    this._bottom = null;
    this._left = null;
    this._right = null;
    this._top = null;

    this._plots = new Set();
    this._data = null;
    this._keys = null;

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

    this._bindBody();
  }

  destroy() {
    this._unbindBody();
    this._unbindEqualizer();

    this._deleteInset();
    this._deleteHeader();
    this._deleteFooter();
    this._deleteTip();
    this._deleteMessage();

    this.clearAxis();
    this.clearPlots();

    this._root.dispatch('destroy');
    this._root.remove();
    this._root = null;
  }

  clearAxis() {
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
  }

  clearPlots() {
    this._plots.forEach((plot) => {
      plot.destroy();
    });

    this._plots.clear();
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

    this._margin = value;
    return this;
  }

  inset(width = '48em') {
    if (width === null) {
      return this._inset;
    }

    if (width === false) {
      return this._deleteInset();
    }

    if (this._rootMedia === null) {
      this._insertInset(width);
    }

    return this;
  }

  header(action = true) {
    if (action === false) {
      return this._deleteHeader();
    }

    if (this._header === null) {
      this._insertHeader();
    }

    return this._header;
  }

  footer(action = true) {
    if (action === false) {
      return this._deleteFooter();
    }

    if (this._footer === null) {
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

  equalizer(element = null) {
    if (element === null) {
      return this._equalizer;
    }

    this._equalizer = element;
    this._bindEqualizer();

    return this;
  }

  message(value = null, delay = null) {
    if (value === null) {
      return this._message;
    }

    clearTimeout(this._timeout);

    if (value === false) {
      return this._deleteMessage();
    }

    if (delay !== null) {
      return this._delayMessage(value, delay);
    }

    this._data = null;

    if (this._message) {
      return this._updateMessage(value);
    }

    return this._insertMessage(value);
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
    if (action === false) {
      return this._deleteItem(item);
    }

    return this._insertItem(item);
  }

  render(data = null, keys = null) {
    if (data === null) {
      data = this._data;
      keys = this._keys;

      this._data = null;
      this._keys = null;
    }

    if (isEqual(data, this._data) === true) {
      return this;
    }

    this._data = data;
    this._keys = keys;

    const width = this.width();
    const height = this.height();

    let margin = this._margin(this._inset);

    if (typeof margin === 'number') {
      margin = {
        bottom: margin,
        left: margin,
        right: margin,
        top: margin
      };
    }

    margin = Object.assign({}, margin);

    if (this._bottom) {
      this._bottom.keys(this._keys);
      this._bottom.data(this._data);

      margin.bottom += this._bottom
        .height();
    }

    if (this._left) {
      this._left.keys(this._keys);
      this._left.data(this._data);

      margin.left += this._left
        .width();
    }

    if (this._right) {
      this._right.keys(this._keys);
      this._right.data(this._data);

      margin.right += this._right
        .width();
    }

    if (this._top) {
      this._top.keys(this._keys);
      this._top.data(this._data);

      margin.top += this._top
        .height();
    }

    this._innerHeight = height -
      margin.top -
      margin.bottom;

    this._innerWidth = width -
      margin.left -
      margin.right;

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
      this._setPosition(margin.left, margin.top);
      this._setSize();
    }

    this._plots.forEach((item) => {
      item.render(this._data, this._keys);
    });

    return this;
  }

  _bindBody() {
    this._gesture = this._body
      .gesture()
      .on('panstart', (e) => e.stopPropagation())
      .on('panright', (e) => e.stopPropagation())
      .on('panleft', (e) => e.stopPropagation())
      .on('panend', (e) => e.stopPropagation())
      .on('swiperight', (e) => e.stopPropagation())
      .on('swipeleft', (e) => e.stopPropagation())
      .on('tap', (e) => e.stopPropagation());
  }

  _unbindBody() {
    if (this._gesture) {
      this._gesture.destroy();
      this._gesture = null;
    }
  }

  _bindEqualizer() {
    if (this._equalizer) {
      this._equalizer.root().on('resize.scola-graph', () => {
        this._equalize();
      });
    }
  }

  _unbindEqualizer() {
    if (this._equalizer) {
      this._equalizer.root().on('resize.scola-graph', null);
    }
  }

  _insertInset(width) {
    this._rootMedia = this._root
      .media(`not all and (min-width: ${width})`)
      .call(() => { this._inset = false; })
      .media(`(min-width: ${width})`)
      .call(() => { this._inset = true; })
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
    this._header = controlBar();

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
    this._footer = controlBar();

    this._footer.root()
      .classed('scola footer', true)
      .styles({
        'border-top': '1px solid #CCC',
        'order': 3
      });

    this._body
      .append(() => this._footer.root().node());

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
        'width': '100%'
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

  _delayMessage(text, delay) {
    delay = delay === true ? 250 : delay;

    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      this.message(text);
    }, delay);

    return this;
  }

  _insertItem(item) {
    this._plots.add(item.graph(this));
    return item;
  }

  _deleteItem(item) {
    this._plots.delete(item);
    return item;
  }

  _setPosition(left, top) {
    this._group
      .attr('transform', `translate(${left},${top})`);
  }

  _equalize() {
    const width = this.width();

    if (Number.isNaN(width) === true) {
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

  _setSize() {
    this._group
      .selectAll('text')
      .style('font-size', () => {
        return this._inset === true ?
          '0.9em' : '0.75em';
      });
  }
}
