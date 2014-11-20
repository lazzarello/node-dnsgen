var util = require('util');
var sprintf = require("sprintf-js").sprintf;

// put a dot at the end.
function dot (d) {
	if ( !d ) {
		return '';	// ''.split('.') -> [''] one element list -> \\000
    }
	if (d[-1] == '.') {
		return d;
    }
	return d + '.';		// 'domain.com.'.split('.') -> ['domain', 'com', ''] -> \\006domain\\0003com\\000
}

function octal8 (number) {
    if (number > 255) {
        throw (new Error("the number does not fit in a byte, meaning 8 bits, not the company product"));
    }
    
    // format in backslash octal notation for final output
    // booya for sprintf function!
    return sprintf("\\%03o", number); 
}

function octal16 (number) {
    if (number > 255*255) {
        throw (new Error("the number does not fit in a 16 bits word"));
    }

    high = number >> 8;
    low = number & 0xFF;
    return octal8(high) + octal8(low);
}

function str8 (text) {
    l = text.length;
    return octal8(l) + text.replace(':', '\\072');
}

function nstr (text) {
    var octstr = "";
    t = dot(text).split('.');
	for (var p in t) {
        octstr += str8(t[p]);
    }
    return octstr;
}

// an example formatted record will look like this
// :_byte._tcp.foo.bytehub.co:33:\000\012\000\144\300\040\011devhost-1\007bytehub\002co\000:300
// the service is a normal dot seperated domain string, followed by a
// 33, which is the record type code for SRV.
// The octal data comes in 16 bit word pairs and corresponds to
// priority, weight and port.
// The target domain name is a standard domain name with the '.' dot
// characters replaced by an octal length of the string following the
// dot.
// The TTL is an integer.
module.exports.tinysrv function(service,priority,weight,port,target,ttl) {
	service = dot(service);
	return sprintf(":%s:33:%s%s%s%s:%d\n" , service,octal16(priority),octal16(weight),octal16(port),nstr(target),ttl);
}

/**
 * return a serial string
 */
module.exports.serial = function(d) {
  var currentTime = d || new Date(),
      month = currentTime.getMonth() + 1,
      day = currentTime.getDate(),
      year = currentTime.getFullYear(),
      date_fmt = util.format('%s%s%s01',
          (year >= 10)  ? year  : '0' + year,
          (month >= 10) ? month : '0' + month,
          (day >= 10)   ? day   : '0' + day
      );
  return date_fmt;
};
