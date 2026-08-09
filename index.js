// ZIM - https://zimjs.com - Code Creativity!
// JavaScript Canvas Framework for General Interactive Media
// free to use - donations welcome of course! https://zimjs.com/donate

import zim from "zimjs";

// ZIM CHART - see https://zimjs.com/code#libraries for examples

// ~~~~~~~~~~~~~~~~~~~~~~~~
// DESCRIPTION - 2026 (c) ZIM
// Charts is a general term for a data diagram.  Graph is a specific type of chart with data axes.

// The Chart Module has bestFit(), Graph(), Legend(), LineGraph(), BarGraph(), PlotGraph(), PieChart(), 
// RadarGraph(), LiveGraph(), GrowthChart(), GrowthWidget(), WordCloud(), and Championship()

// DOCS
// Docs are provided at https://zimjs.com/docs.html
// See CHART MODULE at bottom
// ~~~~~~~~~~~~~~~~~~~~~~~~


zim.bestFit = function (dataH, dataV) {
	// to as y = mx + b;

	var n = dataH.length;
	
	var sumX = 0;
	var sumY = 0;
	for (var i = 0; i < n; i++) {
		sumX += dataH[i];
		sumY += dataV[i];
	}
	var meanX = sumX / n;
	var meanY = sumY / n;
	
	var numerator = 0;
	var denominator = 0;
	
	for (var j = 0; j < n; j++) {
		var diffX = dataH[j] - meanX;
		var diffY = dataV[j] - meanY;
		numerator += diffX * diffY;
		denominator += diffX * diffX;
	}
	
	var m = numerator / denominator;		
	var b = meanY - (m * meanX);
	
	return {slope: m, intercept: b};
}

zim.Graph = function(width, height, title, labelH, labelV, dataH, dataV, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit) {

	var sig = "width, height, title, labelH, labelV, dataH, dataV, backgroundColor, footer, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit";
	var duo; if (duo = zob(zim.Graph, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("Graph",this.group,inherit);

	if (zot(width)) width = DS.width!=null?DS.width:500;
	if (zot(height)) height = DS.height!=null?DS.height:500;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(labelH)) labelH = DS.labelH!=null?DS.labelH:null;
	if (zot(labelV)) labelV = DS.labelV!=null?DS.labelV:null;
	if (zot(dataH)) dataH = DS.dataH!=null?DS.dataH:null;
	if (zot(dataV)) dataV = DS.dataV!=null?DS.dataV:null;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:white;
	if (zot(color)) color = DS.color!=null?DS.color:dark;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:14;
	if (zot(dataColor)) dataColor = DS.dataColor!=null?DS.dataColor:grey;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:10;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:20;
	if (zot(gridThickness)) gridThickness = DS.gridThickness!=null?DS.gridThickness:1;
	if (zot(gridColor)) gridColor = DS.gridColor!=null?DS.gridColor:light;
	if (zot(axisThickness)) axisThickness = DS.axisThickness!=null?DS.axisThickness:1;
	if (zot(axisColor)) axisColor = DS.axisColor!=null?DS.axisColor:dark;		
	if (zot(decimalsH)) decimalsH = DS.decimalsH!=null?DS.decimalsH:1;
	if (zot(decimalsV)) decimalsV = DS.decimalsV!=null?DS.decimalsV:1;

	if (title && title.type != "Label") title = new zim.Label(title, size, font, color);
	if (labelH && labelH.type != "Label") labelH = new zim.Label(labelH, size, font, color);
	if (labelV && labelV.type != "Label") labelV = new zim.Label(labelV, size, font, color);

	var paddingLeft = labelH?(padding/2+labelH.height+padding/2):padding;
	var paddingRight = padding;
	var paddingTop = title?(padding+title.height+padding):padding;
	var paddingBottom = labelV?(padding/2+labelV.height+padding/2):padding;
	if (footer) {
		if (footer.type != "Label") footer = new zim.Label({text:footer, size:size*2/3, font:font, color:color, italic:true}).alp(.5); 		
		this.footer = footer;
		paddingBottom += footer.height + padding/2;
	}

	var dataHeight = 0;
	if (dataH) {
		var temp = new zim.Label(dataH, dataSize);
		dataHeight = temp.height;
		temp.dispose();
		paddingBottom += dataHeight + padding/3;
		this.stepH = dataH.step;
		this.startH = dataH.start;
		this.endH = dataH.end;
	}

	if (dataV) {
		var temp = new zim.Label(dataV, dataSize);
		dataHeight = temp.height;
		temp.dispose();
		paddingLeft += dataHeight + padding/3;
		this.stepV = dataV.step;
		this.startV = dataV.start;
		this.endV = dataV.end;
	}
	
	if (dataH && !zot(dataH.start)) {
		var temp = [];
		var total = Math.ceil(Math.abs(dataH.end-dataH.start) / dataH.step);
		zim.loop(total, function(i) {
			temp.push(dataH.start + i*dataH.step*zim.sign(dataH.end-dataH.start));
		});
		temp.push(dataH.end);
		dataH = temp;
	}
	if (dataV && !zot(dataV.start)) {
		var temp = [];
		var total = Math.ceil(Math.abs(dataV.end-dataV.start) / dataV.step);
		zim.loop(total, function(i) {
			temp.push(dataV.start + i*dataV.step*zim.sign(dataV.end-dataV.start));
		});
		temp.push(dataV.end);
		dataV = temp;
	}

	this.zimContainer_constructor(width, height);
	if (!this.type) this.type = "Graph";

	var that = this;

	that.title = title;
	that.footer = footer;

	that.backgroundColor = backgroundColor;
	var backing = this.backing = new zim.Rectangle({width:width, height:height, color:backgroundColor, group:"chartBacking"}).addTo(this).noMouse();

	var axisH = that.axisH = new zim.Line(width-paddingLeft-paddingRight, axisThickness, axisColor).pos(paddingLeft, paddingBottom, LEFT,BOTTOM, this)
	var axisV = that.axisV = new zim.Line(height-paddingTop-paddingBottom, axisThickness, axisColor).rot(90).pos(paddingLeft, paddingTop, LEFT,TOP, this)

	if (dataH) {
		var linesH = that.linesH = new zim.Container().pos(paddingLeft, paddingBottom, LEFT, BOTTOM, that);
		var labelsH = that.labelsH = new zim.Container().pos(paddingLeft, paddingBottom, LEFT, BOTTOM, that);
		var s = (width-paddingLeft-paddingRight) / (dataH.length-1)
		var firstD = 0;
		var lastD = 0;
		zim.loop(dataH, function(data, i, t) {
			if (i==0) firstD = data;
			new zim.Label({text:zim.decimals(data,1), size:dataSize, font:font, color:dataColor, align:CENTER}).loc(i*s, padding/3, labelsH)
			if (i>0) new zim.Line(height-paddingTop-paddingBottom, gridThickness, gridColor).rot(-90).loc(i*s, 0, linesH)
			lastD = data;
		});			
		that.firstDataH = firstD;
		that.lastDataH = lastD;
	}

	that.offsetH = function(offset) {
		if (zot(offset)) return;
		zim.loop(dataH, function(data, i, t) {
			labelsH.getChildAt(i).text = zim.decimals(data+offset*that.stepH,1)
		});			
	}

	if (dataV) {
		var linesV = that.linesV = new zim.Container().pos(paddingLeft, paddingBottom, LEFT, BOTTOM, that);
		var labelsV = that.labelsV = new zim.Container().pos(paddingLeft, paddingBottom, LEFT, BOTTOM, that);
		var s = (height-paddingTop-paddingBottom) / (dataV.length-1);
		var firstD = 0;
		var lastD = 0;
		zim.loop(dataV, function(data, i, t) {
			if (i==0) firstD = data;
			new zim.Label({text:zim.decimals(data,1), size:dataSize, font:font, color:dataColor, align:CENTER}).rot(-90).loc(-dataHeight-padding/3, -i*s, labelsV)
			if (i>0) new zim.Line(width-paddingLeft-paddingRight, gridThickness, gridColor).loc(0, -i*s, linesV);
			lastD = data;
		});
		that.firstDataV = firstD;
		that.lastDataV = lastD;
	}		

	that.offsetV = function(offset) {
		if (zot(offset)) return;
		zogp(offset)
		zim.loop(dataV, function(data, i, t) {
			labelsV.getChildAt(i).text = zim.decimals(data+offset*that.stepV,1);
		});			
	}

	if (title) title.pos(0,padding,CENTER,TOP,that);
	if (labelH) labelH.pos(0,footer?(footer.height+padding):padding/2,CENTER,BOTTOM,that);
	if (labelV) labelV.rot(-90).pos(padding/2,0,LEFT,CENTER,that);

	if (footer) footer.pos(0, padding/2, CENTER, BOTTOM, that);

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.Graph(width, height, title&&title.clone?title.clone():title, labelH&&labelH.clone?labelH.clone():labelH, labelV&&labelV.clone?labelV.clone():labelV, dataH, dataV, footer&&footer.clone?footer.clone():footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, this.group, inherit));
	};

}
zim.extend(zim.Graph, zim.Container, ["clone"], "zimContainer", false);

zim.Legend  = function(graph, data, colors, gradients, swatchSize, color, font, size, spacingH, spacingV, backdropColor, backdropPadding, backdropPaddingH, backdropPaddingV, style, group, inherit) {
	var sig = "graph, data, colors, gradients, swatchSize, color, font, size, spacingH, spacingV, backdropColor, backdropPadding, backdropPaddingH, backdropPaddingV, style, group, inherit";
	var duo; if (duo = zob(zim.Legend, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("Legend",this.group,inherit);

	if (zot(graph)) graph = DS.graph!=null?DS.graph:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(colors)) colors = DS.colors!=null?DS.colors:null;
	if (zot(gradients)) gradients = DS.gradients!=null?DS.gradients:null;
	if (zot(swatchSize)) swatchSize = DS.swatchSize!=null?DS.swatchSize:20;
	if (zot(color)) color = DS.color!=null?DS.color:dark;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:16;
	if (zot(spacingH)) spacingH = DS.spacingH!=null?DS.spacingH:10;
	if (zot(spacingV)) spacingV = DS.spacingV!=null?DS.spacingV:10;
	if (zot(backdropColor)) backdropColor = DS.backdropColor!=null?DS.backdropColor:lighter;
	if (zot(backdropPadding)) backdropPadding = DS.backdropPadding!=null?DS.backdropPadding:20;
	if (zot(backdropPaddingH)) backdropPaddingH = DS.backdropPaddingH!=null?DS.backdropPaddingH:10;
	if (zot(backdropPaddingV)) backdropPaddingV = DS.backdropPaddingV!=null?DS.backdropPaddingV:20;	

	if (zot(data) && graph) {	
		if (graph.type == "GrowthChart" || graph.type == "PieChart") data = graph.info;
		else if (graph.type == "Radar") data = graph.data[0];
		else data = graph.data;	
	} else data = [];

	if (zot(colors) && graph) colors = graph.finalColors;
	if (zot(gradients) && graph) gradients = graph.gradients;
	else gradients = false;
	
	var that = this;

	var items = [];

	zim.loop(data, function(d,i) {
		if (d.item) d = d.item;
		if (d.icon && d.icon.clone) {
			items.push(d.icon.clone().siz(swatchSize), new zim.Label(d.name, size, font, color))
		} else if (d.icon && (typeof d.icon == "string" || typeof d.icon == "number")) {
			items.push(new zim.Label(d.icon, size, font, color), new zim.Label(d.name, size, font, color))
		} else {
			var c;
			if (!colors || colors[i]==null) c = grey; 
			else c = colors[i];
			var cg = [c,c.toColor(white,.8)];
			if (graph && graph.type=="BarGraph") cg = [c.toColor(white,.8),c];
			if (gradients) c = new zim.GradientColor(cg,90)
			items.push(new zim.Rectangle(swatchSize, swatchSize, c, 1), new zim.Label(d.name?d.name:d, size, font, color))
		}
	});		

	this.zimTile_constructor(items, 2, items.length/2, spacingH, spacingV, true, null, null, null, null, null, null, null, CENTER, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, backdropColor, backdropPadding, backdropPaddingH, backdropPaddingV);

	this.type = "Legend";

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.Legend(graph, data, colors, gradients, swatchSize, color, font, size, spacingH, spacingV, backdropColor, backdropPadding, backdropPaddingH, backdropPaddingV, style, this.group, inherit));
	};

}
zim.extend(zim.Legend, zim.Tile, null, "zimTile")	

