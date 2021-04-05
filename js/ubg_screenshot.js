/**
 * UBG Screenshot
 * 
 * Attila Németh, UBG
 * 31.03.2021
 */

Drupal.behaviors.ubgScreenshot = {
  attach: function (context, settings) {
    jQuery('#ubg-screenshot-wrapper').remove();
    var $wrapper = jQuery('<div />').attr('id', 'ubg-screenshot-wrapper');
    var $captureDesktopButton = jQuery('<p />').attr('id', 'ubg-screenshot-capture-desktop')
            .addClass('ubg-screenshot-capture')
            .html('Desktop');
    var $captureResponsiveButton = jQuery('<p />').attr('id', 'ubg-screenshot-capture-responsive')
            .addClass('ubg-screenshot-capture')
            .html('Responsiv');
    $captureDesktopButton.appendTo($wrapper);
    $captureResponsiveButton.appendTo($wrapper);
    $wrapper.appendTo('body');
    $captureDesktopButton.click(() => {
      jQuery('div#admin-menu').hide();
      jQuery('html body.admin-menu').removeClass('admin-menu').addClass('ubg-screenshot-admin-menu');
      $captureDesktopButton.fadeOut(200);
      $captureResponsiveButton.fadeOut(200);
      $wrapper.addClass('processing');
      var $preview = jQuery('<div />')
              .attr('id', 'ubg-screenshot-preview')
              .appendTo($wrapper);
      setTimeout(() => {
        html2canvas(document.body, {
          windowWidth: 1024,
          windowHeight: 768,
          width: 1024,
          height: 768,
          scrollX: 0,
          scrollY: 0,
          scale: 1
        }).then(canvas => {
          var image = canvas.toDataURL('image/png', 0.9);
          jQuery('<img />').addClass('ubg-screenshot-preview-desktop')
                      .attr('src', image)
                      .attr('width', 480)
                      .attr('height', 320)
                      .appendTo($preview);
          $wrapper.removeClass('processing').addClass('processed');
          jQuery('div#admin-menu').show();
          jQuery('html body.admin-menu.ubg-screenshot-admin-menu')
                  .removeClass('ubg-screenshot-admin-menu')
                  .addClass('admin-menu');
          var $generateButton = jQuery('<p />').addClass('ubg-screenshot-generate')
                  .appendTo($preview).html('Herunterladen');
          $generateButton.click(() => {
            ubgScreenshotGenerate('desktop', {
              image: image
            });
            $preview.remove();
            $captureDesktopButton.fadeIn(250);
            $captureResponsiveButton.fadeIn(250);
            $wrapper.removeClass('processed');
          });
        });
      }, 50);
    });
    $captureResponsiveButton.click(() => {
      jQuery('div#admin-menu').hide();
      jQuery('html body.admin-menu').removeClass('admin-menu').addClass('ubg-screenshot-admin-menu');
      $captureDesktopButton.fadeOut(200);
      $captureResponsiveButton.fadeOut(200);
      $wrapper.addClass('processing');
      var $preview = jQuery('<div />')
              .attr('id', 'ubg-screenshot-preview')
              .appendTo($wrapper);
      var dimensions = {
        desktop: { width: 1024, height: 768 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 375, height: 812 },
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
          dimensions[key].image = canvas.toDataURL('image/png', 0.9);
          jQuery('<img />').addClass('ubg-screenshot-preview-' + key)
                    .attr('src', dimensions[key].image)
                    .attr('width', dimensions[key].width / 5)
                    .attr('height', dimensions[key].height / 5)
                    .appendTo($preview);
          if ($preview.find('img').length == 3) {
            $wrapper.removeClass('processing').addClass('processed');
            jQuery('div#admin-menu').show();
            jQuery('html body.admin-menu.ubg-screenshot-admin-menu')
                    .removeClass('ubg-screenshot-admin-menu')
                    .addClass('admin-menu');
            var $generateButton = jQuery('<p />').addClass('ubg-screenshot-generate')
                    .appendTo($preview).html('Herunterladen');
            $generateButton.click(() => {
              ubgScreenshotGenerate('responsive', dimensions);
              $preview.remove();
              $captureDesktopButton.fadeIn(250);
              $captureResponsiveButton.fadeIn(250);
              $wrapper.removeClass('processed');
            });
          }
        });
      }
    });
  }
};

var ubgScreenshotGenerate = function(path, data) {
  var url = '/ubg_screenshot/generate/' + path;
  jQuery.post(url, data, () => {
    document.location.href = '/ubg_screenshot/download';
  });
};