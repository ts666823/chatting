(function(){
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


    var myfile = document.getElementById("myfile");
    myfile.onchange = function () {
        console.log(myfile.files);
        var imageFileList = myfile.files;
        for(var i=0;i<imageFileList.length;i++){
            var file = imageFileList[i]
            chat.sendFile2Backend(file)
        }
    }


    var goeasy  = null

    init();

    function transmitMessage(messageContent){
        $('.dialog').css({ "display": "inline" });
        $.ajax({
            url: "http://112.124.59.163:8080/api/v1/chat/friend",
            type: 'Get',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(tokenName, tokenValue);
            },
            success: function (data, status) {
                if (data.code === 200) {
                    console.log(data)
                    var friendsData = data.data
                    this.$friends = $('.dialog');
                    this.$friendsList = this.$friends.find('ul');
                    this.$friendsList.children().filter('li').remove();
                    friendsData.forEach((item)=>{
                        var template = Handlebars.compile($("#transmit-friend-list").html());
                        var context = {
                            avatorImage: item.faceImage,
                            name: item.userName,
                            userId:item.userId,
                        };
                        this.$friendsList.append(template(context));
                        var deleteButton = this.$friendsList.find("button#"+item.userId)
                        deleteButton.on('click', function () {
                            console.log(messageContent)
                            let textMessage = chat.im.createTextMessage({
                                text:messageContent, //消息内容
                                to : {
                                    type : GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
                                    id : item.userId,
                                    data:{"avatar":item.faceImage,"nickname":item.userName} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
                                }
                            });
                            chat.im.sendMessage({
                                message:textMessage,
                                onSuccess: function (message) { //发送成功
                                    console.log("Private message sent successfully.", message);
                                },
                                onFailed: function (error) { //发送失败
                                    console.log('Failed to send private message，code:' + error.code +' ,error ' + error.content);
                                }
                            });
                        });
                    })
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
                $(location).attr("href", '../Chat/index.html')
            }
        })
    }

    function deleteOtherMessage(mesageId,time,name){
        chat.$chatHistoryList.children().filter('li#'+messageId).remove();
        template = Handlebars.compile( $("#recall-message-response-template").html());
        var time = new Date().toLocaleString();
        context={
            name: name,
            time: time,
        }
        chat.$chatHistoryList.append(template(context));
        chat.scrollToBottom();
    }

    function deleteMessage(mesageId,time){
        chat.$chatHistoryList.children().filter('li#'+messageId).remove();
        template = Handlebars.compile( $("#recall-message-template").html());
        context={
            name: "me",
            time: time,
        }
        chat.$chatHistoryList.append(template(context));
        chat.scrollToBottom();
    }

    function recallMessage(messageId){
        chat.$chatHistoryList.children().filter('li#'+messageId).remove();
        template = Handlebars.compile( $("#recall-message-template").html());
        var time = new Date().toLocaleString();
        context={
            name: "me",
            time: time,
        }
        chat.$chatHistoryList.append(template(context));
        chat.scrollToBottom();
        var im = goeasy.im;

        //创建一个自定义的类型为'recall'订单消息
        var recall = {
            messageId:messageId
        };

        var customMessage = im.createCustomMessage({
            type:'recall',  //字符串，可以任意自定义类型
            payload: recall,
            to : {
                type : GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
                id : chat.friendId,
                data:{"avatar":chat.friendImage,"nickname":chat.friendName} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
            }
        });

        //发送消息
        im.sendMessage({
            message:customMessage,
            onSuccess: function (message) {  //发送成功
                console.log('Message sent successfully.',message);
            },
            onFailed: function (error) { //发送失败
                console.log('Failed to send message，code:' + error.code +',error'+error.content);
            }
        })
    }

    $('.dialog .cancel').on('click',function () {
        $('.dialog').css({ "display": "none" })
    })

    function initChatHistory(friendId){
        chat.$chatHistoryList.children().filter('li').remove()
        //var chatHistoryList = chat.getUserChatHistory(userId,friendId)
        chat.im.history({
            userId: friendId,  //对方userId
            lastTimestamp: Date.now(), //查询发送时间小于（不包含）该时间的历史消息，可用于分页和分批拉取聊天记录，默认为当前时间
            limit: 10, //可选项，返回的消息条数，默认为10条，最多30条
            onSuccess: function (result) {
                //单聊历史消息result示例
                // {
                //     "code": 200,
                //     "content": [
                //     {
                //         "type": "text", "messageId": "8f0e27a0c7e111eab347b726da4416bd",
                //         "timestamp": 1594958217087, "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
                //         "payload": {"text": "Hello, GoEasyIM"}
                //     },
                //     {
                //         "type": "audio", "messageId": "312c8900c7e211ea9744b7abe1fd7831",
                //         "timestamp": 1594958490234, "senderId": "fdee46b0-4b01-4590-bdba-6586d7617f95",
                //         "payload": {
                //             "name": "20200717120129175.m4a", "contentType": "audio/m4a",
                //             "url": "https://goeasy-hangzhou.oss-cn-hangzhou.aliyuncs.com/goeasy-im/20200717120129175.m4a",
                //             "duration": 2.46, "size": 15220,
                //         }
                //     },
                //     {
                //         "type": "image", "messageId": "9498cf40c7d711eab228bf40d56471fe",
                //         "timestamp": 1594953936702, "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
                //         "payload": {
                //             "name": "04531220.jpg", "contentType": "image/jpeg",
                //             "url": "https://goeasy-hangzhou.oss-cn-hangzhou.aliyuncs.com/goeasy-im/04531220.jpg",
                //             "width": 1758, "height": 765, "size": 62988,
                //         }
                //     },
                //     {
                //         "type": "video", "messageId": "373e36c0c7df11eab228bf40d56471fe",
                //         "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649", "timestamp": 1594957262738,
                //         "payload": {
                //             "video": {
                //                 "name": "1593738719905558_20200717114010716.mp4", "contentType": "video/mp4",
                //                 "url": "https://goeasy-im.oss-cn-hangzhou.aliyuncs.com/goeasy-im/1593738719905558_20200717114010716.mp4",
                //                 "duration": 46.766667, "width": 544, "height": 960, "size": 7404683
                //             },
                //             "thumbnail": {
                //                 "width": 544, "height": 960, "contentType": "image/jpg",
                //                 "url": "https://goeasy-im.oss-cn-hangzhou.aliyuncs.com/goeasy-im/1593738719905558_20200717114010716.mp4?x-oss-process=video/snapshot,t_0000,f_jpg,w_544,m_fast"
                //             }
                //         },
                //     }
                // ]
                // }
                console.log("Query history successfully, result:\n " + JSON.stringify(result));
                var friendIdStr = friendId.toString()
                var chatHistoryList = result.content
                if(chatHistoryList != null){
                    for (var i = 0; i < chatHistoryList.length; i++){
                        var singleMsg = chatHistoryList[i];
                        var type = singleMsg.type
                        var senderId = singleMsg.senderId
                        console.log(friendId)
                        if(senderId == friendId){
                            if(type == "image"){
                                console.log("ID:"+friendIdStr+" "+senderId)
                                console.log("Type:"+type)
                                var name = chat.friendName
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var url = singleMsg.payload.url
                                var times = singleMsg.payload.width /200
                                var width = singleMsg.payload.width / times
                                var height = singleMsg.payload.height / times
                                var messageId = singleMsg.messageId
                                var context = {
                                    name: name,
                                    url:url,
                                    width:width,
                                    height:height,
                                    time: time,
                                    messageId:messageId
                                };
                                chat.renderMessage(1,context,type)
                            }
                            else if(type == "recall"){
                                var messageId = singleMsg.payload.messageId
                                var name = chat.friendName
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                chat.$chatHistoryList.children().filter('li#'+messageId).remove();
                                var templateResponse = Handlebars.compile( $("#recall-message-response-template").html());
                                var contextResponse={
                                    name: name,
                                    time: time,
                                }
                            }
                            else{
                                console.log("ID:"+friendIdStr+" "+senderId)
                                console.log("Type:"+type)
                                var name = chat.friendName
                                var responese = singleMsg.payload.text
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var messageId = singleMsg.messageId
                                var context = {
                                    name: name,
                                    response: responese,
                                    time: time,
                                    messageId:messageId
                                };
                                chat.renderMessage(1,context,type)
                            }
                        }
                        else if(type == "recall"){
                            var messageId = singleMsg.payload.messageId
                            var name = chat.friendName
                            var timeStamp = singleMsg.timestamp
                            var time = new Date(timeStamp).toLocaleString()
                            chat.$chatHistoryList.children().filter('li#'+messageId).remove();
                            var templateResponse = Handlebars.compile( $("#recall-message-template").html());
                            var contextResponse={
                                name: name,
                                time: time,
                            }
                        }
                        else {
                            if(type == "image"){
                                console.log("ID:"+friendIdStr+" "+senderId)
                                console.log("Type:"+type)
                                var name = "me"
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var url = singleMsg.payload.url
                                var times = singleMsg.payload.width /200
                                var width = singleMsg.payload.width / times
                                var height = singleMsg.payload.height / times
                                var messageId = singleMsg.messageId
                                var context = {
                                    name: name,
                                    url:url,
                                    width:width,
                                    height:height,
                                    time: time,
                                    messageId:messageId
                                };
                                chat.renderMessage(0,context,type)
                            }
                            else{
                                console.log("ID:"+friendIdStr+" "+senderId)
                                console.log("Type:"+type)
                                var name = "me"
                                var responese = singleMsg.payload.text
                                var timeStamp = singleMsg.timestamp
                                var messageId = singleMsg.messageId
                                var time = new Date(timeStamp).toLocaleString()
                                var context = {
                                    name: name,
                                    response: responese,
                                    time: time,
                                    messageId: messageId,
                                };
                                chat.renderMessage(0,context,type)
                            }
                        }
                        console.log(JSON.stringify(singleMsg))
                    }
                }
            },
            onFailed: function (error) { //获取失败
                console.log("Failed to query private message, code:" + error.code + " content:" + error.content);
            },
        });
        // if(chatHistoryList != null) {
        //     for (var i = 0; i < chatHistoryList.length; i++) {
        //         var singleMsg = chatHistoryList[i];
        //         addMessage(singleMsg.msg, singleMsg.flag)
        //     }
        //     chat.scrollToBottom();
        //     chat.$textarea.val('');
        // }
    }

    function init(){
        $.ajax({
            url: "http://112.124.59.163:8080/api/v1/chat/user/getId",
            type: 'Get',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(tokenName, tokenValue);
            },
            success: function (value) {
                if (value.code === 200) {
                    localStorage.setItem("userId",value.data)
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
                $(location).attr("href", '../Login/index.html')
            }
        })
        goeasy = GoEasy.getInstance({
            host:"hangzhou.goeasy.io",  //若是新加坡区域：singapore.goeasy.io
            appkey:"BC-3cf3a0c8e7174231aab24ae08d3669b5",
            modules:['im']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
        });
    }

    function deleteFriend(userId){
        $.ajax({
            url: "http://112.124.59.163:8080/api/v1/chat/friend/deleteFriendRequest/"+userId,
            type: 'Delete',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(tokenName, tokenValue);
            },
            success: function (data) {
                if (data.code === 200) {
                    alert("删除成功")
                    $(location).attr("href", '../Chat/index.html')
                } else {
                    if (data.data === 1) {
                        alert("您还未登陆或登陆状态已经失效");
                    } else {
                        alert("未知错误");
                    }
                    $(location).attr("href", '../Chat/index.html')
                }
            },
            error: function () {
                alert("系统错误");
                $(location).attr("href", '../Chat/index.html')
            }
        })
    }

    listFriend();

    function listFriend() {
        $.ajax({
            url: "http://112.124.59.163:8080/api/v1/chat/friend",
            type: 'Get',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(tokenName, tokenValue);
            },
            success: function (data, status) {
                if (data.code === 200) {
                    console.log(data)
                    var friendsData = data.data
                    this.$friends = $('.people-list');
                    this.$friendsList = this.$friends.find('ul');
                    this.$friendsList.children().filter('li').remove();
                    friendsData.forEach((item)=>{
                        var template = Handlebars.compile($("#friend-list").html());
                        var context = {
                            avatorImage: item.faceImage,
                            name: item.userName,
                            email: item.userEmail,
                            userId:item.userId,
                        };
                        this.$friendsList.append(template(context));
                        var deleteButton = this.$friendsList.find("button#"+item.userId)
                        deleteButton.on('click', function () {
                            var str = $(this).attr("id")
                            console.log(str)
                            deleteFriend(str)
                            $(this).attr("disabled",true)
                            $(this).addClass('-clicked')
                        });
                        var chatBtn = this.$friendsList.find("li#"+item.userId)
                        chatBtn.on('click', function () {
                            this.classList.add()
                            $("img.chatImg").attr("src",item.faceImage)
                            $(".chat-with").text("Chat with " + item.userName)
                            chat.friendId = item.userId
                            chat.friendName = item.userName
                            chat.friendImage = item.faceImage
                            $(".chat").attr("id",item.userId)
                            initChatHistory(item.userId)
                        });
                    })
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
                $(location).attr("href", '../Chat/index.html')
            }
        })
    }

    function connectChat(){
        var id = localStorage.getItem("userId")
        var image = localStorage.getItem("userImage")
        var name = localStorage.getItem("userName")
        goeasy.connect({
            id:id, //pubsub选填，im必填
            data:{"avatar":image,"nickname":name}, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
            onSuccess: function () {  //连接成功
                console.log("GoEasy connect successfully.") //连接成功
            },
            onFailed: function (error) { //连接失败
                console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
            },
            onProgress:function(attempts) { //连接或自动重连中
                console.log("GoEasy is connecting", attempts);
            }
        });
    }

    var chat = {
        friendId: '',
        friendName: '',
        friendImage: '',
        messageToSend: '',
        im: null,
        messageResponses: [
            'Why did the web developer leave the restaurant? Because of the table layout.',
            'How do you comfort a JavaScript bug? You console it.',
            'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
            'What is the most used language in programming? Profanity.',
            'What is the object-oriented way to become wealthy? Inheritance.',
            'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
        ],
        messageId:null,
        init: function() {
            this.cacheDOM();
            this.bindEvents();
            this.render();
            connectChat();
            this.im = goeasy.im;
            this.im.on(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, this.onPrivateMessageReceived)
        },
        cacheDOM: function() {
            this.$chatHistory = $('.chat-history');
            this.$button = $('button.chat');
            this.$textarea = $('#message-to-send');
            this.$chatHistoryList =  this.$chatHistory.find('ul');
        },
        bindEvents: function() {
            this.$button.on('click', this.addMessage.bind(this));
            this.$textarea.on('keyup', this.addMessageEnter.bind(this));
        },
        render: function() {
            this.scrollToBottom();
            if (this.messageToSend.trim() !== '') {
                // var template = Handlebars.compile( $("#message-template").html());
                var context = {
                    name:"me",
                    response: this.messageToSend,
                    time: this.getCurrentTime(),
                    messageId:this.messageId,
                };
                // this.$chatHistoryList.append(template(context));
                // this.scrollToBottom();
                this.renderMessage(0,context,"text")
                this.$textarea.val('');
                // responses
            }
        },
        // flag: 0 表示自己 1表示对方
        renderMessage:function (flag,context,type){
            var template
            if(type == "text"){
                if(flag == 0){
                    template = Handlebars.compile( $("#message-template").html());
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                    var message = chat.$chatHistoryList.find("li#"+context.messageId)
                    var messageContent = message.find(".content").html()
                    var recallBtn = message.find("button.recall")
                    recallBtn.on('click', function () {
                        console.log("recall")
                        recallMessage(context.messageId)
                    });
                    var transmitBtn = message.find('.transmit')
                    transmitBtn.on('click',function (){
                        console.log("transmit"+messageContent)
                        transmitMessage(messageContent)
                    });
                }
                else{
                    template = Handlebars.compile($("#message-response-template").html());
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                    var message = chat.$chatHistoryList.find("li#"+context.messageId)
                    var messageContent = message.find(".content").html()
                    var transmitBtn = message.find('.transmit')
                    transmitBtn.on('click',function (){
                        console.log("transmit"+messageContent)
                        transmitMessage(messageContent)
                    });
                }
            }
            else if(type == "image"){
                if(flag == 0 ){
                    template = Handlebars.compile( $("#image-message-template").html())
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                }
                else{
                    template = Handlebars.compile($("#image-message-response-template").html());
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                }
            }
            else{
                if(flag == 0){
                    template = Handlebars.compile( $("#message-template").html());
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                }
                else{
                    template = Handlebars.compile($("#message-response-template").html());
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                }
            }
        },
        sendMessage2Backend(){
            console.log(chat.friendId)
            //创建消息, 内容最长不超过3K，可以发送字符串，对象和json格式字符串
            let textMessage = this.im.createTextMessage({
                text:this.messageToSend, //消息内容
                to : {
                    type : GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
                    id : chat.friendId,
                    data:{"avatar":chat.friendImage,"nickname":chat.friendName} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
                }
            });
            //发送消息
            this.im.sendMessage({
                message:textMessage,
                onSuccess: function (message) { //发送成功
                    chat.messageId = message.messageId
                    chat.render();
                    console.log("Private message sent successfully.", message);
                },
                onFailed: function (error) { //发送失败
                    console.log('Failed to send private message，code:' + error.code +' ,error ' + error.content);
                }
            });
        },
        sendFile2Backend(myfile){
            //图片消息
            var message = this.im.createImageMessage({
                file:myfile, //H5获得的图片file对象，Uniapp和小程序调用chooseImage，success时得到的res对象
                to : {
                    type : GoEasy.IM_SCENE.PRIVATE,   //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
                    id : chat.friendId,
                    data:{"avatar":chat.friendId,"nickname":chat.friendName} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
                },
                onProgress: function(event) { console.log('file uploading:', event) } //获取上传进度
            });
            this.im.sendMessage({
                message:message,
                onSuccess: function (message) { //发送成功
                    console.log("Private message sent successfully.", message);
                    var url = message.payload.url
                    var times = message.payload.width /200
                    var width = message.payload.width / times
                    var height = message.payload.height / times
                    var timeStamp = message.timestamp
                    var messageId = message.messageId
                    var time = new Date(timeStamp).toLocaleString()
                    var template = Handlebars.compile( $("#image-message-template").html())
                    var context = {
                        name: "me",
                        url:url,
                        width:width,
                        height:height,
                        time: time,
                        message:messageId
                    };
                    chat.$chatHistoryList.append(template(context));
                    chat.scrollToBottom();
                },
                onFailed: function (error) { //发送失败
                    console.log('Failed to send private message，code:' + error.code +' ,error ' + error.content);
                }
            });
        },
        onPrivateMessageReceived:function(message) {
            //文字消息
            // {
            //     "messageId": "8f0e27a0c7e111eab347b726da4416bd",
            //     "timestamp": 1594958217087,
            //     "type": "text",
            //     "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
            //     "payload": {
            //         "text": "Hello, GoEasyIM"
            //     },
            //     "receiverId": "fdee46b0-4b01-4590-bdba-6586d7617f95"
            // }
            console.log("received private message:" + JSON.stringify(message));
            var type = message.type
            var senderId = message.senderId;
            if(senderId == chat.friendId) {
                if(type == "text") {
                    var name = this.friendName
                    var responese = message.payload.text
                    var messageId = message.messageId
                    var timeStamp = message.timestamp
                    var time = new Date(timeStamp).toLocaleString()
                    var templateResponse = Handlebars.compile($("#message-response-template").html());
                    var contextResponse = {
                        name: name,
                        response: responese,
                        time: time,
                        message:messageId,
                    };
                }
                else if(type == "image") {
                    var name = this.friendName
                    var timeStamp = message.timestamp
                    var time = new Date(timeStamp).toLocaleString()
                    var messageId = message.messageId
                    var url = message.payload.url
                    var times = message.payload.width /200
                    var width = message.payload.width / times
                    var height = message.payload.height / times
                    var templateResponse = Handlebars.compile($("#image-message-response-template").html());
                    var contextResponse = {
                        name: name,
                        url:url,
                        width:width,
                        height:height,
                        time: time,
                        messageId:messageId
                    };
                }
                else{
                    var messageId = message.payload.messageId
                    var name = this.friendName
                    var timeStamp = message.timestamp
                    var time = new Date(timeStamp).toLocaleString()
                    chat.$chatHistoryList.children().filter('li#'+messageId).remove();
                    var templateResponse = Handlebars.compile( $("#recall-message-response-template").html());
                    var contextResponse={
                        name: name,
                        time: time,
                    }
                }
                chat.im.markPrivateMessageAsRead({
                    userId:this.friendId,  //聊天对象的userId
                    onSuccess: function () { //标记成功
                        console.log("Marked as read successfully.")
                    },
                    onFailed: function (error) { //标记失败
                        console.log("Failed to mark as read, code:" + error.code + " content:" + error.content);
                    }
                });
                chat.$chatHistoryList.append(templateResponse(contextResponse));
                chat.scrollToBottom();
            }
        },
        addMessage: function() {
            this.messageToSend = this.$textarea.val()
            this.messageToSend = this.messageToSend.replace(/[\r\n]/g,"");
            this.sendMessage2Backend()
        },
        addMessageEnter: function(event) {
            // enter was pressed
            if (event.keyCode === 13) {
                this.addMessage();
            }
        },
        scrollToBottom: function() {
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        },
        getCurrentTime: function() {
            return new Date().toLocaleString()
        },
        getRandomItem: function(arr) {
            return arr[Math.floor(Math.random()*arr.length)];
        }
    };

    chat.init();

    var searchFilter = {
        options: { valueNames: ['name'] },
        init: function() {
            var userList = new List('people-list', this.options);
            var noItems = $('<li id="no-items-found">No items found</li>');

            userList.on('updated', function(list) {
                if (list.matchingItems.length === 0) {
                    $(list.list).append(noItems);
                } else {
                    noItems.detach();
                }
            });
        }
    };

    searchFilter.init();
})();