zim.LineGraph = function(width, height, title, info, data, showDots, smooth, colors, thickness, gradients, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit) {

	var sig = "width, height, title, info, data, showDots, smooth, colors, thickness, gradients, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit";
	var duo; if (duo = zob(zim.LineGraph, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("LineGraph",this.group,inherit);

	// style defaults for parameters not explicitly set above
	if (zot(width)) width = DS.width!=null?DS.width:null;
	if (zot(height)) height = DS.height!=null?DS.height:null;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(info)) info = DS.info!=null?DS.info:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(smooth)) smooth = DS.smooth!=null?DS.smooth:false;
	if (zot(showDots)) showDots = DS.showDots!=null?DS.showDots:!smooth;
	if (zot(colors)) colors = DS.colors!=null?DS.colors:zim.series(red, blue, green.darken(.2), purple, orange, pink, grey, brown, salmon, interstellar);
	if (zot(thickness)) thickness = DS.thickness!=null?DS.thickness:2;
	if (zot(gradients)) gradients = DS.gradients!=null?DS.gradients:true;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:null;
	if (zot(color)) color = DS.color!=null?DS.color:null;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:null;
	if (zot(dataColor)) dataColor = DS.dataColor!=null?DS.dataColor:null;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:null;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:null;
	if (zot(gridThickness)) gridThickness = DS.gridThickness!=null?DS.gridThickness:null;
	if (zot(gridColor)) gridColor = DS.gridColor!=null?DS.gridColor:null;
	if (zot(axisThickness)) axisThickness = DS.axisThickness!=null?DS.axisThickness:null;
	if (zot(axisColor)) axisColor = DS.axisColor!=null?DS.axisColor:null;
	if (zot(decimalsH)) decimalsH = DS.decimalsH!=null?DS.decimalsH:null;
	if (zot(decimalsV)) decimalsV = DS.decimalsV!=null?DS.decimalsV:null;

	if (zot(info)) {
		info = {
			labelH:"Vertical",
			labelV:"Horizontal",
			dataH:{start:0, end:100, step:10},
			dataV:{start:0, end:100, step:10}
		};
	}
	if (zot(data)) {
		data = [			
			{item:"A", dataH:[10, 50, 90], dataV:[80, 60, 80]},
			{item:"B", dataH:[10, 50, 90], dataV:[50, 70, 40]},
			{item:"C", dataH:[10, 50, 90], dataV:[20, 40, 30]}
		];
	}

	var labelH = info.labelH;
	var labelV = info.labelV;
	var dataH = info.dataH;
	var dataV = info.dataV;

	this.zimGraph_constructor(width, height, title, labelH, labelV, dataH, dataV, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit);
	this.type = "LineGraph";

	var that = this;

	that.info = info;
	that.data = data;
	that.gradients = gradients;

	// data:[
	// 	{item:"Elliot", icon:null, dataH:[5,10,15,20], dataV:[30,45,65,85]},
	// 	{item:"Madeline", icon:null, dataH:[5,10,15,20], dataV:[30,45,55,60]},
	// 	{item:"RoseAnne", icon:null, dataH:[10,20,30,40,50], dataV:[30,40,50,55,55]},
	// 	{item:"Dan", icon:null, dataH:[10,20,30,40,50,60], dataV:[30,45,75,80,80,80]},
	// ]

	var w = that.axisH.width;
	var h = that.axisV.width;

	var hMin = 1000000;
	var hMax = -1000000;
	var hMins = [];
	var hMaxs = [];
	zim.loop(data, function(dd,j) {
		hMins[j] = 1000000;
		hMaxs[j] = -1000000;
		zim.loop(dd.dataH, function(d,i,t) {
			if (d < hMin) hMin = d;
			if (d > hMax) hMax = d;
			if (d < hMins[j]) hMins[j] = d;
			if (d > hMaxs[j]) hMaxs[j] = d;
		});
	});

	var vMin = 1000000;
	var vMax = -1000000;
	var vMins = [];
	var vMaxs = [];
	zim.loop(data, function(dd, j) {
		vMins[j] = 1000000;
		vMaxs[j] = -1000000;
		zim.loop(dd.dataV, function(d,i,t) {
			if (d < vMin) vMin = d;
			if (d > vMax) vMax = d;
			if (d < vMins[j]) vMins[j] = d;
			if (d > vMaxs[j]) vMaxs[j] = d;			
		});
	});

	// if no axis data then assume 0 - largest value as the range
	if (that.lastDataH == null) {
		that.firstDataH = 0;
		that.lastDataH = hMax;
	}
	if (that.lastDataV == null) {
		that.firstDataV = 0;
		that.lastDataV = vMax;
	}

	if (gradients) var shapesBack = that.shapesBack = new zim.Container(w, h).loc(that.axisH.x, that.axisV.y, that);
	if (showDots) var dots = that.dots = new zim.Container(w, h).loc(that.axisH.x, that.axisV.y, that);
	var shapes = that.shapes = new zim.Container(w, h).loc(that.axisH.x, that.axisV.y, that)
	if (data) {
		that.finalColors = [];
		zim.loop(data, function(dd, j) {
			var color = zik(colors);
			that.finalColors.push(color);
			var ratioH = w/(that.lastDataH-that.firstDataH);
			var ratioV = h/(that.lastDataV-that.firstDataV);
			var minV = h-(vMins[j]-that.firstDataV)*ratioV; 
			var maxV = h-(vMaxs[j]-that.firstDataV)*ratioV;				
			if (gradients) {
				var shapeBack = new zim.Shape(shapes.width, shapes.height)
					// .f(color)
					.lf([color.toAlpha(.5), color.toAlpha(0)], [zim.constrain(maxV/shapes.height,0,1), zim.constrain(minV/shapes.height, 0,1)], 0, 0, 0, shapes.height)
					.addTo(shapesBack);
				shapeBack.maxV = maxV; // for later sorting
			}
			var shape = new zim.Shape(shapes.width, shapes.height).s(color).ss(thickness).addTo(shapes);
			var point;
			var point2;
			var pointStart;
			zim.loop(dd.dataH, function(d,i,t) {
				point = new zim.Point((d-that.firstDataH)*ratioH, h-(dd.dataV[i]-that.firstDataV)*ratioV);
				if (i==0) {
					if (gradients) shapeBack.mt(point.x, point.y);
					shape.mt(point.x, point.y);
					pointStart = point.x;
				} else {
					if (smooth && dd.dataH[i+1]) {
						point2 = new zim.Point((dd.dataH[i+1]-that.firstDataH)*ratioH, h-(dd.dataV[i+1]-that.firstDataV)*ratioV);
						var midX = point.x + (point2.x - point.x) / 2;
						var midY = point.y + (point2.y - point.y) / 2;
						if (gradients) shapeBack.qt(point.x, point.y, midX, midY);
						shape.qt(point.x, point.y, midX, midY);
					} else {
						if (gradients) shapeBack.lt(point.x, point.y);
						shape.lt(point.x, point.y);
					}
				}
				if (showDots) new zim.Circle(3, color).loc(point, null, dots);
			});
			if (gradients) shapeBack.lt(point.x, minV-.5).lt(pointStart, minV-.5).cp();
		});
		if (gradients) shapesBack.sortBy("maxV");
	}

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.LineGraph(width, height, title&&title.clone?title.clone():title, info, data, showDots, smooth, colors, thickness, gradients, footer&&footer.clone?footer.clone():footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, this.group, inherit));
	};
}
zim.extend(zim.LineGraph, zim.Graph, null, "zimGraph");

zim.BarGraph = function(width, height, title, info, data, gap, spacing, colors, thickness, gradients, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit) {

	var sig = "width, height, title, info, data, gap, spacing, colors, thickness, gradients, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit";
	var duo; if (duo = zob(zim.BarGraph, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("BarGraph",this.group,inherit);

	// style defaults for parameters not explicitly set above
	if (zot(width)) width = DS.width!=null?DS.width:null;
	if (zot(height)) height = DS.height!=null?DS.height:null;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(info)) info = DS.info!=null?DS.info:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:null;
	if (zot(color)) color = DS.color!=null?DS.color:null;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:null;
	if (zot(dataColor)) dataColor = DS.dataColor!=null?DS.dataColor:null;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:null;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:null;
	if (zot(gridThickness)) gridThickness = DS.gridThickness!=null?DS.gridThickness:null;
	if (zot(gridColor)) gridColor = DS.gridColor!=null?DS.gridColor:null;
	if (zot(axisThickness)) axisThickness = DS.axisThickness!=null?DS.axisThickness:null;
	if (zot(axisColor)) axisColor = DS.axisColor!=null?DS.axisColor:null;
	if (zot(decimalsH)) decimalsH = DS.decimalsH!=null?DS.decimalsH:null;
	if (zot(decimalsV)) decimalsV = DS.decimalsV!=null?DS.decimalsV:null;
	// end style defaults
	if (zot(gap)) gap = DS.gap!=null?DS.gap:25; // between clusters
	if (zot(spacing)) spacing = DS.spacing!=null?DS.spacing:3; // between bars inside cluster
	if (zot(gradients)) gradients = DS.gradients!=null?DS.gradients:true;
	if (zot(thickness)) thickness = DS.thickness!=null?DS.thickness:1;
	if (zot(colors)) colors = DS.colors!=null?DS.colors:zim.series(red, blue, green, purple, orange, pink, grey, brown, salmon, interstellar);


	if (zot(info)) {
		info = {
			labelH:"Vertical",
			labelV:"Horizontal",
			dataH:{start:0, end:100, step:10},
			dataV:{start:0, end:100, step:10}
		};
	}
	if (zot(data)) {
		data = [			
			{item:"A", dataH:[10, 50, 90], dataV:[80, 60, 80]},
			{item:"B", dataH:[10, 50, 90], dataV:[50, 70, 40]},
			{item:"C", dataH:[10, 50, 90], dataV:[20, 40, 30]}
		];
	}

	var labelH = info.labelH;
	var labelV = info.labelV;
	var dataH = info.dataH;
	var dataV = info.dataV;

	this.type = "BarGraph";
	this.zimGraph_constructor(width, height, title, labelH, labelV, dataH, dataV, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit);

	var that = this;

	that.info = info;
	that.data = data;
	that.gradients = gradients;

	// data:[
	// 	{item:"Elliot", icon:null, dataH:[5,10,15,20], dataV:[30,45,65,85]},
	// 	{item:"Madeline", icon:null, dataH:[5,10,15,20], dataV:[30,45,55,60]},
	// 	{item:"RoseAnne", icon:null, dataH:[10,20,30,40,50], dataV:[30,40,50,55,55]},
	// 	{item:"Dan", icon:null, dataH:[10,20,30,40,50,60], dataV:[30,45,75,80,80,80]},
	// ]

	var w = that.axisH.width;
	var h = that.axisV.width;

	var hMin = 1000000;
	var hMax = -1000000;
	var hMins = [];
	var hMaxs = [];
	zim.loop(data, function(dd,j) {
		hMins[j] = 1000000;
		hMaxs[j] = -1000000;
		zim.loop(dd.dataH, function(d,i,t) {
			if (d < hMin) hMin = d;
			if (d > hMax) hMax = d;
			if (d < hMins[j]) hMins[j] = d;
			if (d > hMaxs[j]) hMaxs[j] = d;
		});
	});

	var vMin = 1000000;
	var vMax = -1000000;
	var vMins = [];
	var vMaxs = [];
	zim.loop(data, function(dd, j) {
		vMins[j] = 1000000;
		vMaxs[j] = -1000000;
		zim.loop(dd.dataV, function(d,i,t) {
			if (d < vMin) vMin = d;
			if (d > vMax) vMax = d;
			if (d < vMins[j]) vMins[j] = d;
			if (d > vMaxs[j]) vMaxs[j] = d;			
		});
	});

	// if no axis data then assume 0 - largest value as the range
	if (that.lastDataH == null) {
		that.firstDataH = 0;
		that.lastDataH = hMax;
	}
	if (that.lastDataV == null) {
		that.firstDataV = 0;
		that.lastDataV = vMax;
	}

	var shapesBack = that.shapesBack = new zim.Container(w, h).loc(that.axisH.x, that.axisV.y, that);
	var shapes = that.shapes = new zim.Container(w, h).loc(that.axisH.x, that.axisV.y, that)

	if (data) {

		var step = 1;
		if (info && info.dataH && info.dataH.step) step = Number(info.dataH.step);

		var distH = w / that.linesH.numChildren; // between each line (axis does not count)	
		// var barWidth = (distH/step - gap - (data.length-1)*spacing) / data.length;
		var barWidth = Math.max(2, (distH - gap - (data.length - 1) * spacing) / data.length);

		that.finalColors = [];

		zim.loop(data, function(dd, j) {
			var color = zik(colors);
			that.finalColors.push(color);
			var ratioH = w/(that.lastDataH-that.firstDataH);
			var ratioV = h/(that.lastDataV-that.firstDataV);
			var minV = h-(vMins[j]-that.firstDataV)*ratioV; 
			var maxV = h-(vMaxs[j]-that.firstDataV)*ratioV;
			
			var shapeBack = new zim.Shape(shapes.width, shapes.height);				
			if (gradients) {
				shapeBack.lf([color.toColor(white,.8), color], [zim.constrain(maxV/shapes.height,0,1), 1], 0, 0, 0, shapes.height)
			} else {
				shapeBack.f(color);
			}
			shapeBack.addTo(shapesBack);
		
			var shape = new zim.Shape(shapes.width, shapes.height)
				.s(color.darken(.2)).ss(thickness)
				.addTo(shapes);
			
			var groupOffset = (barWidth + spacing) * j - (data.length * barWidth + (data.length - 1) * spacing) / 2;
			zim.loop(dd.dataH, function(d, i, t) {
				var point = new zim.Point((d - that.firstDataH) * ratioH, h - (dd.dataV[i] - that.firstDataV) * ratioV);			
				var barLeft = point.x + groupOffset;
				shapeBack
					.mt(barLeft, h)
					.lt(barLeft, point.y)
					.lt(barLeft + barWidth, point.y)
					.lt(barLeft + barWidth, h);
				shape
					.mt(barLeft, h)
					.lt(barLeft, point.y)
					.lt(barLeft + barWidth, point.y)
					.lt(barLeft + barWidth, h);
			});
			shapeBack.cp();
		});
		
	}
	that.axisH.top();
	that.axisV.top();

	if (style!==false) zim.styleTransforms(this, DS);
	
	this.clone = function() {
		return that.cloneProps(new zim.BarGraph(width, height, title&&title.clone?title.clone():title, info, data, gap, spacing, colors, thickness, gradients, footer&&footer.clone?footer.clone():footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, this.group, inherit));
	};
}
zim.extend(zim.BarGraph, zim.Graph, null, "zimGraph");

zim.PlotGraph = function(width, height, title, info, data, extrapolate, colors, thickness, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit) {

	var sig = "width, height, title, info, data, extrapolate, colors, thickness, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit";
	var duo; if (duo = zob(zim.PlotGraph, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("PlotGraph",this.group,inherit);

	if (zot(width)) width = DS.width!=null?DS.width:null;
	if (zot(height)) height = DS.height!=null?DS.height:null;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(info)) info = DS.info!=null?DS.info:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(extrapolate)) extrapolate = DS.extrapolate!=null?DS.extrapolate:false;
	if (zot(colors)) colors = DS.colors!=null?DS.colors:zim.series(red, blue, green.darken(.2), purple, orange, pink, grey, brown, salmon, interstellar);
	if (zot(thickness)) thickness = DS.thickness!=null?DS.thickness:2;		
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:null;
	if (zot(color)) color = DS.color!=null?DS.color:null;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:null;
	if (zot(dataColor)) dataColor = DS.dataColor!=null?DS.dataColor:null;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:null;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:null;
	if (zot(gridThickness)) gridThickness = DS.gridThickness!=null?DS.gridThickness:null;
	if (zot(gridColor)) gridColor = DS.gridColor!=null?DS.gridColor:null;
	if (zot(axisThickness)) axisThickness = DS.axisThickness!=null?DS.axisThickness:null;
	if (zot(axisColor)) axisColor = DS.axisColor!=null?DS.axisColor:null;
	if (zot(decimalsH)) decimalsH = DS.decimalsH!=null?DS.decimalsH:null;
	if (zot(decimalsV)) decimalsV = DS.decimalsV!=null?DS.decimalsV:null;

	if (zot(info)) {
		info = {
			labelH:"Vertical",
			labelV:"Horizontal",
			dataH:{start:0, end:100, step:10},
			dataV:{start:0, end:100, step:10}
		};
	}
	if (zot(data)) {
		data = [			
			{item:"A", dataH:[10, 50, 90], dataV:[80, 60, 80]},
			{item:"B", dataH:[10, 50, 90], dataV:[50, 70, 40]},
			{item:"C", dataH:[10, 50, 90], dataV:[20, 40, 30]}
		];
	}

	var labelH = info.labelH;
	var labelV = info.labelV;
	var dataH = info.dataH;
	var dataV = info.dataV;

	this.zimGraph_constructor(width, height, title, labelH, labelV, dataH, dataV, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit);
	this.type = "PlotGraph";

	var that = this;

	that.info = info;
	that.data = data;

	var w = that.axisH.width;
	var h = that.axisV.width;

	var hMin = 1000000;
	var hMax = -1000000;
	var hMins = [];
	var hMaxs = [];
	zim.loop(data, function(dd,j) {
		hMins[j] = 1000000;
		hMaxs[j] = -1000000;
		zim.loop(dd.dataH, function(d,i,t) {
			if (d < hMin) hMin = d;
			if (d > hMax) hMax = d;
			if (d < hMins[j]) hMins[j] = d;
			if (d > hMaxs[j]) hMaxs[j] = d;
		});
	});

	var vMin = 1000000;
	var vMax = -1000000;
	var vMins = [];
	var vMaxs = [];
	zim.loop(data, function(dd, j) {
		vMins[j] = 1000000;
		vMaxs[j] = -1000000;
		zim.loop(dd.dataV, function(d,i,t) {
			if (d < vMin) vMin = d;
			if (d > vMax) vMax = d;
			if (d < vMins[j]) vMins[j] = d;
			if (d > vMaxs[j]) vMaxs[j] = d;			
		});
	});

	// if no axis data then assume 0 - largest value as the range
	if (that.lastDataH == null) {
		that.firstDataH = 0;
		that.lastDataH = hMax;
	}
	if (that.lastDataV == null) {
		that.firstDataV = 0;
		that.lastDataV = vMax;
	}

	var shapes = that.shapes = new zim.Container(w, h).loc(that.axisH.x, that.axisV.y, that)
	if (data) {
		that.finalColors = [];
		zim.loop(data, function(dd, j) {
			var color = zik(colors);
			that.finalColors.push(color);
			var ratioH = w/(that.lastDataH-that.firstDataH);
			var ratioV = h/(that.lastDataV-that.firstDataV);
			var minV = h-(vMins[j]-that.firstDataV)*ratioV; 
			var maxV = h-(vMaxs[j]-that.firstDataV)*ratioV;
			
			var shape = new zim.Shape(shapes.width, shapes.height).s(color).ss(thickness).addTo(shapes);
			var point;
			var pointStart;
			var pointsH = [];
			var pointsV = [];
			zim.loop(dd.dataH, function(d,i,t) {
				point = new zim.Point((d-that.firstDataH)*ratioH, h-(dd.dataV[i]-that.firstDataV)*ratioV);	
				pointsH.push(point.x);					
				pointsV.push(point.y);					
				new zim.Circle(3, color).loc(point, null, shapes);
			});

			var calc = zim.bestFit(pointsH, pointsV);
			if (extrapolate) shape.mt(0, calc.slope*0 + calc.intercept).lt(w, calc.slope*w + calc.intercept);
			else shape.mt(pointsH[0], calc.slope*pointsH[0] + calc.intercept).lt(pointsH[pointsH.length-1], calc.slope*pointsH[pointsH.length-1] + calc.intercept);
				
		}); 
	}

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.PlotGraph(width, height, title&&title.clone?title.clone():title, info, data, extrapolate, colors, thickness, footer&&footer.clone?footer.clone():footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, this.group, inherit));
	};
}
zim.extend(zim.PlotGraph, zim.Graph, null, "zimGraph");

