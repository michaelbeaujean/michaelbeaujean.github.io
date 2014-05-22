  var dialog = $("#email-form").dialog({
    autoOpen: false,
    height: 540,
    width: 410,
    modal: true,
    buttons: {
      close: function(){
        $( this ).dialog( "close" );
      }
    }
  });

$(document).ready(function(){

var formCode = (function(d, t){
   var g = d.createElement(t),
       s = d.getElementsByTagName(t)[0];
   g.src = "http://www.foxyform.com/js.php?id=558223&sec_hash=e788edf8f93&width=350px";
   s.parentNode.insertBefore(g, s);
}(document, "script"));

  $("#email-form").append(formCode);

  $("#email-link").click(function(){
    $("#email-form").dialog("open");
  });

});
