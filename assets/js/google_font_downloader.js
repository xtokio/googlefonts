$(document).ready(function(){
  
  function validateGoogleFonts(url)
  {
    var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)fonts.googleapis?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
    return regex.test(url);
  }

  var $form = $('.register');

  $form.on('keyup', 'input', function (e) {
    var $this = $(this),
    $input = $this.val();
    if ($input.length > 0) {
      $form.find('label').addClass('active');
      if (validateGoogleFonts($input)) {
        $form.find('button').addClass('active');
        
        if (e.which === 13) {
          $form.find('button').click();
          $this.blur();
        }
      } else {
        $form.find('button').removeClass('active');
      }
      $(this).addClass('active');
    } else {
      $form.find('label').removeClass('active');
      $form.find('button').removeClass('active');
      $(this).removeClass('active');
    }
  });

  $form.on('click', 'button.active', async function (e) {
    e.preventDefault;
    var $this = $(this);
    $("#cssString").text('');

    // Grab html text from url
    var cssText = await (await fetch($form.find('input').val())).text();

    // Get all the fonts
    var fonts_urls = cssText.match(/https:\/\/[^)]+/g);
    fonts_urls.map(function (font_url)
    {
      // Convert all urls to base64
      var font_request = new Request(font_url);
      fetch(font_request).then(response => response.blob()).then(function(font_blob) {
        var reader  = new FileReader(); 
        reader.addEventListener("load", function(){
          // Resultado esta aqui
          cssText = cssText.replace(font_url, reader.result);
          $("#cssString").val(cssText);

          $this.addClass('full');
          $this.html('Thanks!');

          setTimeout(() => {
            $form.find('input').val('').removeClass('active');
            $form.find('label').removeClass('active');
            $this.removeClass('full active');
            $this.html('OK');
          }, 1200);

        }, false);

        reader.readAsDataURL(font_blob);
      });

    });
  });

});