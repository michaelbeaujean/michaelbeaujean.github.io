function include(filename, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;
                onload();
            }
        }
        else {
            onload();
        }
    };
    head.appendChild(script);
}

include('http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {

    $(document).ready(function() {
      $("#header").hide(0).delay(100).fadeIn(1000);
      $("#dashboard").hide(0).delay(1000).fadeIn(1000);
      $("#welcome").hide(0).delay(2000).fadeIn(1000);
      $("#contact-me").hide(0).delay(3000).fadeIn(1000);

      $("#about-me").hide();
      $("#portfolio").hide();

      $("#about-me-link").on("click", function(){
        $("#portfolio").fadeOut(500);
        $("#about-me").hide(0).delay(500).fadeIn(1000);
      });

      $("#portfolio-link").on("click", function(){
        $("#about-me").fadeOut(500);
        $("#portfolio").hide(0).delay(500).fadeIn(1000);
      });

    });
});
