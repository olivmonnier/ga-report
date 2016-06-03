if (window.location.hostname == 'localhost') {
    gapi.analytics.ready(function() {
      $('#embed-api-auth-container').empty();
      /**
       * Authorize the user immediately if the user has already granted access.
       * If no access has been created, render an authorize button inside the
       * element with the ID "embed-api-auth-container".
       */
      gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: '78021961985-rtqapis46k3ds07o8c1uv2l29pauk66j.apps.googleusercontent.com'
      });

      startApp();
    });
} else {
  OAuth.initialize('mr4LvKW1k0jEkIcgDmyQlspDni0');
  OAuth.popup('google_analytics').done(function(result) {
    $('#embed-api-auth-container').html('Authentificate');
    // do some stuff with result
    gapi.analytics.ready(function() {
      gapi.analytics.auth.authorize({serverAuth: result});

      startApp();
    });
  });
}

DATA = [];

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};


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

function startApp() {
  $('.view-logged').show();

  $(document).ready(function() {
    DATA = JSON.parse(localStorage.getItem('ga-report'));
    DATA ? renderCharts() : DATA = [];

    $(document).on('click', '.btn-form-toggle', function(e) {
      var $this = $(this);
      $('form').slideToggle('normal', function() {
        var isVisible = $this.find('i').hasClass('glyphicon-chevron-down');
        $this.find('i')
        .removeClass(isVisible ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up')
        .addClass(isVisible ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down');
      });
    });

    $(document).on('click', '#formSubmit', function(e) {
      e.preventDefault();
      var isModal = $(this).closest('.modal-edit').length > 0;

      if (!isModal) {
        DATA.push({
          uid: generateUUID(),
          type: $('#type').val(),
          metrics: $('#metrics').val(),
          dimensions: $('#dimensions').val(),
          startDate: $('#startDate').val(),
          endDate: $('#endDate').val(),
          maxResults: $('#maxResults').val(),
          sort: $('#sort').val(),
          filters: $('#filters').val(),
          segment: $('#segment').val(),
          size: $('#size').val(),
          saved: false
        });
      } else {
        var id = $('.modal-body').data('view');
        var index = _.findIndex(DATA, function(d) { return d.uid == id });
        var dataLocal = JSON.parse(localStorage.getItem('ga-report'));
        var isSaved = _.findIndex(dataLocal, function(d) { return d.uid == id }) >= 0;
        var newData = {
          uid: id,
          type: $('.modal').find('#type').val(),
          metrics: $('.modal').find('#metrics').val(),
          dimensions: $('.modal').find('#dimensions').val(),
          startDate: $('.modal').find('#startDate').val(),
          endDate: $('.modal').find('#endDate').val(),
          maxResults: $('.modal').find('#maxResults').val(),
          sort: $('.modal').find('#sort').val(),
          filters: $('.modal').find('#filters').val(),
          segment: $('.modal').find('#segment').val(),
          size: $('.modal').find('#size').val(),
          saved: isSaved
        }
        DATA[index] = newData;

        if (isSaved) {
          dataLocal[index] = newData;
          localStorage.setItem('ga-report', JSON.stringify(dataLocal));
        }

        $('.modal-edit').modal('hide');
      }

      renderCharts()
    });

    $(document).on('click', '.btn-close', function(e) {
      e.preventDefault();

      var id = $(this).parent().data('view');
      var index = _.findIndex(DATA, function(d) { return d.uid == id });

      DATA.splice(index, 1);

      renderCharts();
    });

    $(document).on('click', '.btn-save', function(e) {
      e.preventDefault();
      var $this = $(this);
      var id = $(this).parent().data('view');
      var index = _.findIndex(DATA, function(d) { return d.uid == id });
      var dataLocal = JSON.parse(localStorage.getItem('ga-report'));

      if (dataLocal == null) dataLocal = [];

      if (!$this.hasClass('saved')) {
        DATA[index].saved = true;
        dataLocal.push(DATA[index]);
        localStorage.setItem('ga-report', JSON.stringify(dataLocal));
      } else {
        DATA[index].saved = false;
        dataLocal.splice(index, 1);
        localStorage.setItem('ga-report', JSON.stringify(dataLocal));
      }
      $this[$this.hasClass('saved') ? 'removeClass' : 'addClass']('saved');
      $this.find('i')
        .removeClass($this.hasClass('saved') ? 'glyphicon-floppy-disk' : 'glyphicon-floppy-saved')
        .addClass($this.hasClass('saved') ? 'glyphicon-floppy-saved' : 'glyphicon-floppy-disk');
    });

    $(document).on('click', '.btn-edit', function(e) {
      e.preventDefault();
      var $this = $(this);
      var id = $(this).parent().data('view');
      var index = _.findIndex(DATA, function(d) { return d.uid == id });
      var stats = DATA[index];
      var formHtml = $('form').html();
      var $modal = $('.modal-edit');

      $modal.find('.modal-body').html(formHtml);
      $('.modal-body').attr('data-view', id);

      for (var i in stats) {
        $modal.find('#' + i).val(stats[i]);
      }

      $modal.modal('show');
    });
  });
}
