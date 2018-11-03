module.exports = {
  table: {
    title: "empty",
    visState: {
      title: "empty",
      type: "table",
      params: {
        perPage: 6,
        showMeticsAtAllLevels: false,
        showPartialRows: false,
        showTotal: true,
        sort: {
          columnIndex: null,
          direction: null
        },
        totalFunc: "sum"
      },
      aggs: [
        {
          id: "1",
          enabled: true,
          type: "count",
          schema: "metric",
          params: {}
        },
        {
          id: "2",
          enabled: true,
          type: "filters",
          schema: "bucket",
          params: {
            filters: []
          }
        }
      ],
      listeners: {}
    },
    uiStateJSON: {
      spy: {
        mode: {
          fill: false,
          name: null
        }
      },
      vis: {
        params: {
          sort: {
            columnIndex: 1,
            direction: "desc"
          }
        }
      }
    },
    description: "",
    version: 1,
    kibanaSavedObjectMeta: {
      searchSourceJSON: {
        index: "logs-inde*",
        query: {
          query_string: {
            analyze_wildcard: true,
            query: ""
          }
        },
        filter: []
      }
    }
  },
  line: {
    title: "empty",
    visState: {
      title: "empty",
      type: "line",
      params: {
        addTooltip: true,
        addLegend: true,
        legendPosition: "right",
        showCircles: true,
        interpolate: "linear",
        scale: "linear",
        drawLinesBetweenPoints: true,
        radiusRatio: 9,
        times: [],
        addTimeMarker: false,
        defaultYExtents: false,
        setYExtents: false
      },
      aggs: [
        {
          id: "1",
          enabled: true,
          type: "count",
          schema: "metric",
          params: {}
        },
        {
          id: "2",
          enabled: true,
          type: "date_histogram",
          schema: "segment",
          params: {
            field: "TimeStamp",
            interval: "auto",
            customInterval: "2h",
            min_doc_count: 1,
            extended_bounds: {}
          }
        },
        {
          id: "3",
          enabled: true,
          type: "filters",
          schema: "group",
          params: {
            filters: []
          }
        }
      ],
      listeners: {}
    },
    uiStateJSON: {},
    description: "",
    version: 1,
    kibanaSavedObjectMeta: {
      searchSourceJSON: {
        index: "logs-inde*",
        query: {
          query_string: {
            analyze_wildcard: true,
            query: ""
          }
        },
        filter: []
      }
    }
  },
  filter: {
    input: {
      query: {
        query_string: {
          query: "",
          analyze_wildcard: true
        }
      }
    },
    label: ""
  },
  dashboard: {
		title: '',
		hits: 0,
		description: '',
    panelsJSON: [
      {
        col: 1,
        id: "AVyJ8syh8P8FYCZv0lMy",
        panelIndex: 1,
        row: 1,
        size_x: 9,
        size_y: 4,
        type: "visualization"
      }, {
        col: 10,
        id: "AVyJ8VrqRA8uSYm68VTi",
        panelIndex: 2,
        row: 1,
        size_x: 3,
        size_y: 4,
        type: "visualization"
      }, {
        col: 1,
        id: "AVyKEuOl7XWZkt2sfjB-",
        panelIndex: 3,
        row: 5,
        size_x: 9,
        size_y: 4,
        type: "visualization"
      }, {
        col: 10,
        id: "AVyKCBe-7XWZkt2sfdSY",
        panelIndex: 4,
        row: 5,
        size_x: 3,
        size_y: 4,
        type: "visualization"
      }, {
        col: 1,
        id: "AVyN3jAB7XWZkt2sqFkl",
        panelIndex: 5,
        row: 9,
        size_x: 9,
        size_y: 4,
        type: "visualization"
      }, {
        col: 10,
        id: "AVyN1yBq8P8FYCZv_Qah",
        panelIndex: 6,
        row: 9,
        size_x: 3,
        size_y: 4,
        type: "visualization"
      }, {
        col: 1,
        id: "AVyN7Ci3RA8uSYm6Hunl",
        panelIndex: 7,
        row: 13,
        size_x: 9,
        size_y: 4,
        type: "visualization"
      }, {
        col: 10,
        id: "AVyN7CizRA8uSYm6Hund",
        panelIndex: 8,
        row: 13,
        size_x: 3,
        size_y: 4,
        type: "visualization"
      }
    ],
		optionsJSON: '{"darkTheme":true}',
		uiStateJSON: '{"P-5":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-6":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-2":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-4":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-8":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}}}',
		version: 1,
		timeRestore: false,
		kibanaSavedObjectMeta: {
			searchSourceJSON: '{"filter":[{"query":{"query_string":{"analyze_wildcard":true,"query":"*"}}}]}'
		}
	},
  histogram: {
		title: "empty",
		visState: {
      title: "empty",
      type: "histogram",
      params: {
        addTooltip: true,
        addLegend: true,
        legendPosition: "right",
        scale: "linear",
        mode: "stacked",
        times: [],
        addTimeMarker: false,
        defaultYExtents: false,
        setYExtents: false
      },
      aggs: [
        {
          id: "1",
          enabled: true,
          type: "count",
          schema: "metric",
          params: {}
        },
        {
          id: "2",
          enabled: true,
          type: "date_histogram",
          schema: "segment",
          params: {
            field: "TimeStamp",
            interval: "auto",
            customInterval: "2h",
            min_doc_count: 1,
            extended_bounds: {}
          }
        },
        {
          id: "3",
          enabled: true,
          type: "range",
          schema: "group",
          params: {
            field: "Measurement",
            ranges: [],
            customLabel: "Measurement (ms)"
          }
        }
      ],
      listeners: {}
    },
		uiStateJSON: {
      vis: {
        colors: {
          "empty": "empty"
        }
      }
    },
		description: "",
		version: 1,
		kibanaSavedObjectMeta: {
			searchSourceJSON: {
        index: "logs-inde*",
        query: {
          query_string: {
            query: "query",
            analyze_wildcard: true
          }
        },
        filter: []
      }
		}
	},
  dashboardState: {
		title: '',
		hits: 0,
		description: '',
		panelsJSON: [{"size_x":12,"size_y":6,"panelIndex":1,"type":"visualization","id":"AVyf3E0wRA8uSYm6nluV","col":1,"row":1},{"size_x":9,"size_y":3,"panelIndex":2,"type":"visualization","id":"AVyf3E2CgHPW6aSVnNyI","col":1,"row":7},{"size_x":3,"size_y":3,"panelIndex":3,"type":"visualization","id":"AVyf3E3MRA8uSYm6nluh","col":10,"row":7},{"size_x":9,"size_y":3,"panelIndex":4,"type":"visualization","id":"AVyf3E4ZRA8uSYm6nlui","col":1,"row":10},{"size_x":3,"size_y":3,"panelIndex":5,"type":"visualization","id":"AVyf3E6EgHPW6aSVnNyM","col":10,"row":10},{"size_x":9,"size_y":3,"panelIndex":6,"type":"visualization","id":"AVyf3E7PgHPW6aSVnNyN","col":1,"row":13},{"size_x":3,"size_y":3,"panelIndex":7,"type":"visualization","id":"AVyf3E8dRA8uSYm6nluj","col":10,"row":13},{"size_x":9,"size_y":3,"panelIndex":8,"type":"visualization","id":"AVyf3E9ogHPW6aSVnNyO","col":1,"row":16},{"size_x":3,"size_y":3,"panelIndex":9,"type":"visualization","id":"AVyf3E-yRA8uSYm6nluk","col":10,"row":16},{"size_x":9,"size_y":3,"panelIndex":10,"type":"visualization","id":"AVyf3E_7gHPW6aSVnNyP","col":1,"row":19},{"size_x":3,"size_y":3,"panelIndex":11,"type":"visualization","id":"AVyf3FBIgHPW6aSVnNyQ","col":10,"row":19},{"size_x":9,"size_y":3,"panelIndex":12,"type":"visualization","id":"AVyf3FCTgHPW6aSVnNyR","col":1,"row":22},{"size_x":3,"size_y":3,"panelIndex":13,"type":"visualization","id":"AVyf3FDeRA8uSYm6nlum","col":10,"row":22},{"size_x":9,"size_y":3,"panelIndex":14,"type":"visualization","id":"AVyf3FFGRA8uSYm6nlun","col":1,"row":25},{"size_x":3,"size_y":3,"panelIndex":15,"type":"visualization","id":"AVyf3FGfRA8uSYm6nluo","col":10,"row":25},{"size_x":9,"size_y":3,"panelIndex":16,"type":"visualization","id":"AVyf3FH8gHPW6aSVnNyV","col":1,"row":28},{"size_x":3,"size_y":3,"panelIndex":17,"type":"visualization","id":"AVyf3FJHgHPW6aSVnNyW","col":10,"row":28},{"size_x":9,"size_y":3,"panelIndex":18,"type":"visualization","id":"AVyf3FKQRA8uSYm6nluq","col":1,"row":31},{"size_x":3,"size_y":3,"panelIndex":19,"type":"visualization","id":"AVyf3FLdgHPW6aSVnNyX","col":10,"row":31}],
		optionsJSON: '{"darkTheme":true}',
		uiStateJSON: '{"P-1":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-3":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-5":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-7":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-9":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-11":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-13":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-15":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-17":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-19":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}}}',
		version: 1,
		timeRestore: false,
		kibanaSavedObjectMeta: {
			searchSourceJSON: '{"filter":[{"query":{"query_string":{"query":"*","analyze_wildcard":true}}}]}'
		}
	},
  dashboardStateDevices: {
		title: 'genstate0Devices',
		hits: 0,
		description: '',
		panelsJSON: [{"size_x":3,"size_y":7,"panelIndex":1,"type":"visualization","id":"AVygeksvgHPW6aSVoXTc","col":1,"row":1},{"size_x":5,"size_y":7,"panelIndex":2,"type":"visualization","id":"AVygekt_8P8FYCZvf2YK","col":4,"row":1},{"size_x":4,"size_y":3,"panelIndex":3,"type":"visualization","id":"AVygekvJ8P8FYCZvf2YL","col":9,"row":1},{"size_x":4,"size_y":4,"panelIndex":4,"type":"visualization","id":"AVygekwWRA8uSYm6nwYk","col":9,"row":4}],
		optionsJSON: '{"darkTheme":true}',
		uiStateJSON: '{"P-1":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-2":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-3":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}},"P-4":{"vis":{"params":{"sort":{"columnIndex":1,"direction":"desc"}}}}}',
		version: 1,
		timeRestore: false,
		kibanaSavedObjectMeta: {
			searchSourceJSON: '{"filter":[{"query":{"query_string":{"query":"*","analyze_wildcard":true}}}]}'
		}
	}
};