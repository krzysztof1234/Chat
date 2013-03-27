$(document).ready(function () {
    var myVar = null;
    var maxId = 0;
    var running = true;
    myVar = setTimeout(function () {
        myTimer()
    }, 1000);
    $('#idInput').focus();
    $('body').unload(function () {
        running = false;
        if (myVar) {
            clearInterval(myVar);
            myVar = null;
        }
    });

    function myTimer() {
        myVar = null;
        $.ajax({
            url: '/list',
            dataType: 'json',
            data: {id: maxId},
            cache: false
        }).done(function (data) {
                maxId = data.id;
                if (!!data.list && data.list != '') {
                    $('<div/>', { html: data.list }).appendTo("#mainDiv");
                    $('#mainDiv').stop().animate({ scrollTop: $("#mainDiv")[0].scrollHeight }, 800);
                    //$("#mainDiv").scrollTop = $("#mainDiv")[0].scrollHeight;
                }
                if (running) {
                    myVar = setTimeout(function () {
                        myTimer()
                    }, 1000);
                }
            }).fail(function (err) {
                if (running) {
                    myVar = setTimeout(function () {
                        myTimer()
                    }, 5000);
                }
            });
    }

    $('#sendForm').submit(function () {
        $.ajax({
            url: 'send?' + $(this).serialize(),
            dataType: 'json',
            cache: false
        }).done(function (data) {
                if (myVar) {
                    clearInterval(myVar);
                    myVar = null;
                    myTimer();
                }
            }).fail(function (err) {
                alert(err);
            });
        this.reset();
        $('#idInput').focus();
        return false;
    });
})

