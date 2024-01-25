var http = require('http');
//var fs = require('fs');
// var qs= require('querystring');
// var path=require('path');
// var template = require('./lib/template.js');
var topic=require('./lib/topic.js');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var urlObj = new URL('http://localhost:5000' + _url);
  var pathname= urlObj.pathname;
  
  if(pathname ==='/'){
    if(!urlObj.searchParams.has('id')){
      topic.home(request,response);  
    }else{
      topic.page(request,response);     
    }
  }else if(pathname === '/create'){
    topic.create(request,response);
  }else if(pathname==='/create_process'){
    topic.create_process(request,response);
  }else if(pathname === '/update'){
    topic.update(request,response);  
  }else if(pathname==='/update_process'){
      topic.update_process
  }else if(pathname==='/delete_process'){
    topic.delete_process(request,response);
  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(5000);