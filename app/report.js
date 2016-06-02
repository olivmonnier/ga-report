gapi.analytics.ready(function() {

  /**
   * Authorize the user immediately if the user has already granted access.
   * If no access has been created, render an authorize button inside the
   * element with the ID "embed-api-auth-container".
   */
  gapi.analytics.auth.authorize({
    container: 'embed-api-auth-container',
    clientid: '78021961985-rtqapis46k3ds07o8c1uv2l29pauk66j.apps.googleusercontent.com'
  });

  var DATA = [];

  function renderCharts() {
    DATA.forEach(function(stat, index) {
      viewChartContainer($('#graph'), index, stat);

      if ((index+1) % 2 === 0) $('#graph').append('<div class="clearfix"></div>');
    });
  }

  $(document).ready(function() {
    $(document).on('click', '#formSubmit', function(e) {
      e.preventDefault();

      DATA.push({
        type: $('#type').val(),
        metrics: $('#metrics').val(),
        dimensions: $('#dimensions').val(),
        startDate: $('#startDate').val(),
        endDate: $('#endDate').val(),
        maxResults: $('#maxResults').val(),
        sort: $('#sort').val(),
        filters: $('#filters').val(),
        segment: $('#segment').val()
      });

      $('#graph').empty();
      renderCharts()
    });

    $(document).on('click', '.btn-close', function(e) {
      e.preventDefault();

      var i = $(this).data('view');

      DATA.splice(i, 1);

      $('#graph').empty();
      renderCharts();
    });
  });
});
