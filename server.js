var express = require('express');
var util = require('util');
var pageChatHTML = '<html>' +
    '<head>' +
    '<title>Chat</title>' +
    '<meta charset="utf-8" />' +
    '<script type="text/javascript" src="jquery.min.js"></script>' +
    '<script type="text/javascript" src="client.js"></script>' +
    '</head>' +
    '<body>' +
    '<div>' +
    'Hi %s' +
    '</div><br/>' +
    '<div id="mainDiv" style="width:250px;height:300px;overflow:auto;border: 4px gold groove;padding: 2px;"></div>' +
    '<form id="sendForm">' +
    '<div>' +
    '<label for="text">Message:</label>'+
    '<input id="idInput" type="text" name="text">' +
    '<input type="submit" value="Send">' +
    '</div>' +
    '</form>' +
    '<form method="get" action="logout">' +
    '<div>' +
    '<input type="submit" value="Logout">' +
    '</div>' +
    '</form>' +
    '</body>' +
    '</html>';
var listElementHTML = '<div>' +
    '<b>%s:</b> %s' +
    '</div>';
var app = express(),
MemoryStore = express.session.MemoryStore,
sessionStore = new MemoryStore();
var chatList = [];
var maxId = 0;
app.configure(function () {
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser());
    app.use(express.cookieSession(({ secret : 'secret_key', store: sessionStore })))
});
app.get('/', function (req, res) {
    if(!!req.session && !!req.session.userName) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(util.format(pageChatHTML, req.session.userName));
    }
    else{
        res.redirect("/login.html");
    }
});
app.get('/login', function (req, res) {
    if(!!req.param("nickname"))
    {
        req.session.userName = req.param("nickname");
        res.redirect("/");
    }
    else
    {
        res.redirect("/login.html");
    }
});
app.get('/logout', function (req, res) {
    req.session = null;
    res.redirect("/");
});
app.get('/send', function (req, res) {
    if(!!req.param("text") && !!req.session && !!req.session.userName)
    {
         if(chatList.length >= 20){
             chatList.shift();
         }

        ++maxId;
        chatList[chatList.length] = {"id": maxId, "item": util.format(listElementHTML, req.session.userName, req.param("text"))};
        res.send({'success' : "true"});
    }
    else{
        res.send({'success' : "false"});
    }
});
app.get('/list', function (req, res) {
    var curId = parseInt(req.param('id'), 10);
    var mId = maxId;
    var items ='';
    if(curId >= 0 && curId < mId)
    {
        for (x=0; x<chatList.length; x++) {
            if(chatList[x].id > curId){
                items = items + chatList[x].item;
                mId = chatList[x].id;
            }
        }
    }

    //res.writeHead(200, { 'Content-Type': 'application/json' });
    res.send({'id' : mId, "list" : items});
});
app.listen(3000);
console.log('Listening on port 3000...');
