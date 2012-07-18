
//Mapping network groups to edge colors:
CytowebUtil._edgeColorMapper = {
		attrName: "networkGroupCode",
		entries: [
	          { attrValue: "coexp"  , value: "#d2c2d5" }, //Co-expression
	          { attrValue: "coloc"  , value: "#a0b3dc" }, //Co-localization
	          { attrValue: "gi"     , value: "#2fb56d" }, //Genetic interactions
	          { attrValue: "path"   , value: "#68bbc1" }, //Pathway
	          { attrValue: "pi"     , value: "#6261fc" }, //Physical interactions
	          { attrValue: "predict", value: "#c3844c" }, //Predicted
	          { attrValue: "spd"    , value: "#84ca6a" }, //Shared protein domains
//	 		      { attrValue: "????"   , value: "#b56371" }, //---RESERVED---
	          { attrValue: "other"  , value: "#de789a" }, //Other
	          { attrValue: "user"   , value: "#d2cd4f" } //User-defined
		]
};

CytowebUtil.DEF_EDGE_OPACITY = 0.85;
CytowebUtil.DEF_HIGHLIGHT_EDGE_OPACITY = 1;
CytowebUtil.DEF_UNHIGHLIGHT_EDGE_OPACITY = 0.15;
CytowebUtil.AUX_EDGE_OPACITY = 0.3;
CytowebUtil.AUX_HIGHLIGHT_EDGE_OPACITY = 0.6;
CytowebUtil.AUX_UNHIGHLIGHT_EDGE_OPACITY = 0.05;
CytowebUtil.DEF_MERGED_EDGE_OPACITY = 0.6;

CytowebUtil.VISUAL_STYLE_OPACITY = {
	defaultValue: CytowebUtil.DEF_EDGE_OPACITY, 
       discreteMapper: {
		   attrName: "networkGroupCode",
		   entries: [
		          { attrValue: "coexp", value: CytowebUtil.AUX_EDGE_OPACITY },
		          { attrValue: "coloc", value: CytowebUtil.AUX_EDGE_OPACITY }
			]
       }
	};

CytowebUtil.VISUAL_STYLE = {
		global: {
			backgroundColor: "#ffffff",
			selectionLineColor: "#717CFF",
			selectionLineOpacity: 1,
			selectionLineWidth: 1,
			selectionFillColor: "#717CFF",
			selectionFillOpacity: 0.05
		},
		nodes: {
			shape: "ELIPSE",
			color: "#fdfdfd",
			opacity: 1,
			size: { defaultValue: 12, continuousMapper: { attrName: "score", minValue: 12, maxValue: 36 } },
			borderColor: "#808080",
			borderWidth: 1,
			label: { passthroughMapper: { attrName: "symbol" } },
			labelFontWeight: "bold",
			labelGlowColor: "#ffffff",
            labelGlowOpacity: 1,
            labelGlowBlur: 2,
            labelGlowStrength: 20,
            labelHorizontalAnchor: "center",
            labelVerticalAnchor: "bottom",
			selectionBorderColor: "#000000",
			selectionBorderWidth: 2,
			selectionGlowColor: "#ffff33",
			selectionGlowOpacity: 0.6,
			hoverBorderColor: "#000000",
			hoverBorderWidth: 2,
			hoverGlowColor: "#aae6ff",
			hoverGlowOpacity: 0.8
		},
		edges: {
			color: {
				defaultValue: "#999999",
		        discreteMapper: CytowebUtil._edgeColorMapper
			},
			width: { defaultValue: 1, continuousMapper: { attrName: "weight", minValue: 2, maxValue: 5 } },
			mergeWidth: { defaultValue: 1, continuousMapper: { attrName: "weight", minValue: 2, maxValue: 5 } },
			opacity: CytowebUtil.VISUAL_STYLE_OPACITY,
			mergeOpacity: CytowebUtil.DEF_MERGED_EDGE_OPACITY,
			curvature: 16,
			selectionGlowColor: "#ffff33",
			selectionGlowOpacity: 0.8
		}
};

CytowebUtil.OPTIONS = {
		layout: { name: "Preset", options: { fitToScreen: false } },
		panZoomControlVisible: true,
		edgesMerged: false,
		nodeLabelsVisible: true,
		edgeLabelsVisible: false,
		nodeTooltipsEnabled: false,
		edgeTooltipsEnabled: false,
		visualStyle: CytowebUtil.VISUAL_STYLE
};

CytowebUtil.SCROLL_DELAY = 500;