import Axis from './src/axis';
import Bar from './src/bar';
import Graph from './src/graph';
import Line from './src/line';
import Scatter from './src/scatter';

export function axis() {
  return new Axis();
}

export function bar() {
  return new Bar();
}

export function graph() {
  return new Graph();
}

export function line() {
  return new Line();
}

export function scatter() {
  return new Scatter();
}
