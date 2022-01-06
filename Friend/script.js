var tokenName = localStorage.getItem('tokenName');
var tokenValue = localStorage.getItem('tokenValue');

$('#homePage').on('click',function () {
    $(location).attr("href",'../Home/index.html')
})

$('#friendPage').on('click',function () {
    $(location).attr("href",'../Friend/index.html')
})

$('#chatPage').on('click',function () {
    $(location).attr("href",'../Chat/index.html')
})

$('#groupPage').on('click',function () {
    $(location).attr("href",'../Group/index.html')
})


$('#searchNewFriend').on('click',function () {
    var userNickName = $('#newFriendNickName').val();
    $.ajax({
        url: "http://112.124.59.163:8080/api/v1/chat/friend/searchFriend/"+userNickName,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(tokenName, tokenValue);
        },
        success: function (data, status) {
            if(data.code === 200){
                var users = data.data
                listNewFriend(users)
            }
            else{
                if(data.data === 1){
                    alert("您还未登陆或登陆状态已经失效");
                }
                else{
                    alert("未知错误");
                }
                $(location).attr("href",'../Login/index.html')
            }
        },
        error : function() {
            alert("系统错误");
            $(location).attr("href",'../Friend/index.html')
        }
    });
})

function listNewFriend(users){
    this.$friends = $('.friend-list');
    this.$friendsList = this.$friends.find('ul');
    this.$friendsList.children().filter('li').remove();
    $('.friend .header .card-amount').text(users.length)
    users.forEach((item)=>{
        var template = Handlebars.compile($("#newFriend-template").html());
        var context = {
            avatorImage: item.faceImage,
            name: item.userName,
            email:item.userEmail,
            userId:item.userId,
        };
        this.$friendsList.append(template(context));
        var button = this.$friendsList.find('#'+ item.userId)
        button.on('click', function () {
            addFriendRequest($(this).attr("id"))
            $(this).attr("disabled",true)
            $(this).addClass('-clicked')
        });
    })
}

listNewRequest();

function listNewRequest(){
    $.ajax({
        url: "http://112.124.59.163:8080/api/v1/chat/friend/getFriendRequest",
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(tokenName, tokenValue);
        },
        success: function (data, status) {
            if(data.code === 200){
                var requestsData = data.data
                this.$requests = $('.people-list');
                this.$requestsList = this.$requests.find('ul');
                this.$requestsList.children().filter('li').remove();
                requestsData.forEach((item)=>{
                    console.log(item)
                    var template = Handlebars.compile($("#FriendRequest-template").html());
                    var accpet = "accpet"+item.senderId;
                    var refuse = "refuse"+item.senderId;
                    var context = {
                        avatorImage: item.avatorImage,
                        name: item.userName,
                        time: item.requestTime,
                        accpetId:accpet,
                        refuseId:refuse,
                    };
                    this.$requestsList.append(template(context));
                    var acceptButton = this.$requestsList.find("#"+accpet)
                    var refuseButton = this.$requestsList.find("#"+refuse)
                    acceptButton.on('click', function () {
                        var str = $(this).attr("id").slice(6)
                        console.log(str)
                        acceptRequest(str)
                        $(refuseButton).attr("disabled",true)
                        $(refuseButton).addClass('-clicked')
                        $(this).attr("disabled",true)
                        $(this).addClass('-clicked')
                    });
                    refuseButton.on('click', function () {
                        var str = $(this).attr("id").slice(6)
                        console.log(str)
                        refuseRequest(str)
                        $(acceptButton).attr("disabled",true)
                        $(acceptButton).addClass('-clicked')
                        $(this).attr("disabled",true)
                        $(this).addClass('-clicked')
                    });
                })
            }
            else{
                if(data.data === 1){
                    alert("您还未登陆或登陆状态已经失效");
                }
                else{
                    alert("未知错误");
                }
                $(location).attr("href",'../Login/index.html')
            }
        },
        error : function() {
            alert("系统错误");
            $(location).attr("href",'../Friend/index.html')
        }
    });
}

function acceptRequest(senderId){
    $.ajax({
        url: "http://112.124.59.163:8080/api/v1/chat/friend/acceptFriendRequest/"+senderId,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(tokenName, tokenValue);
        },
        success: function (data, status) {
            if (data.code === 200) {
                alert("添加成功")
                $(location).attr("href", '../Friend/index.html')
            } else {
                if (data.data === 1) {
                    alert("您还未登陆或登陆状态已经失效");
                } else {
                    alert("未知错误");
                }
                $(location).attr("href", '../Login/index.html')
            }
        },
        error: function () {
            alert("系统错误");
            $(location).attr("href", '../Friend/index.html')
        }
    })
}

function refuseRequest(senderId){
    $.ajax({
        url: "http://112.124.59.163:8080/api/v1/chat/friend/refuseFriendRequest/"+senderId,
        type: 'Get',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(tokenName, tokenValue);
        },
        success: function (data, status) {
            if (data.code === 200) {
                alert("拒绝成功")
                $(location).attr("href", '../Friend/index.html')
            } else {
                if (data.data === 1) {
                    alert("您还未登陆或登陆状态已经失效");
                } else {
                    alert("未知错误");
                }
                $(location).attr("href", '../Login/index.html')
            }
        },
        error: function () {
            alert("系统错误");
            $(location).attr("href", '../Friend/index.html')
        }
    })
}


function addFriendRequest(userId){
    console.log(userId)
    $.ajax({
        async: true,
        type: "POST",
        url: "http://112.124.59.163:8080/api/v1/chat/friend/addFriendRequest",
        contentType: 'application/json;charset=UTF-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(tokenName, tokenValue);
        },
        data: JSON.stringify({
            "userIdStr": userId,
        }),
        success: function(data, status) {
            console.log(data)
            if(data.code === 200){
                alert("发起添加好友申请成功")
                $(location).attr("href", '../Friend/index.html')
            }
            else {
                if (data.data === 1) {
                    alert("您还未登陆或登陆状态已经失效");
                } else {
                    alert("未知错误");
                }
            }
        },
        error : function() {
            alert("系统错误");
            $(location).attr("href",'../Friend/index.html')
        }
    });
}