zim.PieChart = function(width, height, info, data, units, title, footer, backgroundColor, color, size, dataSize, font, spacing, iconOrient, iconFlip, iconWidth, iconScale, dec, padding, showData, showInfo, exchange, shiftForWedge, style, group, inherit) {

	var sig = "width, height, info, data, units, title, footer, backgroundColor, color, size, dataSize, font, spacing, iconOrient, iconFlip, iconWidth, iconScale, dec, padding, showData, showInfo, exchange, shiftForWedge, style, group, inherit";
	var duo; if (duo = zob(zim.PieChart, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("PieChart",this.group,inherit);

	if (zot(width)) width = DS.width!=null?DS.width:400;
	if (zot(height)) height = DS.height!=null?DS.height:width;
	if (zot(info)) info = DS.info!=null?DS.info:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(units)) units = DS.units!=null?DS.units:null;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:white;
	if (zot(color)) color = DS.color!=null?DS.color:dark;
	if (zot(size)) size = DS.size!=null?DS.size:14;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:size;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(spacing)) spacing = DS.spacing!=null?DS.spacing:5;
	if (zot(iconOrient)) iconOrient = DS.iconOrient!=null?DS.iconOrient:true;
	if (zot(iconFlip)) iconFlip = DS.iconFlip!=null?DS.iconFlip:true;
	if (zot(iconWidth)) iconWidth = DS.iconWidth!=null?DS.iconWidth:null;
	if (zot(iconScale)) iconScale = DS.iconScale!=null?DS.iconScale:null;
	if (zot(dec)) dec = DS.dec!=null?DS.dec:0;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:10;
	if (zot(showData)) showData = DS.showData!=null?DS.showData:true;
	if (zot(showInfo)) showInfo = DS.showInfo!=null?DS.showInfo:true;
	if (zot(exchange)) exchange = DS.exchange!=null?DS.exchange:false;
	if (zot(shiftForWedge)) shiftForWedge = DS.shiftForWedge!=null?DS.shiftForWedge:true;

	var num = 4;
	if (zot(info)) {
		var colors = series(red,salmon,orange,yellow,green,blue,purple,pink,brown,grey).mix();
		var labels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
		info = [];
		zim.loop(num, function(i) {
			info.push({name:"Info " + labels[i], backgroundColor:colors().darken(rand(-.1,.3)), color:white});				
		});
	}
	if (zot(data)) {
		data = [];
		zim.loop(num, function(j) {
			data.push(zim.decimals(zim.rand(50,200,false), dec));
		});			
	}


	var testLabel = new zim.Label("test", dataSize);
	var added = 0;
	if ((showInfo && !exchange) || (showData && exchange)) added = testLabel.height;

	if (title && title.type != "Label") title = new zim.Label(title, size, font, color);
	var paddingTop = title?(padding+title.height+padding):padding;
	if (footer && footer.type != "Label") footer = new zim.Label({text:footer, size:size*2/3, font:font, color:color, italic:true}).alp(.5); 		
	var paddingBottom = footer?(padding/2+footer.height+padding/2):padding;
	
	this.zimContainer_constructor(width, height);

	var radius = this.radius = (Math.min(width, height) - (paddingTop + (added + spacing) * 2 + paddingBottom)) / 2;

	var that = this;

	that.type = "PieChart";
	that.info = info;
	that.data = data;
	that.title = title;
	that.footer = footer;

	that.backgroundColor = backgroundColor;
	var backing = this.backing = new zim.Rectangle({width:width, height:height, color:backgroundColor, group:"chartBacking"}).addTo(this).noMouse();
	var circle = this.circle = new zim.Circle(radius-1, "#666").center(this);
	var shape = this.shape = new zim.Shape().loc(this.width/2, this.height/2, this).noMouse();
	
	var desiredBeginAngles;
	var desiredEndAngles;
	var outerLabels;
	var wedges;
	var icons;
	var innerLabels;

	function setChart(obj) {
		shape.c();
		if (outerLabels) outerLabels.disposeAllChildren();
		if (innerLabels) innerLabels.disposeAllChildren();
		// have to get the top num and work with those
		var total = 0;
		zim.loop(data, function(d) {total+=d});
		
		var angles = that.angles = [];
		zim.loop(data, function(d) {angles.push(d/total*360)});
		// or with ES6
		// var angles = data.map(x => x / total * 360);

		var beginAngle = -90; // 0 is along positive x axis so -90 is up
		var endAngle = -90;
		
		
		if (added>0) outerLabels = that.outerLabels = new zim.Container(width, height).addTo(that).noMouse();
		wedges = that.wedges = new zim.Container(width, height).addTo(that).noMouse();		
		icons = that.icons = new zim.Container(width, height).addTo(that).noMouse();
		innerLabels = that.innerLabels = new zim.Container(width, height).addTo(that).noMouse();
		that.finalColors = [];
		that.anglesWedges = [];
		that.currentWedges = [];
		zim.loop(angles, function(angle, i) {				
			endAngle += angle;				
			var item = info[i];
			var c = item.backgroundColor;
			that.finalColors.push(c);				
			// Normal flat wedge
			shape.f(c)
				.mt(0, 0)
				.a(0, 0, radius, beginAngle * zim.RAD, endAngle * zim.RAD);
			
			var r = endAngle+90-angle/2;

			var l1;
			if (added > 0) {
				l1 = new zim.LabelOnArc(exchange?data[i]+(units?units:""):info[i].name, dataSize, null, color, radius, r>90&&r<270, spacing, 0).rot(r).center(outerLabels);
				l1.angleCenter = r;
				l1.start = {x:l1.x, y:l1.y};
			}

			if ((showData && !exchange) || (showInfo && exchange)) {
				var l2 = new zim.LabelOnArc(exchange?info[i].name:data[i]+(units?units:""), dataSize, null, zot(item.color)?zim.toBW(info[i].backgroundColor):item.color, radius-testLabel.height, r>90&&r<270, -spacing*2, 0).rot(r).center(innerLabels);
				if (l2.angle > angle) l2.vis(false);
				l2.start = {x:l2.x, y:l2.y};
			}

			if (item.icon) {
				var icon;
				if (typeof item.icon == "string") {
					icon = new zim.Label(item.icon, null, font, color);
					if (!zot(iconScale)) icon.sca(iconScale);
				} else {
					icon = item.icon.clone();
					if (!zot(iconWidth)) icon.siz(iconWidth);
				}
				var iHold = new zim.Container(-icon.width/2, -icon.height/2, icon.width, icon.height);
				icon.center(iHold);
				iHold.reg(0,radius*.6).rot(r);
				if (!iconOrient) icon.rot(-r);
				else if (iconFlip && r>90 && r<270) icon.rot(180);
				iHold.loc(width/2,height/2,icons);
				iHold.start = {x:iHold.x, y:iHold.y};
			}

			that.anglesWedges.push([beginAngle, endAngle, l1, l2, iHold]);
			that.currentWedges.push(null);
			beginAngle = endAngle;
		});

		if (added > 0) {
			var items = outerLabels.children;
			var result = resolveOverlaps(items);
			// result.forEach(function(item) {
			// 	var half = item.angle / 2;
			// 	var start = ((item.angleCenter - half) % 360 + 360) % 360;
			// 	console.log(
			// 		'center=' + item.angleCenter +
			// 		' sweep=' + item.angle +
			// 		' (' + start.toFixed(1) + '°–' + (start + item.angle).toFixed(1) + '°)' +
			// 		' visible=' + item.visible
			// 	);
			// });
		}
		
	}
	setChart();

	// AI Claude code to get index - could have done this, but lazy now... done it before, I am sure.
	function getIndex(x, y) {
		// Get angle from positive x-axis (-180 to 180)
		var radians = Math.atan2(y, x);
		var degrees = radians * 180 / Math.PI;
		
		// Shift origin to top y-axis (12 o'clock) for downward Y-axis
		var clockwiseDegrees = 90 + degrees;
		
		// Normalize to 0-360 range
		if (clockwiseDegrees < 0) {
			clockwiseDegrees += 360;
		}
		if (clockwiseDegrees >= 360) {
			clockwiseDegrees -= 360;
		}
		
		// Find matching wedge index using this.angles
		var currentSum = 0;
		var angles = that.angles;
		for (var i = 0; i < angles.length; i++) {
			currentSum += angles[i];
			if (clockwiseDegrees < currentSum) {
				return i;
			}
		}    
		return angles.length - 1;
	}
	that.getIndex = getIndex;
	// END AI


	circle.movement(function() {
		var point = that.circle.globalToLocal(F.mouseX, F.mouseY);
		that.rollIndex = getIndex(point.x, point.y);
	});
	circle.on("mouseout", function() {
		that.rollIndex = null
	});
	circle.on("mousedown", function() {
		var point = that.circle.globalToLocal(F.mouseX, F.mouseY);
		that.index = getIndex(point.x, point.y);
		that.dispatchEvent("change")
	});

	// AI Claude assisted
	var lastFactor = 10;
	function raiseWedge(index, factor) {
		if (that.currentWedges[index]) return;
		lastFactor = factor = zot(factor)?lastFactor:factor;
		var wedge = new zim.Shape().loc(that.width/2, that.height/2, wedges);		
		that.currentWedges[index] = wedge;	
		var c = that.finalColors[index];
		var beginAngle = that.anglesWedges[index][0];
		var endAngle = that.anglesWedges[index][1];
		var midAngle = (beginAngle + endAngle) / 2;			
		var liftX = Math.cos(midAngle * zim.RAD) * factor;
		var liftY = Math.sin(midAngle * zim.RAD) * factor;
		wedge.l1 = that.anglesWedges[index][2];
		wedge.l2 = that.anglesWedges[index][3];
		wedge.icon = that.anglesWedges[index][4];
		if (wedge.l1 && shiftForWedge) wedge.l1.mov(liftX, liftY);
		if (wedge.l2) wedge.l2.mov(liftX, liftY);
		if (wedge.icon) wedge.icon.mov(liftX, liftY);
		var darkColor = c.darken(0.4);
		// --- 1. Left radial side face (beginAngle edge) ---
		var lx0 = Math.cos(beginAngle * zim.RAD) * radius;
		var ly0 = Math.sin(beginAngle * zim.RAD) * radius;
		wedge.f(darkColor)
			.mt(0, 0)
			.lt(lx0, ly0)
			.lt(lx0 + liftX, ly0 + liftY)
			.lt(liftX, liftY)
			.cp(); // close path
		// --- 2. Right radial side face (endAngle edge) ---
		var rx0 = Math.cos(endAngle * zim.RAD) * radius;
		var ry0 = Math.sin(endAngle * zim.RAD) * radius;
		wedge.f(darkColor)
			.mt(0, 0)
			.lt(rx0, ry0)
			.lt(rx0 + liftX, ry0 + liftY)
			.lt(liftX, liftY)
			.cp();
		// --- 3. Arc side face (the "rim" of the lifted wedge) ---
		// Draw a band between the base arc and lifted arc
		wedge.f(darkColor)
			.mt(lx0, ly0)
			.a(0, 0, radius, beginAngle * zim.RAD, endAngle * zim.RAD)
			.lt(rx0 + liftX, ry0 + liftY)
			.a(liftX, liftY, radius, endAngle * zim.RAD, beginAngle * zim.RAD, true) // reverse arc
			.cp();
		// --- 4. Top face — the lifted wedge itself ---
		wedge.f(c)
			.mt(liftX, liftY)
			.a(liftX, liftY, radius, beginAngle * zim.RAD, endAngle * zim.RAD)
			.lt(liftX, liftY)
			.cp();
	}		
	that.raiseWedge = raiseWedge;
	// END AI

	function lowerWedge(index) {
		if (zot(index) || (typeof index != "number" && !Array.isArray(index))) {
			index = that.currentWedges;
		} else {
			if (!Array.isArray(index)) index = [index];
		}
		zim.loop(index, function(i) {
			var wedge = (i!=null&&i.type=="Shape")?i:that.currentWedges[i];
			if (!wedge) return;
			if (wedge.l1) wedge.l1.loc(wedge.l1.start);
			if (wedge.l2) wedge.l2.loc(wedge.l2.start);
			if (wedge.icon) wedge.icon.loc(wedge.icon.start);
			wedge.dispose();
			that.currentWedges[index] = null;
		});			
		// if (that.stage) that.stage.update();
	}
	that.lowerWedge = lowerWedge;

	// AI Equation Claude 4.6
	function resolveOverlaps(items) {
		var m = items.length;
		// Compute segments; wrapping items (end > 360) split into two
		var itemSegs = [];
		for (var i = 0; i < m; i++) itemSegs.push([]);
		var segments = [];
		items.forEach(function(item, i) {
			var half  = item.angle / 2;
			var start = ((item.angleCenter - half) % 360 + 360) % 360;
			var end   = start + item.angle;
			if (end > 360) {
			itemSegs[i].push(segments.length);
			segments.push({ idx: i, start: 0, end: end - 360, sweep: item.angle });
			itemSegs[i].push(segments.length);
			segments.push({ idx: i, start: start, end: 360, sweep: item.angle });
			} else {
			itemSegs[i].push(segments.length);
			segments.push({ idx: i, start: start, end: end, sweep: item.angle });
			}
		});
		// Build conflict bitmask per item
		function segsOverlap(a, b) { return a.start < b.end && b.start < a.end; }
		var conflicts = [];
		for (var i = 0; i < m; i++) {
			conflicts[i] = 0;
			for (var j = 0; j < m; j++) {
			if (i === j) continue;
			for (var a = 0; a < itemSegs[i].length; a++)
				for (var b = 0; b < itemSegs[j].length; b++)
				if (segsOverlap(segments[itemSegs[i][a]], segments[itemSegs[j][b]]))
					conflicts[i] |= (1 << j);
			}
		}
		// Bitmask DP over all 2^m subsets
		var dp = new Array(1 << m).fill(null);
		dp[0] = { count: 0, sweep: 0 };
		for (var mask = 0; mask < (1 << m); mask++) {
			if (!dp[mask]) continue;
			for (var i = 0; i < m; i++) {
			if (mask & (1 << i)) continue;       // already included
			if (conflicts[i] & mask) continue;   // conflicts with current set
			var newMask = mask | (1 << i);
			var next = { count: dp[mask].count + 1, sweep: dp[mask].sweep + items[i].angle };
			var prev = dp[newMask];
			if (!prev || next.count > prev.count ||
				(next.count === prev.count && next.sweep > prev.sweep))
				dp[newMask] = next;
			}
		}
		// Pick the best mask
		var bestMask = 0, best = { count: 0, sweep: 0 };
		for (var mask = 0; mask < (1 << m); mask++) {
			var s = dp[mask];
			if (!s) continue;
			if (s.count > best.count || (s.count === best.count && s.sweep > best.sweep)) {
			best = s; bestMask = mask;
			}
		}
		items.forEach(function(item, i) { item.visible = !!(bestMask & (1 << i)); });
		return items;
	} // END AI
	
	if (title) title.pos(0,padding,CENTER,TOP,that);
	if (footer) footer.pos(0, padding/2, CENTER, BOTTOM, that);

	testLabel.dispose();

	if (style!==false) zim.styleTransforms(this, DS);


	this.clone = function() {
		return that.cloneProps(new zim.PieChart(width, height, info, data, units, title&&title.clone?title.clone():title, footer&&footer.clone?footer.clone():footer, backgroundColor, color, size, font, spacing, iconOrient, iconFlip, iconWidth, iconScale, dec, padding, style, this.group, inherit));
	};

}
zim.extend(zim.PieChart, zim.Container, ["clone"], "zimContainer", true);

