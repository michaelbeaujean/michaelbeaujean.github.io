OFI_2018_OUTLOOK.namespace( 'controller' );

OFI_2018_OUTLOOK.controller = (function() {

  	var init = function() {
    	var doc = document.documentElement;
    	doc.setAttribute('data-useragent', navigator.userAgent);

    	OFI_2018_OUTLOOK.app.init();
	};

	return {
		init: init
	};

})();

//-----------------------------------------------------------------------------------------------

$(document).ready(function() {
	OFI_2018_OUTLOOK.controller.init();
});