
[<img width="1500" height="400" alt="chart_library" src="https://github.com/user-attachments/assets/4a1d2f4e-9c87-4a66-b2bd-3d56db44b684" />](https://zimjs.com/chart.html)

ZIM Chart can be used for graphs, charts, word clouds and championship round robins for the ZIM JavaScript Canvas Framework at https://zimjs.com. 

<h2>CODE SAMPLE</h2>

```JavaScript
// must import zim_chart
const graph = new BarGraph({
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
const legend = new Legend(graph);
STYLE = {infoicon: {size: 12, color: white}, collapse: true, titleBar: "Legend", draggable: true};
new Panel(legend.width + 20, legend.height + 30, legend).pos(60, 50, RIGHT, BOTTOM);
STYLE = {};
```

<img width="718" height="560" alt="image" src="https://github.com/user-attachments/assets/0a144b08-342c-4900-971e-41c694b672ae" />


<h2>EXAMPLES</h2>
<p>Here are a chart examples</p>

<ul>
    <li><a href="https://zimjs.com/020/bargraph.html">Bar Graph</a></li>
    <li><a href="https://zimjs.com/020/championship.html">Championship</a></li>
    <li><a href="https://zimjs.com/020/growthchart.html">Growth Chart</a></li>
    <li><a href="https://zimjs.com/020/linegraph.html">Line Graph</a></li>
    <li><a href="https://zimjs.com/020/livegraph.html">Live Graph</a></li>
    <li><a href="https://zimjs.com/020/piechart.html">Pie Chart</a></li>
    <li><a href="https://zimjs.com/020/plotgraph.html">Plot Graph</a></li>
    <li><a href="https://zimjs.com/020/radargraph.html">Radar Graph</a></li>
    <li><a href="https://zimjs.com/020/wordcloud.html">Word Cloud</a></li>
</ul>

<h2>CDN</h2>
<p>Usually we use ES Modules to bring in ZIM and if we want Cam then we the code below - see the starting template at the top of the https://zimjs.com/code page.  
</p>

```JavaScript
import "https://zimjs.org/cdn/020/zim_chart";
```

<h2>NPM</h2>
<p>This repository holds the NPM package so you can install from <a href=https://www.npmjs.com/package/@zimjs/chart target=node>@zimjs/chart</a> on NPM.  The <a href=https://www.npmjs.com/package/zimjs target=node>ZIM&nbsp;package</a> must be installed to work.</p>

```JavaScript
import zim from "zimjs"
import { Chart, BarChart, Legend } from "@zimjs/chart"
```

<h2>ZIM</h2>
<p>See the ZIM repository at https://github.com/danzen/zimjs for information on ZIM and open source license, etc.</p>