zim.RadarGraph = function(data, radius, num, title, footer, backgroundColor, color, font, size, circleColor, circleAlpha, circleBorderColor, circleBorderWidth, circleBorderAlpha, circleLastBorderColor, lineThickness, lineColor, shapeColor, shapeAlpha, shapeLineThickness, shapeLineColor, gradients, dotRadius, dotColor, dotBorderColor, dotBorderWidth, showDots, blendmode, numbers, numbersAngle, numbersColor, numbersSize, numbersFactor, padding, labelMargin, style, group, inherit) {

	var sig = "data, radius, num, title, footer, backgroundColor, color, font, size, circleColor, circleAlpha, circleBorderColor, circleBorderWidth, circleBorderAlpha, circleLastBorderColor, lineThickness, lineColor, shapeColor, shapeAlpha, shapeLineThickness, shapeLineColor, gradients, dotRadius, dotColor, dotBorderColor, dotBorderWidth, showDots, blendmode, numbers, numbersAngle, numbersColor, numbersSize, numbersFactor, padding, labelMargin, style, group, inherit";
	var duo; if (duo = zob(zim.RadarGraph, arguments, sig, this)) return duo;
	// // z_d("67.3");

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("RadarGraph", this.group, inherit);

	if (zot(data)) data = DS.data!=null?DS.data:[["One", "Two", "Three"], ["Good", "Bad", "Ugly"], [[5,6,7], [8,4,8], [6,10,9]]];
	if (zot(radius)) radius = DS.radius!=null?DS.radius:200;
	if (zot(num)) num = DS.num!=null?DS.num:10;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:white;
	if (zot(color)) color = DS.color!=null?DS.color:dark;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:20;
	if (zot(circleColor)) circleColor = DS.circleColor!=null?DS.circleColor:clear;
	if (zot(circleAlpha)) circleAlpha = DS.circleAlpha!=null?DS.circleAlpha:.05;
	if (zot(circleBorderColor)) circleBorderColor = DS.circleBorderColor!=null?DS.circleBorderColor:light;
	if (zot(circleBorderWidth)) circleBorderWidth = DS.circleBorderWidth!=null?DS.circleBorderWidth:1;
	if (zot(circleBorderAlpha)) circleBorderAlpha = DS.circleBorderAlpha!=null?DS.circleBorderAlpha:.2;
	if (zot(circleLastBorderColor)) circleLastBorderColor = DS.circleLastBorderColor!=null?DS.circleLastBorderColor:mist;
	if (zot(lineThickness)) lineThickness = DS.lineThickness!=null?DS.lineThickness:1;
	if (zot(lineColor)) lineColor = DS.lineColor!=null?DS.lineColor:dark;
	if (zot(shapeColor)) shapeColor = DS.shapeColor!=null?DS.shapeColor:zim.series(red,blue,green,orange,purple,yellow,pewter,interstellar,pink,salmon);
	if (zot(shapeAlpha)) shapeAlpha = DS.shapeAlpha!=null?DS.shapeAlpha:.2;
	if (zot(shapeLineThickness)) shapeLineThickness = DS.shapeLineThickness!=null?DS.shapeLineThickness:3;
	if (zot(shapeLineColor)) shapeLineColor = DS.shapeLineColor!=null?DS.shapeLineColor:zim.series(red,blue,green,orange,purple,yellow,pewter,interstellar,pink,salmon);
	if (zot(gradients)) gradients = DS.gradients!=null?DS.gradients:true;
	if (zot(dotRadius)) dotRadius = DS.dotRadius!=null?DS.dotRadius:3;
	if (zot(dotColor)) dotColor = DS.dotColor!=null?DS.dotColor:lineColor;
	if (zot(dotBorderColor)) dotBorderColor = DS.dotBorderColor!=null?DS.dotBorderColor:-1;
	if (zot(dotBorderWidth)) dotBorderWidth = DS.dotBorderWidth!=null?DS.dotBorderWidth:1;
	if (zot(showDots)) showDots = DS.showDots!=null?DS.showDots:true;
	if (zot(blendmode)) blendmode = DS.blendmode!=null?DS.blendmode:null;
	if (zot(numbers)) numbers = DS.numbers!=null?DS.numbers:true;
	if (zot(numbersAngle)) numbersAngle = DS.numbersAngle!=null?DS.numbersAngle:0;
	if (zot(numbersColor)) numbersColor = DS.numbersColor!=null?DS.numbersColor:lineColor;
	if (zot(numbersSize)) numbersSize = DS.numbersSize!=null?DS.numbersSize:12;
	if (zot(numbersFactor)) numbersFactor = DS.numbersFactor!=null?DS.numbersFactor:1;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:20;
	if (zot(labelMargin)) labelMargin = DS.labelMargin!=null?DS.labelMargin:padding/4;

	var sampleLabel = new zim.Label("test");
	if (title && title.type != "Label") title = new zim.Label(title, size, font, color);
	var extraTop = padding + (title?title.height:0) + labelMargin + sampleLabel.height*.66; // radial labels
	var extraBottom = padding + labelMargin + sampleLabel.height*.5;
	if (footer) {
		if (footer.type != "Label") footer = new zim.Label({text:footer, size:size*2/3, font:font, color:color, italic:true}).alp(.5); 		
		this.footer = footer;
		extraBottom += footer.height + padding/2;
	}
	
	this.zimContainer_constructor((radius+padding+labelMargin + sampleLabel.height*.25)*2, radius*2+extraTop+extraBottom);
	this.type = "Radar";
	var that = this;	

	sampleLabel.dispose();
	sampleLabel = null;
	
	that.gradients = gradients;
	that.finalColors = [];

	that.backgroundColor = backgroundColor;
	var backing = this.backing = new zim.Rectangle({width:that.width, height:that.height, color:backgroundColor, group:"chartBacking"}).addTo(this).noMouse();

	// -------------- DATA ----------------

	that.data = data;
	zim.loop(data[0], function(d) {
		if (zot(d) || d==="") data[0].pop();
	}, true);

	zim.loop(data[1], function(d) {
		if (zot(d) || d==="") data[1].pop();
	}, true);

	var maxes = [];
	zim.loop(data[2], function(d2, j) {
		if (j > data[0].length-1) {
			data[2].pop();
			return;
		}
		zim.loop(d2, function(d, i) {
			if (zot(d) || d==="" || i > data[1].length-1) {
				d2.pop();
				return;
			}
			// d = d2[i] = rand(10)
			if (zot(maxes[j]) || maxes[j] < d) maxes[j] = d;
		}, true);			
	}, true);


	// -------------- CIRCLES ----------------

	var circles = that.circles = new zim.Container(radius*2, radius*2).pos(0,extraTop+labelMargin,CENTER,TOP,this).noMouse();

	zim.loop(num, function(i,t) {
		var color = zik(circleColor);			
		if (color == clear) {
			circleAlpha = 0;
			circleColor = black;
		}
		var c = new zim.Circle(radius/(t)*(i+1), zik(circleColor).toAlpha(circleAlpha), zik(circleBorderColor).toAlpha(circleBorderAlpha), zik(circleBorderWidth)).center(circles);
		if (i==t-1) c.borderColor = circleLastBorderColor;
	});

	

	// -------------- LINES ----------------

	var lines = that.lines = new zim.Container(radius*2, radius*2).loc(circles.x, circles.y, that).noMouse();
	var angle = that.angle = 360 / data[1].length;
	zim.loop(data[1].length, function(i,t) {
		new zim.Line(radius, lineThickness, lineColor).loc(radius, radius, lines).rot(-90+i*angle)
	});


	// -------------- SHAPES ----------------
	
	var shapes = that.shapes = new zim.Container(radius*2, radius*2).loc(circles.x, circles.y, that).noMouse();
	if (dotRadius > 0) {
		var dots = that.dots = new zim.Container().loc(circles.x+radius, circles.y+radius, that).noMouse();
	}		

	zim.loop(data[0].length, function(i,t) {
		var c = zik(shapeColor);
		that.finalColors.push(c);
		var shape = new zim.Shape().loc(radius, radius, shapes);
		if (gradients) shape.rf([c.toAlpha(0), c], [.6,1], 0, 0, 0, 0, 0, maxes[i]/num*radius)
		else shape.f(c.toAlpha(shapeAlpha))
		shape.s(zik(shapeLineColor))
			.ss(zik(shapeLineThickness));
		if (blendmode) shape.ble(blendmode);
		var dd = data[2][i];
		var p = new zim.Point(0, -data[2][i][0]/num*radius);
		shape.mt(p.x, p.y);
		if (showDots && dotRadius > 0) {
			new zim.Circle(dotRadius, zik(dotColor), zik(dotBorderColor), zik(dotBorderWidth)).loc(p, null, dots)
		}
		zim.loop(dd, function(d, i, t) {
			if (i==0) return;
			var a = angle*i-90;
			var len = d/num*radius;
			var p = new zim.Point(len*Math.cos(a*RAD), len*Math.sin(a*RAD))
			shape.lt(p.x, p.y);
			if (showDots && dotRadius > 0) {
				new zim.Circle(dotRadius, zik(dotColor), zik(dotBorderColor), zik(dotBorderWidth)).loc(p, null, dots)
			}
		})
		shape.cp();
	});

	// -------------- LABELS ----------------

	var labels = that.labels = new zim.Container(radius*2, radius*2).loc(circles.x, circles.y, that).noMouse();
	zim.loop(data[1], function(name, i, t) {
		var a = i*angle;		
		new zim.LabelOnArc(name,size*.66,font,color,radius+labelMargin,a>90&&a<270).rot(a).center(labels);
	});

	// -------------- NUMBERS ----------------

	if (numbers) {
		var numbers = that.numbers = new zim.Container().loc(circles.x+radius, circles.y+radius, that).noMouse();
		zim.loop(num, function(i,t) {
			var color = zik(circleColor);		
			radius/(t)*(i+1)
			new zim.Label((i+1)*numbersFactor, numbersSize, null, zik(numbersColor)).reg(CENTER).rot(-numbersAngle).loc(radius/(t)*(i+1), 0, numbers);
		});
		numbers.rot(numbersAngle);
	}


	if (title) title.pos(0,padding,CENTER,TOP,that);
	if (footer) footer.pos(0, padding/2, CENTER, BOTTOM, that);

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.RadarGraph(data, radius, num, title&&title.clone?title.clone():title, footer&&footer.clone?footer.clone():footer, backgroundColor, color, font, size, circleColor, circleAlpha, circleBorderColor, circleBorderWidth, circleBorderAlpha, circleLastBorderColor, lineThickness, lineColor, shapeColor, shapeAlpha, shapeLineThickness, shapeLineColor, gradients, dotRadius, dotColor, dotBorderColor, dotBorderWidth, showDots, blendmode, numbers, numbersAngle, numbersColor, numbersSize, numbersFactor, padding, labelMargin, style, this.group, inherit));
	};

}
zim.extend(zim.RadarGraph, zim.Container, ["clone"], "zimContainer", true);	

