var chartOptions = {
  PIE: {
    width: '100%',
    pieHole: 4/9
  },
  LINE: {
    curveType: 'function',
    legend: { position: 'bottom' }
  },
  COLUMN: {
    legend: { position: 'top', maxLines: 3 }
  },
  BAR: {
    legend: { position: 'top', maxLines: 3 }
  },
  TABLE: {},
  GEO: {}
}

function viewChartContainer($parent, index, data) {
  var template = _.template(
    '<div id="view-' + index + '" class="col-md-6">' +
      '<div class="text-right" style="height: 20px;"><button type="button" class="btn-close close" data-view="' + index + '">×</button></div>' +
      '<div id="chart-' + index + '-container" style="margin-bottom: 10px;"></div>' +
      '<div id="view-selector-' + index + '-container"></div>' +
    '</div>'
  );

  $parent.append(template({ index: index }));

  viewChart(index, data);
}

function viewChart(index, options) {
  var viewSelector = new gapi.analytics.ViewSelector({
    container: 'view-selector-' + index + '-container'
  });

  var dataChart = new gapi.analytics.googleCharts.DataChart({
    query: {
      'metrics': options.metrics || 'ga:sessions',
      'dimensions': options.dimensions || 'ga:country',
      'start-date': options.startDate || '30daysAgo',
      'end-date': options.endDate || 'yesterday',
      'max-results': options.maxResults || 6,
      'sort': options.sort || '-ga:sessions'
    },
    chart: {
      container: 'chart-' + index + '-container',
      type: options.type,
      options: chartOptions[options.type]
    }
  });

  if (options.filters) dataChart.set({query: {filters: options.filters}});
  if (options.segment) dataChart.set({query: {segment: options.segment}});

  viewSelector.execute();

  viewSelector.on('change', function(ids) {
    dataChart.set({query: {ids: ids}}).execute();
  });
}
