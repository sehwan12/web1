var sanitizehtml=require('sanitize-html');
module.exports={
    html:function (title,list,body, control){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        <a href="/author">author</a>
        ${list}
        ${control}
        ${body}
    </body>
    </html>
    `;
    },
    list:function (topics){
    var list='<ul>';
            var i=0;
            while(i < topics.length){
            list=list+`<li><a href="/?id=${topics[i].id}">${sanitizehtml(topics[i].title)}</a></li>`;
            i=i+1;
            }
            list=list+'</ul>';
    return list;
    },
    authorSelect:function(authors,author_id){
        var tag='';
        var i=0;
        while(i<authors.length){
            var selected='';
            if(authors[i].id === author_id){
                selected='selected';
            }
            tag=tag+`<option value="${authors[i].id}"${selected}>${sanitizehtml(authors[i].name)}</option>`
            i++;
        }
        return `
        <select name="author">
              ${tag}
              </select>
        `
    },
    authorTable:function(authors){
        var tag='<table>';
        var i=0;
        while(i<authors.length){
            tag+=`
            <tr>
                <td>${sanitizehtml(authors[i].name)}</td>
                <td>${sanitizehtml(authors[i].profile)}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td><form action="/author/delete_process" method="post" >
                <input type="hidden" name="id" value="${authors[i].id}">
                <input type="submit" value="delete">
                  </form>
                </td>
            </tr>
            `
            i++;
        }
        tag+='</table>'
        return tag;
    } 
}