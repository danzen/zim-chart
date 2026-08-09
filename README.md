![cam](https://github.com/danzen/zim-cam/assets/380281/1725004b-7b50-4405-beda-65be4279cbc6)

Chart is a helper module for the ZIM JavaScript Canvas Framework at https://zimjs.com. Chart includes a base Graph class that BarGraph, LineGraph, LiveGraph, and PlotGraph classes use.  There is also a Legend class that works with these.  Other charts include PieChart, GrowthChart (with an associated GrowthWidget), and RadarGraph. A Championship class is provided for round robin tournaments.  A WordCloud class makes word clounds from text copy - or from data created by the prepareWordData method.

<h2>CODE SAMPLE</h2>

```JavaScript
// CHART
// A bar graph
// https://zimjs.com/020/bargraph.html
// must import zim_chart
const graph = new zim.BarGraph({
   title:"Sales of Vegetables",
   width: 700,
   // comment these out to see with light background
   backgroundColor: black,
   axisColor: light,
   gridColor: grey,
   color: lighter,
   dataColor: silver,
   // end of comment for light background
   info: {
      labelH: "Days",
      labelV: "Sales",
      dataH: {start: 1, end: 7, step: 1},
      dataV: {start: 0, end: 100, step: 10}
   },
   colors: series(purple, yellow, blue),
   data: [
      {item: "Cucumber", icon: null, dataH: [2, 3, 4, 5, 6], dataV: [10, 40, 50, 60, 20]},
      {item: "Lettuce", icon: null, dataH: [2, 3, 4, 5, 6], dataV: [70, 50, 20, 20, 40]},
      {item: "Cilantro", icon: null, dataH: [2, 3, 4, 5, 6], dataV: [20, 50, 80, 90, 50]},
   ],
   // gradients:false
});

// optionally put graph in Panel
STYLE = {infoicon: {size: 12, color: white}, onTop: false, collapse: true, titleBar: "Bar Graph", draggable: true};
new Panel(graph.width, graph.height + 30, graph).center();

// optionally put legend in Panel
const legend = new zim.Legend(graph);
STYLE = {infoicon: {size: 12, color: white}, collapse: true, titleBar: "Legend", draggable: true};
new Panel(legend.width + 20, legend.height + 30, legend).pos(60, 50, RIGHT, BOTTOM);
STYLE = {}
```

<h2>CDN</h2>
<p>Usually we use ES Modules to bring in ZIM and if we want Cam then we the code below - see the starting template at the top of the https://zimjs.com/code page.  
</p>

```JavaScript
import zim from "https://zimjs.org/cdn/016/zim_chart";
```
<h2>EXAMPLES</h2>
<p>Here are a few examples that were made for the ZIM 020 Launch featuring CHART:</p>

- https://zimjs.com/020/linegraph.html - Line Graph
- https://zimjs.com/020/bargraph.html - Bar Graph
- https://zimjs.com/020/plotgraph.html - Plot Graph
- https://zimjs.com/020/piechart.html - Pie Chart
- https://zimjs.com/020/radargraph.html - Radar Graph
- https://zimjs.com/020/livegraph.html - Live Graph
- https://zimjs.com/020/growthchart.html - Growth Chart
- https://zimjs.com/020/wordcloud.html - Word Cloud
- https://zimjs.com/020/championship.html - Championship Round Robin Tournament

<h2>NPM</h2>
<p>This repository holds the NPM package so you can install from <a href=https://www.npmjs.com/package/@zimjs/chart target=node>@zimjs/chart</a> on NPM.  The <a href=https://www.npmjs.com/package/zimjs target=node>ZIM&nbsp;package</a> must be installed to work.</p>

```JavaScript
import zim from "zimjs"
import { BarGraph } from "@zimjs/chart"
```


<h2>ZIM</h2>
<p>See the ZIM repository at https://github.com/danzen/zimjs for information on ZIM and open source license, etc.</p>
