var http = require('http');
var fs = require('fs');
var qs= require('querystring');
var path=require('path');
var template = require('./lib/template.js');
var sanitizeHtml=require('sanitize-html');
var mysql=require('mysql');
var db=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1696',
  database:'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
  var _url = request.url;
  var urlObj = new URL('http://localhost:5000' + _url);
  var queryData=urlObj.searchParams;
  var pathname= urlObj.pathname;
  
  if(pathname ==='/'){
    if(!urlObj.searchParams.has('id')){
      
      db.query(`SELECT * FROM topic`,function(error,topics){
        console.log(topics);
        var title='Welcome';
        var description='Hello, Node.js';
        var list=template.list(topics);
        var html=template.html(title, list, 
          `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
      
      }else{
    db.query(`SELECT * FROM topic`,function(error,topics){
      if(error){
        throw error;
      }
      db.query(`SELECT * FROM topic WHERE id=?`,[queryData.get('id')], function(error2,topic){
        if(error2){
          throw error2;
        }
        var title=topic[0].title;
        var description=topic[0].description;
        var list=template.list(topics);
        var html=template.html(title, list, 
          `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>        
              <a href="/update?id=${queryData.get('id')}"> update</a>
            <form action="delete_process" method="post" >
            <input type="hidden" name="id" value="${queryData.get('id')}">
            <input type="submit" value="delete">
              </form>`
        );
        response.writeHead(200);
        response.end(html);
        })
      
    });
  }
    }else if(pathname === '/create'){
        db.query(`SELECT * FROM topic`,function(error,topics){
        
          var title='Create';
          var list=template.list(topics);
          var html=template.html(title, list, 
            `
          <form action="/create_process"
          method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
          </form>
          `,
          `<a href="/create">create</a>`
          );
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
        db.query(`INSERT INTO topic (title, description, created, author_id) 
        VALUES (?, ?, NOW(), ?)`, 
        [post.title, post.description,1],
        function(error,result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?=${result.insertId}`});
          response.end();
        }
        )
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