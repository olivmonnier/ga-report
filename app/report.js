OAuth.initialize('mr4LvKW1k0jEkIcgDmyQlspDni0')
OAuth.popup('google_analytics').done(function(result) {
    // do some stuff with result
    gapi.analytics.ready(function() {

      /**
       * Authorize the user immediately if the user has already granted access.
       * If no access has been created, render an authorize button inside the
       * element with the ID "embed-api-auth-container".
       */
      // gapi.analytics.auth.authorize({
      //   container: 'embed-api-auth-container',
      //   clientid: '78021961985-rtqapis46k3ds07o8c1uv2l29pauk66j.apps.googleusercontent.com'
      // });

      gapi.analytics.auth.authorize({serverAuth: result});

      $('.view-logged').show();

      var DATA = [];

      function renderCharts() {
        var i = 0
        $('#graph').empty();
        DATA.forEach(function(stat, index) {
          i = i + +stat.size;

          if (i > 12) {
            i = 0;
            $('#graph').append('<div class="clearfix"></div>');
          }
          viewChartContainer($('#graph'), index, stat);
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
            segment: $('#segment').val(),
            size: $('#size').val()
          });

          renderCharts()
        });

        $(document).on('click', '.btn-close', function(e) {
          e.preventDefault();

          var i = $(this).data('view');

          DATA.splice(i, 1);

          renderCharts();
        });
      });
    });
});
