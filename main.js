var http = require('http');
var fs = require('fs');
var qs= require('querystring');
var path=require('path');
var template = require('./lib/template.js');
var sanitizeHtml=require('sanitize-html');


var app = http.createServer(function(request,response){
  var _url = request.url;
  var urlObj = new URL('http://localhost:5000' + _url);
  var queryData=urlObj.searchParams;
  var pathname= urlObj.pathname;
  
  if(pathname ==='/'){
    if(!urlObj.searchParams.has('id')){
      fs.readdir('./data', function(error, filelist){
        var title='Welcome';
        var description='Hello, Node.js';
        var list=template.list(filelist);
        var html=template.html(title, list, `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });

      
      }else{
        fs.readdir('./data', function(error, filelist){
          var filteredId=path.parse(queryData.get('id')).base;
          var list=template.list(filelist);
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.get('id');
            var sanitizedTitle=sanitizeHtml(title);
            var sanitizedDescription=sanitizeHtml(description, {allowedTags:['h1']});
            var html = template.html(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a> 
            <a href="/update?id=${sanitizedTitle}"> update</a>
            <form action="delete_process" method="post" >
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
            </form>`
            );
            response.writeHead(200);
            response.end(html);
      });
    });
  }
    }else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title='WEB - create';
        var list=template.list(filelist);
        var html=template.html(title, list, 
          `
          <form action="/create_process"
          method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description"></textarea></p>
          <p><input type="submit"></p>
          </form>
          `,'');
        response.writeHead(200);
        response.end(html);
      });
    }else if(pathname==='/create_process'){
      var body = '';
      request.on('data', function(data){
        body=body+data;
      });
      request.on('end',function(){
        var post=qs.parse(body);
        var title=post.title;
        var description=post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', 
        function(err){
          response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
          response.end('success');
        })
      });
      
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        var list=template.list(filelist);
        var filteredId=path.parse(queryData.get('id')).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.get('id');
          var html = template.html(title, list, 
            `
          <form action="/update_process"
          method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p><textarea name="description">${description}</textarea></p>
          <p><input type="submit"></p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}"> update</a>`
          );
          response.writeHead(200);
          response.end(html);
    });
  });
    }else if(pathname==='/update_process'){
      var body = '';
      request.on('data', function(data){
        body=body+data;
      });
      request.on('end',function(){
        var post=qs.parse(body);
        var id=post.id;
        var title=post.title;
        var description=post.description;
        fs.rename(`data/${id}`, `data/${title}`,function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', 
          function(err){
            response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
            response.end('success');
          })
        })
      });
    }else if(pathname==='/delete_process'){
      var body = '';
      request.on('data', function(data){
        body=body+data;
      });
      request.on('end',function(){
        var post=qs.parse(body);
        var id=post.id;
        var filteredId=path.parse(queryData.get('id')).base;
        fs.unlink(`data/${filteredId}`, function(eror){
          response.writeHead(302, {Location: encodeURI(`/`)}); //지운 후 홈으로 보냄
          response.end('success');
        })
        
      });
    }
    else{
        response.writeHead(404);
        response.end('Not found');
  }
  
 


  });
app.listen(5000);