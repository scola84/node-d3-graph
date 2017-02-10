import Axis from './src/axis';
import BarPlot from './src/bar';
import Graph from './src/graph';
import LinePlot from './src/line';
import ScatterPlot from './src/scatter';

export function axis() {
  return new Axis();
}

export function barPlot() {
  return new BarPlot();
}

export function graph() {
  return new Graph();
}

export function linePlot() {
  return new LinePlot();
}

export function scatterPlot() {
  return new ScatterPlot();
}