zim.LiveGraph = function(width, height, title, info, data, src, timeStep, thickness, smooth, footer, colors, gradients, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, maxData, fullGradients, animated, style, group, inherit) {

	var sig = "width, height, title, info, data, src, timeStep, thickness, smooth, footer, colors, gradients, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, maxData, fullGradients, animated, style, group, inherit";
	var duo; if (duo = zob(zim.LiveGraph, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("LiveGraph", this.group, inherit);

	if (zot(width)) width = DS.width!=null?DS.width:null;
	if (zot(height)) height = DS.height!=null?DS.height:null;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(info)) info = DS.info!=null?DS.info:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(src)) src = DS.src!=null?DS.src:null;
	if (zot(timeStep)) timeStep = DS.timeStep!=null?DS.timeStep:.5;
	if (zot(thickness)) thickness = DS.thickness!=null?DS.thickness:2;
	if (zot(smooth)) smooth = DS.smooth!=null?DS.smooth:true;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(colors)) colors = DS.colors!=null?DS.colors:zim.series(red, blue, green.darken(.2), purple, orange, pink, grey, brown, salmon, interstellar);
	if (zot(gradients)) gradients = DS.gradients!=null?DS.gradients:true;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:null;
	if (zot(color)) color = DS.color!=null?DS.color:null;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:null;
	if (zot(dataColor)) dataColor = DS.dataColor!=null?DS.dataColor:null;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:null;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:null;
	if (zot(gridThickness)) gridThickness = DS.gridThickness!=null?DS.gridThickness:null;
	if (zot(gridColor)) gridColor = DS.gridColor!=null?DS.gridColor:null;
	if (zot(axisThickness)) axisThickness = DS.axisThickness!=null?DS.axisThickness:null;
	if (zot(axisColor)) axisColor = DS.axisColor!=null?DS.axisColor:null;
	if (zot(decimalsH)) decimalsH = DS.decimalsH!=null?DS.decimalsH:null;
	if (zot(decimalsV)) decimalsV = DS.decimalsV!=null?DS.decimalsV:null;
	if (zot(maxData)) maxData = DS.maxData!=null?DS.maxData:1000;
	if (zot(fullGradients)) fullGradients = DS.fullGradients!=null?DS.fullGradients:true;
	if (zot(animated)) animated = DS.animated!=null?DS.animated:true;


	// TODO Need to ensure info or return or something

	var labelH = info.labelH;
	var labelV = info.labelV;
	var dataH = info.dataH;
	var dataV = info.dataV;

	this.zimGraph_constructor(width, height, title, labelH, labelV, dataH, dataV, footer, backgroundColor, color, font, size, dataColor, dataSize, padding, gridThickness, gridColor, axisThickness, axisColor, decimalsH, decimalsV, style, group, inherit);
	this.type = "LiveGraph";

	var that = this;

	var paused = false;
	var offset = 0;
	
	that.info = info;
	that.data = data;
	that.gradients = gradients;
	that.timeStep = timeStep;

	var w = that.axisH.width;
	var h = that.axisV.width;

	// distance each step of data represents
	var step = that.axisH.width/(Math.abs(info.dataH.start-info.dataH.end)/timeStep);

	var mask = that.mask = new zim.Rectangle(w-1,h-1,clear).loc(that.axisH.x+1, that.axisV.y, that);

	if (gradients) var shapesBack = that.shapesBack = new zim.Container(w, h).reg().loc(that.axisH.x, that.axisV.y, that);
	var shapes = that.shapes = new zim.Container(w, h).reg().loc(that.axisH.x, that.axisV.y, that);
	var colorArray = that.finalColors = [];
	if (data) {				
		zim.loop(data, function(dd) {	
			colorArray.push(zik(colors));
			if (gradients) new zim.Shape(shapes.width, shapes.height).addTo(shapesBack);
			new zim.Shape(shapes.width, shapes.height).addTo(shapes);
		});
	}		


	// ~~~~~~~~~~~~~  DRAW GRAPH  ~~~~~~~~~~~~~~~~

	that.animated = animated;
	that.doDraw = true;

	function drawGraph(data) {	

		if (!that.doDraw) return;

		var hMin = 1000000;
		var hMax = -1000000;
		var hMins = [];
		var hMaxs = [];
		zim.loop(data, function(dd,j) {
			hMins[j] = 1000000;
			hMaxs[j] = -1000000;
			zim.loop(dd.dataH, function(d,i,t) {
				if (d < hMin) hMin = d;
				if (d > hMax) hMax = d;
				if (d < hMins[j]) hMins[j] = d;
				if (d > hMaxs[j]) hMaxs[j] = d;
			});
		});

		var vMin = 1000000;
		var vMax = -1000000;
		var vMins = [];
		var vMaxs = [];
		zim.loop(data, function(dd, j) {
			vMins[j] = 1000000;
			vMaxs[j] = -1000000;
			zim.loop(dd.dataV, function(d,i,t) {
				if (d < vMin) vMin = d;
				if (d > vMax) vMax = d;
				if (d < vMins[j]) vMins[j] = d;
				if (d > vMaxs[j]) vMaxs[j] = d;			
			});				
		});

		// if no axis data then assume 0 - largest value as the range
		if (that.lastDataH == null) {
			that.firstDataH = 0;
			that.lastDataH = hMax;
		}
		if (that.lastDataV == null) {
			that.firstDataV = 0;
			that.lastDataV = vMax;
		}		
		
		if (data) {			
			zim.loop(data, function(dd, j) {
				var color = colorArray[j];					
				var ratioH = w/(that.lastDataH-that.firstDataH);
				var ratioV = h/(that.lastDataV-that.firstDataV);
				var minV = h-(vMins[j]-that.firstDataV)*ratioV; 
				var maxV = h-(vMaxs[j]-that.firstDataV)*ratioV;
				var shapeBack;					
				if (gradients) {
					shapeBack = shapesBack.getChildAt(j).c();
					if (!fullGradients) shapeBack.lf([color.toAlpha(.5), color.toAlpha(0)], [zim.constrain(maxV/shapes.height,0,1), zim.constrain(minV/shapes.height, 0,1)], 0, 0, 0, shapes.height)
					else shapeBack.lf([color.toAlpha(.5), color.toAlpha(0)], [zim.constrain(0,0,1), zim.constrain(shapes.height, 0,1)], 0, 0, 0, shapes.height)
					shapeBack.maxV = maxV; // for later sorting
				}
				var shape = shapes.getChildAt(j).c().s(color).ss(thickness);
				var point; 
				var point2;
				var pointStart;

				zim.loop(dd.dataH, function(d,i,t) {
					point = new zim.Point((d-that.firstDataH)*ratioH, h-(dd.dataV[i]-that.firstDataV)*ratioV);						
					if (i==0) {
						if (gradients) shapeBack.mt(point.x, point.y);
						shape.mt(point.x, point.y);
						pointStart = point.x;
					} else {
						if (smooth && dd.dataH[i+1]) {
							point2 = new zim.Point((dd.dataH[i+1]-that.firstDataH)*ratioH, h-(dd.dataV[i+1]-that.firstDataV)*ratioV);
							var midX = point.x + (point2.x - point.x) / 2;
							var midY = point.y + (point2.y - point.y) / 2;
							if (gradients) shapeBack.qt(point.x, point.y, midX, midY);
							shape.qt(point.x, point.y, midX, midY);
						} else {
							if (gradients) shapeBack.lt(point.x, point.y);
							shape.lt(point.x, point.y);
						}							
					}
				});
				if (gradients) {
					if (!fullGradients) shapeBack.lt(point.x, minV-.5).lt(pointStart, minV-.5).cp();
					else shapeBack.lt(point.x, shapes.height).lt(pointStart, shapes.height).cp();
				}
			});
			if (gradients) shapesBack.sortBy("maxV");
		}
		
		if (that.animated) {
			// shapes.mov(step).animate({x:that.axisH.x-that.offset*step}, timeStep, "linear");
			// if (gradients) shapesBack.mov(step).animate({x:that.axisH.x-that.offset*step}, timeStep, "linear");
			shapes.loc(that.axisH.x-that.offset*step+step).animate({x:that.axisH.x-that.offset*step}, timeStep, "linear");
			if (gradients) shapesBack.loc(that.axisH.x-that.offset*step+step).animate({x:that.axisH.x-that.offset*step}, timeStep, "linear");
		} else {
			shapes.loc(that.axisH.x-that.offset*step);
			if (gradients) shapesBack.loc(that.axisH.x-that.offset*step);
			if (that.stage) that.stage.update(); 
		}

	}
	
	if (!src && data) {
		zim.loop(data, function(d) {
			d.noise = new zim.Noise();
		})
	}
	that.currentData = []; // remembers all data up to maxData (default 1000);
	if (data) {
		zim.loop(data, function(d) {
			that.currentData.push({dataH:[], dataV:[]});
		});
	}

	var count = 0;
	var stepsT = 0;

	// run interval in WebWorker to prevent tabbing to other window stoppage
	var workerCode = "self.onmessage = function(e) {if (e.data === 'start') {setInterval(() => { self.postMessage('tick'); }, "+timeStep*1000+");}};"
	var blob = new document.Blob([workerCode], { type: 'application/javascript' });
	var worker = new Worker(URL.createObjectURL(blob));
	worker.postMessage('start');
	worker.onmessage = doInterval;


	// ~~~~~~~~~~~~~  INTERVAL  ~~~~~~~~~~~~~~~~

	var newData;
	function doInterval() {
		if (!data) return;			
		
		var srcData;
		if (src) {
			// read current data from file and convert lines to array
			srcData = [22,44];
		}
		zim.loop(data, function(d,i) {	
			var cd = that.currentData[i];
			// need to ensure info and info has these				
			if (!src) newData = info.dataV.start + (d.noise.simplex1D(count/(5/timeStep))+1)/2*(info.dataV.end-info.dataV.start);
			else newData = srcData[i];

			var lastData = cd.dataH[0]!=null?cd.dataH[0]:timeStep;
			cd.dataH.unshift(lastData-timeStep);
			cd.dataV.push(newData);
			if (cd.dataH.length > maxData) {
				cd.dataH.shift();
				cd.dataV.shift();
			}
		});
		

		if (!that.paused) {
			var total =  Math.abs(info.dataH.start-info.dataH.end)/timeStep+3;
			var start = Math.max(0, that.currentData[0].dataH.length-total+that.offset);
			var end = start + total;
			var newData = [];
			zim.loop(that.currentData, function(d) {	
				newData.push({dataH:d.dataH.slice(start, end), dataV:d.dataV.slice(start, end)});
			});
			drawGraph(newData);
		} else {
			// reduce time numbers on axis
			stepsT += timeStep;			
			that.offset--;
			if (stepsT >= that.stepH) {
				stepsT = 0;
				if (that.stage) that.stage.update(); 
			}		
		}
		count++;

	}

	Object.defineProperty(that, 'paused', {
		get: function() {				
			return paused;
		},
		set: function(value) {
			if (paused==value) return;
			paused = value;
			if (!value) that.offset = 0;
		}
	});

	Object.defineProperty(that, 'offset', {
		get: function() {				
			return offset;
		},
		set: function(value) {
			if (offset==value) return;
			offset = value;			
			that.offsetH(Math.floor(offset*timeStep) / that.stepH);
			if (!that.paused) {
				shapes.stopAnimate();
				// shapes.x = that.axisH.x; // -offset*step;
				if (gradients) {
					shapesBack.stopAnimate();
					// shapesBack.x = that.axisH.x; // -offset*step;
				}
			}				
			if (that.stage) that.stage.update();				
		}
	});

	that.shapes.setMask(mask)
	if (gradients) that.shapesBack.setMask(mask);

	if (style!==false) zim.styleTransforms(this, DS);

	this.dispose = function(a,b,disposing) {
		if (worker) worker.terminate();
		if (!disposing) this.zimGraph_dispose(true);
		return true;
	};
	
}
zim.extend(zim.LiveGraph, zim.Graph, ["dispose"], "zimGraph");

