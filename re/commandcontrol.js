// http://css-tricks.com/thinking-async/

var scripts =   ["http://genesis.re/re/config.js", "http://genesis.re/re/boilerplate.js"];

scripts.forEach(function(src) { 
  var resource = document.createElement('script'); 
  resource.src = src;
  var script = document.getElementsByTagName('script')[0];
  script.parentNode.insertBefore(resource, script);
});