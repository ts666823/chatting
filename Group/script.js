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


    function initChatHistory(groupId){
        chat.$chatHistoryList.children().filter('li').remove()
        //查询
        chat.im.history({
            groupId: groupId, //groupId
            lastTimestamp: Date.now(),  //查询发送时间小于（不包含）该时间的历史消息，可用于分页和分批拉取聊天记录，默认为当前时间
            limit: 10, //可选项，返回的消息条数，默认为10条，最多30条
            onSuccess: function (result) {
                //群聊历史消息result示例
                // {
                //     "code": 200,
                //     "content": [
                //     {
                //         "type": "text", "messageId": "8f0e27a0c7e111eab347b726da4416bd",
                //         "senderData":{"avatar":"/www/xxx.png","nickname":"Neo"}, //发送方Data，仅限群消息
                //         "timestamp": 1594958217087, "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
                //         "payload": {"text": "Hello, GoEasyIM"}
                //     },
                //     {
                //         "type": "audio", "messageId": "312c8900c7e211ea9744b7abe1fd7831",
                //         "timestamp": 1594958490234, "senderId": "fdee46b0-4b01-4590-bdba-6586d7617f95",
                //         "senderData":{"avatar":"/www/xxx.png","nickname":"Neo"}, //发送方Data，仅限群消息
                //         "payload": {
                //             "name": "20200717120129175.m4a", "contentType": "audio/m4a",
                //             "url": "https://goeasy-hangzhou.oss-cn-hangzhou.aliyuncs.com/goeasy-im/20200717120129175.m4a",
                //             "duration": 2.46, "size": 15220,
                //         }
                //     },
                //     {
                //         "type": "image", "messageId": "9498cf40c7d711eab228bf40d56471fe",
                //         "timestamp": 1594953936702, "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
                //         "senderData":{"avatar":"/www/xxx.png","nickname":"Neo"}, //发送方Data，仅限群消息
                //         "payload": {
                //             "name": "04531220.jpg", "contentType": "image/jpeg",
                //             "url": "https://goeasy-hangzhou.oss-cn-hangzhou.aliyuncs.com/goeasy-im/04531220.jpg",
                //             "width": 1758, "height": 765, "size": 62988,
                //         }
                //     },
                //     {
                //         "type": "video", "messageId": "373e36c0c7df11eab228bf40d56471fe",
                //         "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649", "timestamp": 1594957262738,
                //         "senderData":{"avatar":"/www/xxx.png","nickname":"Neo"}, //发送方Data，仅限群消息
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
                console.log("Query group chat history successfully, result:\n " + JSON.stringify(result));
                var chatHistoryList = result.content
                console.log("Content:\n " + JSON.stringify(chatHistoryList));
                if(chatHistoryList != null){
                    for (var i = 0; i < chatHistoryList.length; i++){
                        var singleMsg = chatHistoryList[i];
                        var type = singleMsg.type
                        var senderId = singleMsg.senderId
                        var myId = localStorage.getItem("userId")
                        console.log("Single:\n " + JSON.stringify(singleMsg) + "\n My Id:" + myId);
                        if(senderId != myId){
                            if(type == "image"){
                                console("MY Id:" + myId +"\n Sender ID:"+ senderId )
                                var name = singleMsg.senderData.nickname
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var url = singleMsg.payload.url
                                var times = singleMsg.payload.width /200
                                var width = singleMsg.payload.width / times
                                var height = singleMsg.payload.height / times
                                var context = {
                                    name: name,
                                    url:url,
                                    width:width,
                                    height:height,
                                    time: time
                                };
                                chat.renderMessage(1,context,type)
                            }
                            else{
                                var name = singleMsg.senderData.nickname
                                var responese = singleMsg.payload.text
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var context = {
                                    name: name,
                                    response: responese,
                                    time: time
                                };
                                chat.renderMessage(1,context,type)
                            }
                        }
                        else {
                            if(type == "image"){
                                var name = singleMsg.senderData.nickname
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var url = singleMsg.payload.url
                                var times = singleMsg.payload.width /200
                                var width = singleMsg.payload.width / times
                                var height = singleMsg.payload.height / times
                                var context = {
                                    name: name,
                                    url:url,
                                    width:width,
                                    height:height,
                                    time: time
                                };
                                chat.renderMessage(0,context,type)
                            }
                            else{
                                var name = singleMsg.senderData.nickname
                                var responese = singleMsg.payload.text
                                var timeStamp = singleMsg.timestamp
                                var time = new Date(timeStamp).toLocaleString()
                                var context = {
                                    name: name,
                                    response: responese,
                                    time: time
                                };
                                chat.renderMessage(0,context,type)
                            }
                        }
                        console.log(JSON.stringify(singleMsg))
                    }
                }
            },
            onFailed: function (error) { //获取失败
                console.log("Failed to query group message, code:" + error.code + " content:" + error.content);
            },
        });


    }

    var goeasy  = null

    init();

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

        $('#group1').on('click',function () {
           initChatHistory('group001');
            chat.groupId = 'group001';
        })
        $('#group2').on('click',function () {
            initChatHistory('group002');
            chat.groupId = 'group002';
        })
        $('#group3').on('click',function () {
            initChatHistory('group003');
            chat.groupId = 'group003'
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
        groupId: '',
        messageResponses: [
            'Why did the web developer leave the restaurant? Because of the table layout.',
            'How do you comfort a JavaScript bug? You console it.',
            'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
            'What is the most used language in programming? Profanity.',
            'What is the object-oriented way to become wealthy? Inheritance.',
            'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
        ],
        init: function() {
            this.cacheDOM();
            this.bindEvents();
            this.render();
            connectChat();
            this.im = goeasy.im;
            var groupIds = ["group001"];
            this.im.subscribeGroup({
                groupIds:groupIds,
                onSuccess: function () {  //订阅成功
                    console.log("Group message subscribe successfully.");
                },
                onFailed: function (error) { //订阅失败
                    console.log("Failed to subscribe group message, code:" + error.code + " content:" + error.content);
                }
            });
            this.im.on(GoEasy.IM_EVENT.GROUP_MESSAGE_RECEIVED, this.onGroupMessageReceived);
            this.$chatHistoryList.children().filter('li').remove()
        },
        cacheDOM: function() {
            this.$chatHistory = $('.chat-history');
            this.$button = $('button');
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
                var template = Handlebars.compile( $("#message-template").html());
                var context = {
                    name:"me",
                    response: this.messageToSend,
                    time: this.getCurrentTime()
                };
                this.$chatHistoryList.append(template(context));
                this.scrollToBottom();
                this.$textarea.val('');
                // responses
            }
        },
        renderMessage:function (flag,context,type){
            var template
            if(type == "text"){
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
                    type : GoEasy.IM_SCENE.GROUP,   //私聊还是群聊，私聊为GoEasy.IM_SCENE.PRIVATE
                    id : chat.groupId,  //群id
                    data:{"avatar":"https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/chat.png","nickname":"Group001"} ///好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
                }
            });
            //发送消息
            this.im.sendMessage({
                message:textMessage,
                onSuccess: function (message) { //发送成功
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
                    type : GoEasy.IM_SCENE.GROUP,   //私聊还是群聊，私聊为GoEasy.IM_SCENE.PRIVATE
                    id : chat.groupId,  //群id
                    data:{"avatar":"https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/chat.png","nickname":"Group001"} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
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
                    var time = new Date(timeStamp).toLocaleTimeString().
                    replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
                    var template = Handlebars.compile( $("#image-message-template").html())
                    var context = {
                        name: "me",
                        url:url,
                        width:width,
                        height:height,
                        time: time
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
                    var timeStamp = message.timestamp
                    var time = new Date(timeStamp).toLocaleTimeString().
                    replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
                    var templateResponse = Handlebars.compile($("#message-response-template").html());
                    var contextResponse = {
                        name: name,
                        response: responese,
                        time: time
                    };
                }
                else if(type == "image") {
                    var name = this.friendName
                    var timeStamp = message.timestamp
                    var time = new Date(timeStamp).toLocaleTimeString().
                    replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
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
                        time: time
                    };
                }
                chat.im.markGroupMessageAsRead({
                    groupId:'group-001',
                    onSuccess: function () {//标记成功
                        console.log("Marked as read successfully.")
                    },
                    onFailed: function (error) { //标记失败
                        console.log("Failed to mark as read, code:" + error.code + " content:" + error.content);
                    }
                })
                chat.$chatHistoryList.append(templateResponse(contextResponse));
                chat.scrollToBottom();
            }
        },
        onGroupMessageReceived: function(message) {
            //群聊消息message示例
            // {
            //     "messageId": "a5f705e0c7e111eab347b726da4416bd",
            //     "type": "text",
            //     "timestamp": 1594958255483,
            //     "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
            //     "senderData": {"avatar":"/www/xxx.png","nickname":"Neo"}, //发送者Data，仅限群聊消息
            //     "payload": {
            //         "text": "Hello, GoEasyIM"
            //     },
            //     "groupId": "group-a42b-47b2-bb1e-15e0f5f9a19a"
            // }
            var type = message.type
            if(type == "text") {
                var name = this.friendName
                var responese = message.payload.text
                var timeStamp = message.timestamp
                var time = new Date(timeStamp).toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
                var templateResponse = Handlebars.compile($("#message-response-template").html());
                var contextResponse = {
                    name: name,
                    response: responese,
                    time: time
                };
            }
            else if(type == "image") {
                var name = this.friendName
                var timeStamp = message.timestamp
                var time = new Date(timeStamp).toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
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
                    time: time
                };
            }
            chat.$chatHistoryList.append(templateResponse(contextResponse));
            chat.scrollToBottom();
            console.log("received group message:" + JSON.stringify(message));
        },
        addMessage: function() {
            this.messageToSend = this.$textarea.val()
            this.messageToSend = this.messageToSend.replace(/[\r\n]/g,"");
            this.sendMessage2Backend()
            this.render();
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
            return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
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
