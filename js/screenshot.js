/**
 * Sceenshot
 * 
 * @author Attila Németh
 * @date 05.04.2021
 */

Drupal.behaviors.screnshot = {
  attach: function (context, settings) {
    var $screenshots = jQuery('div#screenshot');
    if ($screenshots.length === 0) {
      var $screenshot = jQuery('<div />').attr('id', 'screenshot').appendTo('body');
      var $desktopButton = jQuery('<p />').addClass('screenshot-button').appendTo($screenshot).html(Drupal.t('Desktop'));
      $desktopButton.click(() => {
        screenshotCaptureDesktop();
      });
      var $responsiveButton = jQuery('<p />').addClass('screenshot-button').appendTo($screenshot).html(Drupal.t('Responsive'));
      $responsiveButton.click(() => {
        screenshotCaptureResponsive();
      });
      var $preview = jQuery('<div />').addClass('screenshot-preview').appendTo($screenshot);
    }
  }
};

var screenshotCaptureDesktop = function() {
  jQuery('body').beforeScreenshot();
  html2canvas(document.body, {
    windowWidth: 1024,
    windowHeight: 768,
    width: 1024,
    height: 768,
    scrollX: 0,
    scrollY: 0,
    scale: 1
  }).then(canvas => {
    var $preview = jQuery('div#screenshot div.screenshot-preview');
    var image = canvas.toDataURL('image/png', 0.9);
    jQuery('<img />').addClass('screenshot-desktop')
                .attr('src', image)
                .attr('width', 480)
                .attr('height', 320)
                .appendTo($preview);
    jQuery('body').afterScreenshot();
    var $generate = jQuery('<div />').addClass('generate-wrapper').appendTo($preview);
    var $generateButton = jQuery('<p />').addClass('screenshot-button').appendTo($generate).html(Drupal.t('Download'));
    $generateButton.click(() => {
      screenshotGenerate('desktop', {
        desktop: image
      });
    });
  });
};

var screenshotCaptureResponsive = function() {
  jQuery('body').beforeScreenshot();
  var dimensions = {
    desktop: { width: 1024, height: 768 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 }
  };
  for (let key in dimensions) {
    html2canvas(document.body, {
      windowWidth: dimensions[key].width,
      windowHeight: dimensions[key].height,
      width: dimensions[key].width,
      height: dimensions[key].height,
      scrollX: 0,
      scrollY: 0,
      scale: 1
    }).then(canvas => {
      var $preview = jQuery('div#screenshot div.screenshot-preview');
      var image = canvas.toDataURL('image/png', 0.9);
      dimensions[key].image = image;
      jQuery('<img />').addClass('screenshot-' + key)
                  .addClass('screenshot')
                  .attr('src', image)
                  .attr('width', dimensions[key].width / 6)
                  .attr('height', dimensions[key].height / 6)
                  .appendTo($preview);
      if ($preview.find('img.screenshot').length === 3) {
        jQuery('body').afterScreenshot();
        var $generate = jQuery('<div />').addClass('generate-wrapper').appendTo($preview);
        var $generateButton = jQuery('<p />').addClass('screenshot-button').appendTo($generate).html(Drupal.t('Download'));
        $generateButton.click(() => {
          screenshotGenerate('responsive', dimensions);
        });
      }
    });
  }
};

var screenshotGenerate = function(view, data) {
  var path = '/screenshot/generate/' + view;
  jQuery.ajax({
    method: 'POST',
    url: path,
    data: data,
    xhrFields:{
      responseType: 'blob'
    },
    success: (response) => {
      var url = window.URL || window.webkitURL;
      var $link = url.createObjectURL(response);
      var $a = jQuery('<a />');
      $a.attr('download', 'screenshot.png');
      $a.attr('href', $link);
      jQuery('body').append($a);
      $a[0].click();
      jQuery('body').remove($a);
    }
  });
};

var topMargin;
var toolbarFixed;
var toolbarVertical;

jQuery.fn.beforeScreenshot = function() {
  jQuery('div#screenshot div.screenshot-preview img').remove();
  jQuery('div.generate-wrapper').remove();
  jQuery('div#screenshot').hide();
  jQuery('div.contextual').hide();
  jQuery('div#toolbar-administration').hide();
  topMargin = jQuery('body').css('padding-top');
  jQuery('body').css('padding-top', 0);
  if (jQuery('body').hasClass('toolbar-fixed')) {
    toolbarFixed = true;
    jQuery('body').removeClass('toolbar-fixed');
  }
  else {
    toolbarFixed = false;
  }
  if (jQuery('body').hasClass('toolbar-vertical')) {
    toolbarVertical = true;
    jQuery('body').removeClass('toolbar-vertical');
  }
  else {
    toolbarVertical = false;
  }
  jQuery('ul.tabs').hide();
};

jQuery.fn.afterScreenshot = function() {
  jQuery('div#screenshot').show();
  jQuery('div#screenshot').addClass('open');
  jQuery('div.contextual').show();
  jQuery('div#toolbar-administration').show();
  jQuery('body').css('padding-top', topMargin);
  if (toolbarFixed) {
    jQuery('body').addClass('toolbar-fixed');
  }
  if (toolbarVertical) {
    jQuery('body').addClass('toolbar-vertical');
  }
  jQuery('ul.tabs').show();
};

jQuery.fn.afterDownload = function() {
};