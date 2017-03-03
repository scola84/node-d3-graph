import Axis from './src/axis';
import BarPlot from './src/bar';
import Graph from './src/graph';
import LinePlot from './src/line';
import ScatterPlot from './src/scatter';

function axis() {
  return new Axis();
}

function barPlot() {
  return new BarPlot();
}

function graph() {
  return new Graph();
}

function linePlot() {
  return new LinePlot();
}

function scatterPlot() {
  return new ScatterPlot();
}

export {
  axis,
  barPlot,
  graph,
  linePlot,
  scatterPlot
};
