import { select } from 'd3-selection';
import tip from 'd3-tip';
import Axis from './axis';
import Line from './line';
import Scatter from './scatter';
import 'd3-selection-multi';

export default class Graph {
  constructor() {
    this._margin = {
      bottom: 16,
      left: 16,
      right: 16,
      top: 16
    };

    this._offset = -1;
    this._ratio = 1;
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

    this._left = null;
    this._bottom = null;
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

  left() {
    if (!this._left) {
      this._left = new Axis()
        .graph(this);
    }

    return this._left;
  }

  bottom() {
    if (!this._bottom) {
      this._bottom = new Axis()
        .graph(this);
    }

    return this._bottom;
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

    const innerWidth = width -
      this._margin.left -
      this._margin.right -
      this._left.data(data).width();

    const innerHeight = height -
      this._margin.top -
      this._margin.bottom -
      this._bottom.data(data).height();

    this._bottom.scale().range([0, innerWidth]);
    this._left.scale().range([innerHeight, 0]);

    const x = width - this._margin.right - innerWidth;
    const y = this._margin.top;

    this._group
      .attr('transform', `translate(${x},${y})`);

    this._bottom
      .root()
      .attr('transform', `translate(0,${innerHeight})`)
      .call(this._bottom.axis());

    this._left
      .axis()
      .tickSizeInner(-innerWidth);

    this._left
      .root()
      .call(this._left.axis());

    this._left
      .root()
      .select('path')
      .remove();

    this._left
      .root()
      .selectAll('line')
      .style('opacity', 0.2);

    this._group
      .selectAll('text')
      .style('font-size', '0.9em');

    this._collection.forEach((item) => {
      item.render(data);
    });
  }
}

// import series from 'async/series';
// import { controlBar } from '@scola/d3-generic';
// import tip from 'd3-tip';
// import Axis from './axis';
// import Line from './line';
//
// export default class Graph {
//   constructor() {
//     this._x = null;
//     this._y = null;
//
//     this._collection = [];
//
//     this._offset = 0;
//     this._ratio = 0.5;
//
//     this._margin = {
//       bottom: 10,
//       left: 10,
//       right: 10,
//       top: 10
//     };
//
//     this._root = select('body')
//       .append('div')
//       .remove()
//       .classed('scola-graph', true)
//       .styles({
//         'display': 'flex'
//       });
//
//     this._svg = this._root
//       .append('svg')
//       .styles({
//         'background': '#FFF',
//         'border-bottom': '1px solid #CCC',
//         'border-top': '1px solid #CCC',
//         'height': '100%',
//         'width': '100%'
//       });
//
//     this._group = this._svg
//       .append('g');
//
//     this._tip = tip()
//       .attr('class', 'scola-tip')
//       .style('background', '#EEE')
//       .style('padding', '0.5em')
//       .style('border-radius', '0.5em')
//       .offset([-10, 0]);
//
//     this._svg.call(this._tip);
//   }
//
//   group() {
//     return this._group;
//   }
//
//   svg() {
//     return this._svg;
//   }
//
//   destroy() {
//
//   }
//
//   root() {
//     return this._root;
//   }
//
//   x() {
//     if (!this._x) {
//       this._x = new Axis()
//         .graph(this);
//     }
//
//     return this._x;
//   }
//
//   y() {
//     if (!this._y) {
//       this._y = new Axis()
//         .graph(this);
//     }
//
//     return this._y;
//   }
//
//   tip(value = null) {
//     if (value === null) {
//       return this._tip;
//     }
//
//     this._tip.html(value);
//     return this;
//   }
//
//   line() {
//     const line = new Line()
//       .graph(this);
//
//     this._collection.push(line);
//     return line;
//   }
//
//   offset(value = null) {
//     if (value === null) {
//       return this._offset;
//     }
//
//     this._offset = value;
//     return this;
//   }
//
//   ratio(value = null) {
//     if (value === null) {
//       return this._ratio;
//     }
//
//     this._ratio = value;
//     return this;
//   }
//
//   margin(value = null) {
//     if (value === null) {
//       return this._margin;
//     }
//
//     if (typeof value === 'number') {
//       return this.margin({
//         bottom: value,
//         left: value,
//         right: value,
//         top: value
//       });
//     }
//
//     Object.assign(this._margin, value);
//     return this;
//   }
//
//   inset() {
//     this._root.styles({
//       'padding-left': '1em',
//       'padding-right': '1em'
//     });
//
//     this._svg.styles({
//       'border-style': 'none',
//       'border-radius': '0.5em'
//     });
//
//     return this;
//   }
//
//   width() {
//     return parseInt(this._root.style('width'), 10) -
//       parseInt(this._root.style('padding-left'), 10) -
//       parseInt(this._root.style('padding-right'), 10);
//   }
//
//   height() {
//     return parseInt(this._root.style('height'), 10) -
//       parseInt(this._root.style('padding-top'), 10) -
//       parseInt(this._root.style('padding-bottom'), 10);
//   }
//
//   innerWidth() {
//     return this.width() -
//       this._margin.left -
//       this._margin.right -
//       this._y.width();
//   }
//
//   innerHeight() {
//     return this.height() -
//       this._margin.top -
//       this._margin.bottom -
//       this._x.height();
//   }
//
//   render(callback) {
//     this._root.style('height', this.width() * this._ratio + 'px');
//
//     const fn = this._collection.map((item) => (c) => item.render(c));
//
//     series(fn, (error, result) => {
//       if (error) {
//         callback(error);
//         return;
//       }
//
//       const data = result.reduce((initial, item) => initial.concat(item), []);
//       this._render(data, callback);
//     });
//   }
//
//   _render(data, callback) {
//     this._y
//       .scale()
//       .rangeRound([this.innerHeight(), 0]);
//
//     this._y
//       .axis()
//       .tickSizeInner(-this.innerWidth());
//
//     this._y.render(data);
//
//     this._x
//       .scale()
//       .rangeRound([0, this.innerWidth()]);
//
//     this._x.render(data);
//
//     this._x
//       .root()
//       .attr('transform', 'translate(0,' + this.innerHeight() + ')');
//
//     const left = this._margin.left + this._y.width();
//     const top = this._margin.top;
//
//     this._group.attrs({
//       'transform': `translate(${left}, ${top})`
//     });
//
//     callback();
//   }
// }
