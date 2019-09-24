
'use strict';

var OFI_2018_OUTLOOK = OFI_2018_OUTLOOK || {};

(function() {

	OFI_2018_OUTLOOK.namespace = function(nsString) {
	    var parts 	= nsString.split( '.' ),
	        parent 	= OFI_2018_OUTLOOK,
	        i;

	    if ( parts[0] === 'OFI_2018_OUTLOOK' ) {
	    	parts = parts.slice(1);
	    }

	    for ( i = 0; i < parts.length; i += 1 ) {
	    	if ( typeof parent[ parts[i] ] === 'undefined' ) {
	        	parent[ parts[i] ] = {};
	      	}
	      	parent = parent[ parts[i] ];
	    }

	    return parent;
	};
})();

//-----------------------------------------------------------------------------------------------