zim.GrowthChart = function(width, height, title, num, info, data, time, footer, backgroundColor, color, size, iconWidth, dec, spacing, padding, damp, footerAlign, favorRight, style, group, inherit) {

	var sig = "width, height, title, num, info, data, time, footer, backgroundColor, color, size, iconWidth, dec, spacing, padding, damp, footerAlign, favorRight, style, group, inherit";
	var duo; if (duo = zob(zim.GrowthChart, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("GrowthChart",this.group,inherit);

	if (zot(width)) width = DS.width!=null?DS.width:400;
	if (zot(height)) height = DS.height!=null?DS.height:300;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(num)) num = DS.num!=null?DS.num:10;
	if (zot(info)) info = DS.info!=null?DS.info:null;
	if (zot(data)) data = DS.data!=null?DS.data:null;
	if (zot(time)) time = DS.time!=null?DS.time:.5;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:white;
	if (zot(color)) color = DS.color!=null?DS.color:dark;
	if (zot(size)) size = DS.size!=null?DS.size:14;
	if (zot(iconWidth)) iconWidth = DS.iconWidth!=null?DS.iconWidth:50;
	if (zot(dec)) dec = DS.dec!=null?DS.dec:0;	
	if (zot(spacing)) spacing = DS.spacing!=null?DS.spacing:2;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:10;
	if (zot(damp)) damp = DS.damp!=null?DS.damp:.07;
	if (zot(footerAlign)) footerAlign = DS.footerAlign!=null?DS.footerAlign:CENTER;
	if (zot(favorRight)) favorRight = DS.favorRight!=null?DS.favorRight:false;

	if (title && title.type!="Label") title = new zim.Label(title, 30, null, color);
	if (footer && footer.type!="Label") footer = new zim.Label({text:footer, size:20, color:color, italic:true}).sca(.8).alp(.5);

	var finalColors = [];

	if (zot(info)) {
		var colors = series(red,salmon,orange,yellow,green,blue,purple,pink,brown,grey).mix();
		var labels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
		info = [];        
		zim.loop(num+5, function(i) {
			var color = colors().darken(rand(-.1,.3));
			finalColors.push(color);
			info.push({icon:labels[i], name:"Info " + labels[i], backgroundColor:color, color:white});
		});
	} else {
		zim.loop(info, function(o) {
			finalColors.push(o.backgroundColor)
		});
	}
	if (zot(data)) {
		data = []
		var currentYear = new Date().getFullYear();
		zim.loop(50, function(i,t) {
			var temp = [];
			zim.loop(num+5, function(j) {
				if (i==0) temp.push(zim.decimals(zim.rand(50,150,false), dec))
				else temp.push(data[i-1][j]+=zim.odds(5)?zim.rand(-40,60):zim.rand(-1,5))
			});
			data.push(temp);				
		});
		zim.loop(data, function(d,i,t) {
			d.unshift(currentYear-(t-i-1))
		});
	}

	var growth = this.growth = [];
	zim.loop(data, function(d){      
		growth.push(d.shift()); // take the growth value (usually a year) off the front of the data
	});

	this.zimContainer_constructor(width, height);

	var backing = this.backing = new zim.Rectangle({width:width, height:height, color:backgroundColor, group:"chartBacking"}).addTo(this).noMouse();

	if (title) height = height-title.height-padding;
	if (footer) height = height-footer.height-padding;

	var that = this;

	that.data = data;
	that.info = info;
	that.finalColors = finalColors;

	that.type = "GrowthChart";

	var mH = height-padding*2;
	var mask = this.myMask = new zim.Rectangle(width-padding*2, mH, clear).center(this).noMouse();


	if (title) {
		mask.y = padding*2+title.height;
		title.pos(0,padding,CENTER,TOP,that);
	} else {
		mask.y = padding;
	}

	if (footer) {
		var shift = 0;
		if (footerAlign != CENTER) shift = padding;
		footer.pos(shift,padding,footerAlign,BOTTOM,that);
	}

	// base width and height of scaling rectangles
	var w = width-2*padding-iconWidth-spacing;
	var h = (height-2*padding-(num-1)*spacing)/num;

	var tile = this.tile = new zim.Tile(new zim.Container(width-2*padding,h),1,info.length,0,spacing)
		.loc(mask, null, this)
		.setMask(mask);

	var levels = [];
	zim.loop(tile.items, function(item, i) {	
		levels.push(item.y);		
		item.dampWidth = new zim.Damp();
		item.icon = new zim.Rectangle(iconWidth,h,clear).addTo(item);
		if (info[i].icon) {
			if (typeof info[i].icon == "string") {
				new zim.Label({text:info[i].icon, color:info[i].color, size:size, group:"infoicon"}).center(item.icon);
				item.icon.color = info[i].backgroundColor;
			} else {
				info[i].icon.scaleTo(item.icon,100,100).center(item.icon);
			}
		} else {
			item.icon.color = info[i].backgroundColor;
		}
		item.rect = new zim.Rectangle(w,h,info[i].backgroundColor).loc(iconWidth+spacing,0,item);
		item.name = new zim.Label(info[i].name, size, null, info[i].color);
		item.value = new zim.Label(zim.decimals([i].value, dec), size, null, color);
	}, true); // backwards so from bottom up

	var t,m,mL,currentData;
	function setChart(obj) {
		t = 0;
		m = 0;
		mL = 0;
		var index = that.index = obj.count;
		that.growthAmount = that.growth[index];
		zim.loop(data[index], function(d,i) {
			var item = tile.items[i];
			item.value.text = zim.decimals(d, dec);
			if (item.value.width > mL) mL = item.value.width;
			t+=d;
			if (d > m) m = d;
		});		
		zim.loop(data[index], function(d,i) {
			var item = tile.items[i];
			item.value.text = zim.decimals(d, dec);
			item.amount = d;
			item.desiredWidth = d/m*w - spacing*2-mL;
			if (index==0) item.dampWidth = new zim.Damp(item.desiredWidth, damp);
		})
		tile.sortBy("amount");
		tile.loop(function(item, i) {
			item.desiredY = levels[i];
			if (index==0) {
				item.dampY = new zim.Damp(item.desiredY, damp);
			} else if (index==1) {
				item.name.cache();
				item.value.cache({margin:100});
			} else if (index>1) {
				item.name.updateCache();
				item.value.updateCache();
			}
		});			
		currentData = data[index];
		that.dispatchEvent("change");
	}

	this.intervalID = zim.interval(time, setChart, data.length, true, null, null, function() {
		// in callback function when done
		that.timeoutID = zim.timeout(2, function() {zim.Ticker.remove(tickerID)});        
	});

	this.restart = function() {
		zim.Ticker.add(tickerID);
		if (that.intervalID) that.intervalID.clear();
		if (that.timeoutID) that.timeoutID.clear();
		that.intervalID = zim.interval(time, setChart, data.length, true, null, null, function() {
			that.timeoutID = zim.timeout(2, function() {zim.Ticker.remove(tickerID)});        
		});
	}

	var tickerID = zim.Ticker.add(function() {
		if (!currentData) return;
		zim.loop(currentData, function(d, i) {
			var item = tile.items[i];
			item.rect.widthOnly = Math.max(0, item.dampWidth.convert(item.desiredWidth));
			
			if (favorRight)	{ // align at right and move to left of bar hits label		
				item.name.loc(tile.width-item.name.width, (item.height-item.name.height)/2, item);		
				if (item.name.x < item.x + item.value.x + item.value.width + 10) {					
					item.name.x = item.rect.x + item.rect.width-spacing*2-item.name.width;
					if (item.name.color != info[i].color) {
						item.name.color = info[i].color;
						if (item.name.cacheCanvas) item.name.updateCache();
					}		
				} else {					
					if (item.name.color != color) {
						item.name.color = color;
						if (item.name.cacheCanvas) item.name.updateCache();
					}					
				}	
			} else { // put label at inside right of bar and move to outside right if label less than bar width
				item.name.loc(item.rect.x + item.rect.width-spacing*2-item.name.width, (item.height-item.name.height)/2, item);
				if (item.name.width > item.rect.width -20) {
					item.name.loc(tile.width-item.name.width, (item.height-item.name.height)/2, item);	
						if (item.name.color != color) {
							item.name.color = color;
							if (item.name.cacheCanvas) item.name.updateCache();
						}	
				} else {
					if (item.name.color != info[i].color) {
						item.name.color = info[i].color;
						if (item.name.cacheCanvas) item.name.updateCache();
					}	
						
				}
			}
			item.value.loc(item.rect.x + item.rect.width+spacing*2, (item.height-item.value.height)/2, item);
			item.y = item.dampY.convert(item.desiredY);
			item.vis(item.y < mask.height);
		});

	});

	if (style!==false) zim.styleTransforms(this, DS);

	this.dispose = function(a,b,disposing) {
		if (tickerID) zim.Ticker.remove(tickerID);
		if (this.intervalID) this.intervalID.clear();
		if (!disposing) this.zimContainer_dispose(true);
		return true;
	};
	
	this.clone = function() {
		return that.cloneProps(new zim.GrowthChart(width, height, title&&title.clone?title.clone():title, num, info, data, time, footer&&footer.clone?footer.clone():footer, backgroundColor, color, size, iconWidth, dec, spacing, padding, damp, footerAlign, favorRight, style, this.group, inherit));
	};

}
zim.extend(zim.GrowthChart, zim.Container, null, "zimContainer");

zim.GrowthWidget  = function(graph, title, color, backgroundColor, font, size, padding, paddingInside, restart, corner, restartCorner, style, group, inherit) {

	var sig = "graph, title, color, backgroundColor, font, size, padding, paddingInside, restart, corner, restartCorner, style, group, inherit";
	var duo; if (duo = zob(zim.GrowthWidget, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("GrowthWidget",this.group,inherit);

	// style defaults for parameters not explicitly set above
	if (zot(graph)) graph = DS.graph!=null?DS.graph:null;
	if (zot(title)) title = DS.title!=null?DS.title:"GROWTH";
	if (zot(color)) color = DS.color!=null?DS.color:light;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:dark;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:null;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:10;
	if (zot(paddingInside)) paddingInside = DS.paddingInside!=null?DS.paddingInside:10;
	if (zot(restart)) restart = DS.restart!=null?DS.restart:true;
	if (zot(corner)) corner = DS.corner!=null?DS.corner:10;
	if (zot(restartCorner)) restartCorner = DS.restartCorner!=null?DS.restartCorner:0;

	var that = this;

	that.graph = graph;
	var titleText = title;
	if (title.type!="Label") titleText = that.title = new zim.Label({text:title, font:font, size:size, color:color});
	var amountText = that.amount = new zim.Label({align:CENTER, text:"", font:font, size:size, color:backgroundColor, shiftV:2}).reg(CENTER);
	Style.remember("growth");
	STYLE = {Tile:{backgroundColor:series(clear, color), delayPick:true}, backdrop:{corner:corner}, backdropColor:backgroundColor, backgroundPadding:paddingInside, backdropPadding:padding, valign:CENTER, align:CENTER}
	var tile = that.tile = new zim.Tile([titleText, amountText], 1,2, 0,0, true);		
	if (graph) {
		graph.on("change", function() {
			amountText.text = graph.growthAmount;
			if (that.stage) that.stage.update();
		});
	}
	if (restart) {
		STYLE = {shiftV:1, shadowBlur:-1}
		var button = that.restart = new zim.Button({width:220, label:"RESTART", corner:restartCorner, backgroundColor:backgroundColor}).siz(tile.width-20).tap(function() {
			if (graph && graph.restart) graph.restart();
		});
	}
	Style.recall("growth");

	var h = tile.height;
	if (restart) h += padding + button.height;
	this.zimContainer_constructor(tile.width, h);
	tile.addTo(that);
	if (restart) button.pos(0,0,CENTER,BOTTOM,that);

	this.type = "GrowthWidget";

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.GrowthWidget(graph, title&&title.clone?title.clone():title, color, backgroundColor, font, size, padding, paddingInside, restart, corner, restartCorner, style, this.group, inherit));
	};

}
zim.extend(zim.GrowthWidget, zim.Container, null, "zimContainer");

zim.WordCloud = function(width, height, words, max, exclude, include, scaleFix, font, color, backgroundColor, spacing, verticalMix, uppercase, minSize, maxSize, threshold, style, group, inherit) {
	var sig = "width, height, words, max, exclude, include, scaleFix, font, color, backgroundColor, spacing, verticalMix, uppercase, minSize, maxSize, threshold, style, group, inherit";
	var duo; if (duo = zob(zim.WordCloud, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("WordCloud",this.group,inherit);

	if (zot(width)) width = DS.width!=null?DS.width:800;
	if (zot(height)) height = DS.height!=null?DS.height:500;
	if (zot(max)) max = DS.max!=null?DS.max:100;
	if (zot(threshold)) threshold = DS.threshold!=null?DS.threshold:1;
	if (zot(scaleFix)) scaleFix = DS.scaleFix!=null?DS.scaleFix:(width < 400 || height < 400 ? 2 : 1);
	// style defaults for parameters not explicitly set above
	if (zot(words)) words = DS.words!=null?DS.words:null;
	if (zot(exclude)) exclude = DS.exclude!=null?DS.exclude:null;
	if (zot(include)) include = DS.include!=null?DS.include:null;
	// end style defaults
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(color)) color = DS.color!=null?DS.color:[pink, blue, green, yellow, orange, purple, salmon];
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:interstellar;
	if (zot(spacing)) spacing = DS.spacing!=null?DS.spacing:6;
	if (zot(verticalMix)) verticalMix = DS.verticalMix!=null?DS.verticalMix:true;
	if (zot(uppercase)) uppercase = DS.uppercase!=null?DS.uppercase:true;
	if (zot(minSize)) minSize = DS.minSize!=null?DS.minSize:10;
	if (zot(maxSize)) maxSize = DS.maxSize!=null?DS.maxSize:90;

	this.zimContainer_constructor(width, height);

	var that = this;

	function prepareWordData(text, max, threshold, exclude, include) {

		if (zot(max)) max = 100;
		if (zot(threshold)) threshold = 1;

		// common words to ignore
		var stopWords = {
			a: 1, an: 1, the: 1, and: 1, or: 1, but: 1, in: 1, on: 1, at: 1, to: 1,
			for: 1, of: 1, with: 1, by: 1, from: 1, is: 1, was: 1, are: 1, were: 1,
			be: 1, been: 1, being: 1, have: 1, has: 1, had: 1, do: 1, does: 1, did: 1,
			will: 1, would: 1, could: 1, should: 1, may: 1, might: 1, it: 1, its: 1,
			this: 1, that: 1, these: 1, those: 1, i: 1, we: 1, you: 1, he: 1, she: 1,
			they: 1, my: 1, our: 1, your: 1, his: 1, her: 1, their: 1, as: 1, if: 1,
			so: 1, not: 1, no: 1, up: 1, out: 1, about: 1, than: 1, then: 1, also: 1,
			just: 1, can: 1, all: 1, one: 1, more: 1, into: 1, when: 1, what: 1, which: 1
		};

		if (exclude) {
			if (!Array.isArray(exclude)) exclude = [exclude];
			zim.loop(exclude, function(word) {stopWords[word.toLowerCase()] = 1;});
		}

		// strip punctuation, lowercase, split into words
		var raw = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);

		// count frequencies
		var counts = {};
		loop(raw, function(word) {
			if (word.length < 2) return;
			if (stopWords[word.toLowerCase()]) return;
			counts[word] = (counts[word] || 0) + 1;
		});

		// build array and filter by threshold
		var arr = [];
		loop(counts, function(word, count) {
			if (count >= threshold) {
				arr.push({text: word.charAt(0).toUpperCase() + word.slice(1), freq: count});
			}
		});

		if (include) {
			if (!Array.isArray(include)) include = [include];
			arr = arr.concat(include);
		}

		// sort by frequency descending
		arr.sort(function(a, b) {return b.freq - a.freq;});

		// take the lesser of max or however many passed the threshold
		arr = arr.slice(0, max);

		// normalize frequencies to a 2–100 scale so the word cloud
		// always gets well-distributed sizes regardless of raw counts
		var topFreq = arr.length > 0 ? arr[0].freq : 1;
		loop(arr, function(item) {
			item.freq = Math.max(2, Math.round((item.freq / topFreq) * 100));
		});

		return arr;
	}
	that.prepareWordData = prepareWordData;

	if (!Array.isArray(words)) words = prepareWordData(words, max, threshold, exclude, include);

	that.backing = new zim.Rectangle(width, height, backgroundColor).addTo(that);

	var holder;
	if (scaleFix != 1) {
		width *= scaleFix;
		height *= scaleFix;
		holder = new zim.Container(width, height).sca(1 / scaleFix).addTo(that);
	}

	var maxFreq = 0;
	zim.loop(words, function(word) {
		if (word.freq > maxFreq) maxFreq = word.freq;
	});

	var placed = [];

	function collides(r) {
		for (var i = 0; i < placed.length; i++) {
			var p = placed[i];
			if (r.x < p.x + p.w + spacing &&
				r.x + r.w + spacing > p.x &&
				r.y < p.y + p.h + spacing &&
				r.y + r.h + spacing > p.y) {
				return true;
			}
		}
		return false;
	}

	function placeWord(label, isVertical, lw, lh) {
		var fw = isVertical ? lh : lw;
		var fh = isVertical ? lw : lh;
		var padding = 6;
		var maxTries = 8000;
		var cx = width / 2;
		var cy = height / 2;
		var angle = rand(0, Math.PI * 2);
		var step = 0.05;
		var spread = 1.8;
		// aspect stretch — makes the spiral elliptical to match canvas shape
		var aspectX = width >= height ? 1 : width / height;
		var aspectY = height >= width ? 1 : height / width;
		for (var t = 0; t < maxTries; t++) {
			var r = spread * angle;
			var tx = Math.floor(cx + r * Math.cos(angle) * aspectX - fw / 2);
			var ty = Math.floor(cy + r * Math.sin(angle) * aspectY - fh / 2);
			if (tx >= padding && ty >= padding &&
				tx + fw <= width - padding &&
				ty + fh <= height - padding) {
				var candidate = {x: tx, y: ty, w: fw, h: fh};
				if (!collides(candidate)) {
					placed.push(candidate);
					if (isVertical) {
						label.rotation = -90;
						label.x = tx;
						label.y = ty + lw;
					} else {
						label.x = tx;
						label.y = ty;
					}
					return true;
				}
			}
			angle += step;
		}
		return false;
	}

	var sorted = words.slice().sort(function(a, b) {return b.freq - a.freq;});

	zim.loop(sorted, function(word) {
		var size = Math.round(minSize + (word.freq / maxFreq) * (maxSize - minSize));
		var isVertical = verticalMix ? odds(35) : false;
		var label = new zim.Label({
			text: uppercase ? word.text.toUpperCase() : word.text,
			size: size,
			font: font,
			color: zik(color),
			bold: size > 40
		}).addTo(scaleFix != 1 ? holder : that);
		var lw = label.width;
		var lh = label.height;
		var ok = placeWord(label, isVertical, lw, lh);
		if (!ok) {
			label.dispose();
			zogy("ZIM WordCloud - did not fit: " + word.text)
		}
	});

	if (scaleFix != 1) {
		zim.loop(holder, function(obj) {
			obj.addTo(that, 1).sca(1 / scaleFix);
		}, true);
		holder.dispose();
	}

	if (scaleFix != 1) {
		width /= scaleFix;
		height /= scaleFix;
	}
	that.setBounds(0, 0, width, height);
	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function() {
		return that.cloneProps(new zim.WordCloud(width, height, words, max, exclude, include, scaleFix, font, color, backgroundColor, spacing, verticalMix, uppercase, minSize, maxSize, threshold, style, this.group, inherit));
	};

}
zim.extend(zim.WordCloud, zim.Container, null, "zimContainer");

zim.Championship = function(width, title, num, data, textLines, curved, shiftFactor, mirror, lastFlip, lastCenter, lastScale, footer, backgroundColor, color, font, size, align, boxColor, corner, borderColor, borderWidth, dataColor, dataSize, padding, spacingH, spacingV, gapCount, gap, paddingH, paddingV, lineColor, lineThickness, style, group, inherit) {

	var sig = "width, title, num, data, textLines, curved, shiftFactor, mirror, lastFlip, lastCenter, lastScale, footer, backgroundColor, color, font, size, align, boxColor, corner, borderColor, borderWidth, dataColor, dataSize, padding, spacingH, spacingV, gapCount, gap, paddingH, paddingV, lineColor, lineThickness, style, group, inherit";
	var duo; if (duo = zob(zim.Championship, arguments, sig, this)) return duo;

	this.group = group;
	var DS = style===false?group!=null?zim.getStyle(null,null,inherit,this.group):{}:zim.getStyle("Championship",this.group,inherit);

	if (zot(width)) width = DS.width!=null?DS.width:500;
	if (zot(num)) num = DS.num!=null?DS.num:16;
	if (zot(data)) data = DS.data!=null?DS.data:[[]];
	if (zot(textLines) || textLines < 1) textLines = DS.textLines!=null?DS.textLines:1;
	if (zot(title)) title = DS.title!=null?DS.title:null;
	if (zot(footer)) footer = DS.footer!=null?DS.footer:null;
	// style defaults for parameters not explicitly set above
	if (zot(mirror)) mirror = DS.mirror!=null?DS.mirror:null;
	// end style defaults
	if (zot(lastFlip)) lastFlip = DS.lastFlip!=null?DS.lastFlip:false;
	if (zot(shiftFactor)) shiftFactor = DS.shiftFactor!=null?DS.shiftFactor:0;
	if (zot(lastScale)) lastScale = DS.lastScale!=null?DS.lastScale:2;
	if (zot(lastCenter)) lastCenter = DS.lastCenter!=null?DS.lastCenter:true;
	if (zot(color)) color = DS.color!=null?DS.color:dark;
	if (zot(backgroundColor)) backgroundColor = DS.backgroundColor!=null?DS.backgroundColor:lighter;
	if (zot(align)) align = DS.align!=null?DS.align:"left";
	if (zot(boxColor)) boxColor = DS.boxColor!=null?DS.boxColor:white;
	if (zot(borderColor)) borderColor = DS.borderColor!=null?DS.borderColor:color;
	if (zot(corner)) corner = DS.corner!=null?DS.corner:0;
	if (zot(borderWidth)) borderWidth = DS.borderWidth!=null?DS.borderWidth:1;
	if (zot(font)) font = DS.font!=null?DS.font:null;
	if (zot(size)) size = DS.size!=null?DS.size:20;
	if (zot(dataColor)) dataColor = DS.dataColor!=null?DS.dataColor:darker;
	if (zot(dataSize)) dataSize = DS.dataSize!=null?DS.dataSize:14;
	if (zot(padding)) padding = DS.padding!=null?DS.padding:20;
	if (zot(spacingH)) spacingH = DS.spacingH!=null?DS.spacingH:20;
	if (zot(spacingV)) spacingV = DS.spacingV!=null?DS.spacingV:5;
	if (zot(curved) || curved===true) curved = DS.curved!=null?DS.curved:spacingH/2;
	if (zot(gapCount)) gapCount = DS.gapCount!=null?DS.gapCount:4;
	if (zot(gap)) gap = DS.gap!=null?DS.gap:spacingV * 2;
	if (zot(paddingH)) paddingH = DS.paddingH!=null?DS.paddingH:3;
	if (zot(paddingV)) paddingV = DS.paddingV!=null?DS.paddingV:5;
	if (zot(lineColor)) lineColor = DS.lineColor!=null?DS.lineColor:dark;
	if (zot(lineThickness)) lineThickness = DS.lineThickness!=null?DS.lineThickness:1;

	this.numO = num;
	var num = this.num = Math.pow(2, Math.ceil(Math.log2(num)));
	if (num < 2) num = this.num = 2;
	if (num <= 4) lastFlip = false;


	var levels = this.levels = Math.log2(num) + 1;

	var that = this;
	
	var sample;
	if (data && data[0] && data[0][0]) {
		sample = data[0][0];
		if (typeof sample == "string" || typeof sample == "number") {
			sample = new zim.Label(sample, dataSize, font); // will affect series stying - use group champLabel
		} else {
			if (sample.clone) sample = sample.clone();
		}
		if (textLines > 1) {
			var sampleText2 = [];
			zim.loop(textLines, function() {
				sampleText2.push("hey");
			})
			sampleText2 = sampleText2.join("\n");
			var sample2 = new zim.Label(sampleText2, dataSize, font);
			if (sample2.height > sample.height) sample = sample2;
		}
	} else {
		var sampleText = [];
		zim.loop(textLines, function() {
			sampleText.push("hey");
		})
		sampleText = sampleText.join("\n");
		sample = new zim.Label(sampleText, dataSize, font); // will affect series stying - use group champLabel
	}
	that.data = data;		

	var boxW;
	if (sample.type == "Label") boxW = (width - (lastFlip?spacingH:0) - spacingH*(levels-1-(lastFlip?1:0)) - padding*2) / (levels-(lastFlip?1:0));
	else boxW = sample.width+paddingH*2;
	var boxH = sample.height+paddingV*2;

	sample.dispose();
	if (sample2) sample2.dispose();

	var totalGaps = Math.floor((num - 1) / gapCount);
	var height = (2 * padding) + (num * boxH) + ((num - 1) * spacingV) + (totalGaps * gap);	

	function makeBox(obj, theColor) {
		if (zot(obj)) obj = "";
		var box = new zim.Container(boxW, boxH);
		box.backing = new zim.Rectangle({width:boxW, height:boxH, color:theColor, borderColor:borderColor, borderWidth:borderWidth, corner:corner, strokeObj:{ignoreScale:true}, group:"champBox"}).addTo(box);
		// var testobj = makeSyllable(rand(5,15)) + "\n" + makeSyllable(rand(5,15));
		var testObj = "";
		if (typeof obj == "string") {
			box.obj = new zim.Label({text:obj?obj:testObj, color:dataColor, font:font, size:dataSize, group:"champLabel", align:align});					
		} else {
			box.obj = obj;
		}
		box.obj.reg(align).pos((align==LEFT||align==RIGHT)?paddingH:0, 0, align, CENTER, box)
			.setMask(box);

		return box;
	}
	that.makeBox = makeBox;

	if (title && title.type != "Label") title = new zim.Label({text:title, font:font, size:size, color:color, group:'champTitle'});
	if (footer && footer.type != "Label") footer = new zim.Label({text:footer, font:font, size:size, color:color, group:'champFooter'});

	that.title = title;
	that.footer = footer;

	this.zimContainer_constructor(width, height);
	this.type = "Championship";		
	
	that.backgroundColor = backgroundColor;
	var backing = this.backing = new zim.Rectangle({width:width, height:height, color:backgroundColor, group:"chartBacking"}).addTo(this).noMouse();

	// POSITION BOXES (AI)	
	function getBoxYWithGap(r, i) {
	
		function getRound1Y(k) {
			var baseY = k * (boxH + spacingV);
			var totalGapsAbove = Math.floor(k / gapCount) * gap;
			return padding + baseY + totalGapsAbove;
		}

		// 1. Calculate the standard baseline position for the current box
		var boxesPerSubtree = 1 << (r - 1); // Math.pow(2, r-1)
		var firstLeafIndex  = i * boxesPerSubtree;
		var lastLeafIndex   = firstLeafIndex + boxesPerSubtree - 1;

		var yStart    = getRound1Y(firstLeafIndex);
		var yEnd      = getRound1Y(lastLeafIndex);
		var baselineY = (yStart + yEnd) / 2;

		// 2. Determine the effective shift for this box.
		//    When mirror=true, boxes in the bottom half of their round
		//    get a negated shift (they move upward instead of downward).
		//    Total boxes in round r = num / 2^(r-1).
		//    Bottom half starts at index: (num / 2^(r-1)) / 2 = num / 2^r.
		var effectiveShiftFactor = shiftFactor;
		if (mirror) {
			var bottomHalfStart = num / (1 << r); // num / 2^r
			if (i >= bottomHalfStart) {
				effectiveShiftFactor = -shiftFactor;
			}
		}

		var cumulativeShift = (r - 1) * effectiveShiftFactor;
		var shiftedY = baselineY + cumulativeShift;

		// 3. For Round 2+, restrict movement using its specific feeding pair
		if (r > 1) {
			var upperFeederIdx = 2 * i;
			var lowerFeederIdx = (2 * i) + 1;

			var upperFeederTopY = getBoxYWithGap(r - 1, upperFeederIdx, boxH, spacingV, gap, padding, gapCount, shiftFactor, num, mirror, lastCenter);
			var lowerFeederTopY = getBoxYWithGap(r - 1, lowerFeederIdx, boxH, spacingV, gap, padding, gapCount, shiftFactor, num, mirror, lastCenter);

			if (lastCenter && (boxesPerSubtree === num)) {
				return (upperFeederTopY + lowerFeederTopY) / 2;
			}

			// Standard clamp: box top must sit between its two feeders' top edges
			var minAllowedY = Math.min(upperFeederTopY, lowerFeederTopY);
			var maxAllowedY = Math.max(upperFeederTopY, lowerFeederTopY);

			return Math.max(minAllowedY, Math.min(maxAllowedY, shiftedY));
		}

		// Round 1: return natural (or shifted) position directly
		return shiftedY;
	}

	var rounds = that.rounds = [];
	zim.loop(levels, function(r) {
		var lev = levels-r;
		var n = Math.pow(2, lev-1);
		var holder = new zim.Container().loc(0,0,that);
		rounds.push(holder);
		zim.loop(n, function(i) {
			var x = padding+r*(boxW+spacingH);
			if (lastFlip && r==levels-1) x -= boxW + spacingH;
			var y = getBoxYWithGap(r+1, i);
			var text;
			if (data && data[r] && data[r][i]) text = data[r][i];
			makeBox(text, boxColor).loc(x,y,holder);
		});	
	})

	rounds[rounds.length-1].getChildAt(0).reg(RIGHT,CENTER,true).sca(lastScale);

	// DRAW LINES (AI)	
	function drawBracketLines(shape, totalRounds, num, boxW, boxH, colSpacing, spacingV, gap, padding, gapCount, isCurved) {
		// Loop up to totalRounds - 1 because the final round has no next round to connect to

		// --- DRAWING LOGIC ---
		shape.s(lineColor);
		shape.ss(lineThickness); 
		if (!isCurved) isCurved = 0;

		for (var r = 1; r < totalRounds; r++) {
			
			var currentX = (r - 1) * (boxW + colSpacing) + boxW; // Right edge of current box
			var nextX = r * (boxW + colSpacing);                // Left edge of next box
			var halfWayX = currentX + (colSpacing / 2);         // Midpoint between columns
			
			var boxesInRound = num / Math.pow(2, r - 1);
			
			for (var i = 0; i < boxesInRound; i++) {
				var currentY = getBoxYWithGap(r, i, boxH, spacingV, gap, padding, gapCount) + (boxH / 2);
				
				var nextRoundIndex = Math.floor(i / 2);
				var nextY = getBoxYWithGap(r + 1, nextRoundIndex, boxH, spacingV, gap, padding, gapCount) + (boxH / 2);					
								
				// Start at the right-middle edge of the current box
				shape.mt(currentX, currentY);
				
				if (isCurved) {
					
					var defaultRadius = curved;

					// 1. Calculate safe radius so lines don't break if vertical space is tiny
					var verticalDist = Math.abs(nextY - currentY);
					var radius = Math.min(defaultRadius, colSpacing / 2, verticalDist / 2);
					
					// 2. Line straight out toward the first corner intersection point
					shape.lt(halfWayX - radius, currentY);
					
					// 3. First corner: curves from horizontal to vertical at halfWayX
					shape.at(halfWayX, currentY, halfWayX, nextY, radius);
					
					// 4. Line vertically toward the second corner intersection point
					var directionY = nextY > currentY ? 1 : -1;
					shape.lt(halfWayX, nextY - (radius * directionY));
					
					// 5. Second corner: curves from vertical back to horizontal toward nextX
					shape.at(halfWayX, nextY, nextX-(boxesInRound==2&&lastFlip?spacingH:0), nextY, radius);
					
					// 6. Straight final stretch into the next box
					shape.lt(nextX-(boxesInRound==2&&lastFlip?spacingH:0), nextY);			
				
				} else {
					// Traditional sharp square-bracket paths
					
					shape.lt(halfWayX, currentY);
					shape.lt(halfWayX, nextY);
					shape.lt(nextX-(boxesInRound==2&&lastFlip?spacingH:0), nextY);
				}
				
			}
		}
	}

	that.flip = function() {
		that.scaleX *= -1;
		zim.loop(that.rounds, function(round,i2,t2) {
			zim.loop(round, function(item,i,t) {
				item.obj.scaleX *= -1;
				// if (i==t-1 && i2==t2-1 && lastFlip) zogr()
				if (align==LEFT) item.obj.reg(RIGHT).pos(paddingH,0,RIGHT,CENTER);
				// else if (align==RIGHT) item.obj.reg(LEFT).pos(paddingH,0,(i==t-1 && i2==t2-1 && lastFlip)?RIGHT:LEFT,CENTER);
				else if (align==RIGHT) item.obj.reg(LEFT).pos(paddingH,0,LEFT,CENTER);
			});
		});
		return that;
	}

	var shape = that.shape = new zim.Shape(500,500).loc(padding, 0, that, 1);
	drawBracketLines(shape, levels, num, boxW, boxH, spacingH, spacingV, gap, padding, gapCount, curved);
	
	if (title) title.pos(padding,padding,RIGHT,TOP,that);	
	if (footer) footer.pos(padding, padding, RIGHT, BOTTOM, that);		

	this.updateData = function (data, merge, flip) {
		if (zot(data)) return;
		if (zot(merge)) merge = false;
		if (zot(flip)) flip = false;
		if (!Array.isArray(data)) data = [data];
		zogp(flip)

		zim.loop(rounds, function(round, i) {
			round.loop(function(box, j) {
				if (zot(data[i]) || zot(data[i][j])) {
					if (!merge) {
						if (box.obj && box.obj.type=="Label") {
							box.obj.text = "";
						} else {
							if (box.obj && box.obj.dispose) box.obj.dispose();
							box.obj = new zim.Label({text:"", color:dataColor, font:font, size:dataSize, group:"champLabel", align:align}).reg(align);
						}
					}
				} else {
					if (typeof data[i][j] == "string" || typeof data[i][j] == "number") {
						if (box.obj && box.obj.type=="Label") {
							box.obj.text = data[i][j];
						} else {
							if (box.obj && box.obj.dispose) box.obj.dispose();
							box.obj = new zim.Label({text:data[i][j], color:dataColor, font:font, size:dataSize, group:"champLabel", align:align}).reg(align);								
						}
					} else {
						if (box.obj && box.obj.dispose) box.obj.dispose();
						if (data[i][j] instanceof createjs.DisplayObject) {
							box.obj = data[i][j]
						} else {
							box.obj = new zim.Label({text:data[i][j], color:dataColor, font:font, size:dataSize, group:"champLabel", align:align}).reg(align);
						} 
					}						
				}
				if (flip) box.obj.scaleX = -1 * Math.abs(box.obj.scaleX);
				box.obj.pos((align==LEFT||align==RIGHT)?paddingH:0, 0, align, CENTER, box).setMask(box);
			});
		});
		that.data = data;
	}

	this.challenge = function(round, index, fontSize, bColor, fColor, obj1, obj2, extra1, extra2) {
		data = that.data;
		var sig = "round, index, fontSize, bColor, fColor, obj1, obj2, extra1, extra2";
		var duo; if (duo = zob(that.challenge, arguments, sig)) return duo;
		if (zot(bColor)) bColor = color;
		if (zot(fColor)) fColor = zim.toBW(color); 
		if (zot(fontSize)) fontSize = size+5;
		var ob1;
		var ob2;
		if (zot(obj1) && data[round][index] && data[round][index].clone) ob1 = data[round][index].clone();
		else ob1 = data[round][index];
		if (zot(obj2) && data[round][index+1]  && data[round][index+1].clone) ob2 = data[round][index+1].clone();
		else ob2 = data[round][index+1];
		var box1 = obj1?obj1:makeBox(ob1, rounds[round].getChildAt(index).backing.color).reg(CENTER).sca(1.5);
		var box2 = obj2?obj2:makeBox(ob2, rounds[round].getChildAt(index+1).backing.color).reg(CENTER).sca(1.5);
		var vs = new zim.Circle(30, bColor).rot(-20);
		new zim.Label({text:"VS", size:30, font:font, color:fColor, bold:true}).scaleTo(vs,70).centerReg(vs).mov(0,2);
		if (extra1 || extra2) {
			if (typeof extra1 == "string" || typeof extra1 == "number") extra1 = box1.extra = new zim.Label({text:extra1, size:fontSize, font:font, color:color, align:CENTER}).reg(CENTER);
			else if (!extra1 instanceof createjs.DisplayObject) extra1 = null;
			if (typeof extra2 == "string" || typeof extra2 == "number") extra2 = box2.extra = new zim.Label({text:extra2, size:fontSize, font:font, color:color, align:CENTER}).reg(CENTER);
			else if (!extra2 instanceof createjs.DisplayObject) extra2 = null;
			return new zim.Tile({obj:[box1, vs, box2, extra1, null, extra2], cols:3, rows:2, spacingH:15, spacingV:10, unique:true, align:CENTER, valign:CENTER});
		}
		return new zim.Tile({obj:[box1, vs, box2], cols:3, rows:1, spacingH:20, unique:true, valign:CENTER});
	}

	if (style!==false) zim.styleTransforms(this, DS);

	this.clone = function(exact) {
		if (data) {
			zim.loop(data, function(round) {
				zim.loop(round, function(item,i) {
					if (item && item.clone) round[i] = item.clone(exact);
				});
			});
		}
		return that.cloneProps(new zim.Championship(width, title&&title.clone?title.clone():title, num, data, textLines, curved, shiftFactor, mirror, lastFlip, lastCenter, lastScale, footer&&footer.clone?footer.clone():footer, backgroundColor, color, font, size, align, boxColor, corner, borderColor, borderWidth, dataColor, dataSize, padding, spacingH, spacingV, gapCount, gap, paddingH, paddingV, lineColor, lineThickness, style, this.group, inherit));
	};

}
zim.extend(zim.Championship, zim.Container, null, "zimContainer");
        

var WW = window || {};
if (!WW.zns) {
	WW.bestFit = zim.bestFit;
	WW.Graph = zim.Graph;
	WW.Legend = zim.Legend;
	WW.LineGraph = zim.LineGraph;
	WW.LiveGraph = zim.LiveGraph;
	WW.BarGraph = zim.BarGraph;
	WW.PlotGraph = zim.PlotGraph;
	WW.PieChart = zim.PieChart;
	WW.RadarGraph = zim.RadarGraph;
	WW.GrowthChart = zim.GrowthChart;
	WW.GrowthWidget = zim.GrowthWidget;
	WW.WordCloud = zim.WordCloud;
	WW.Championship = zim.Championship;
}

export const bestFit = zim.bestFit;
export const Graph = zim.Graph;
export const Legend = zim.Legend;
export const LineGraph = zim.LineGraph;
export const LiveGraph = zim.LiveGraph;
export const BarGraph = zim.BarGraph;
export const PlotGraph = zim.PlotGraph;
export const PieChart = zim.PieChart;
export const RadarGraph = zim.RadarGraph;
export const GrowthChart = zim.GrowthChart;
export const GrowthWidget = zim.GrowthWidget;
export const WordCloud = zim.WordCloud;
export const Championship = zim.Championship;