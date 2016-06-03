var chartOptions = {
  PIE: {
    width: '100%',
    pieHole: 4/9
  },
  LINE: {
    width: '100%',
    curveType: 'function',
    legend: { position: 'bottom' }
  },
  COLUMN: {
    width: '100%',
    legend: { position: 'top', maxLines: 3 }
  },
  BAR: {
    width: '100%',
    legend: { position: 'top', maxLines: 3 }
  },
  TABLE: {
    width: '100%'
  },
  GEO: {
    width: '100%'
  }
}

function viewChartContainer($parent, index, data) {
  var icon = data.saved ? 'glyphicon-floppy-saved' : 'glyphicon-floppy-disk';
  var savedClass = data.saved ? 'saved' : '';
  var template = _.template(
    '<div id="view-' + index + '" class="col-md-' + data.size + '">' +
      '<div class="text-right" style="height: 20px;" data-view="' + data.uid + '">' +
        '<button type="button" class="btn-save btn btn-xs ' + savedClass + '"><i class="glyphicon ' + icon + '"></i></button>' +
        '&nbsp;' +
        '<button type="button" class="btn-close close">×</button></div>' +
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
