var http = require('http');
//var fs = require('fs');
// var qs= require('querystring');
// var path=require('path');
//var template = require('./lib/template.js');
var url = require('url');
var topic=require('./lib/topic.js');
var author=require('./lib/author');

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
    topic.update_process(request,response);
  }else if(pathname==='/delete_process'){
    topic.delete_process(request,response);
  }else if(pathname === '/author'){
    author.home(request, response);
  }else if(pathname === '/author/create_process'){
    author.create_process(request,response);
  }else if(pathname === '/author/update'){
    author.update(request, response);
  }else if(pathname === '/author/update_process'){
    author.update_process(request,response);
  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(5000);