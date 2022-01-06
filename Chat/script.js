(function() {
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
    }

    // 渲染聊天快照
    function loadingChatSnapShot(){
        var userId = Number(localStorage.getItem("userId"))
        var chatSnapShotList = chat.getUserChatSnapShot(userId)
    }

    listFriend();

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
                            $(".chat").attr("id",item.userId)
                            initChatHistory(Number(localStorage.getItem("userId")),item.userId)
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


    function initChatHistory(userId,friendId){
        chat.$chatHistoryList.children().filter('li').remove()
        var chatHistoryList = chat.getUserChatHistory(userId,friendId)
        if(chatHistoryList != null) {
            for (var i = 0; i < chatHistoryList.length; i++) {
                var singleMsg = chatHistoryList[i];
                addMessage(singleMsg.msg, singleMsg.flag)
            }
            chat.scrollToBottom();
            chat.$textarea.val('');
        }
    }

    // 1 表示发送 2表示接受
    function addMessage(msg,flag){
        var templateSend = Handlebars.compile($("#message-template").html());
        var templateResponse = Handlebars.compile($("#message-response-template").html());
        var contextResponse = {
            name:"me",
            response: msg,
            time: chat.getCurrentTime()
        };
        var contextResponse4Friend = {
            name:chat.friendName,
            response: msg,
            time: chat.getCurrentTime()
        };
        if (flag == 1) {
            chat.$chatHistoryList.append(templateSend(contextResponse));
        }
        else{
            chat.$chatHistoryList.append(templateResponse(contextResponse4Friend));
        }
    }

    ChatMsg = function (senderId,reciverId,msg,msgId) {
        this.senderId = senderId;
        this.receiverId = reciverId;
        this.msg = msg;
        this.msgId = msgId;
    }

    DataContent = function (action,chatMsg,extend){
        this.action = action;
        this.chatMsg = chatMsg;
        this.extend = extend;
    }

    ChatHistory = function (myId,friendId,msg,flag){
        this.myId = myId;
        this.friendId = friendId;
        this.msg = msg;
        this.flag = flag;
    }

    ChatSnapShot = function (myId,friendId,msg,isRead){
        this.myId = myId;
        this.friendId = friendId;
        this.msg = msg;
        this.isRead = isRead;
    }


    let chat = {
        CONNECT: 1,
        CHAT: 2,
        SIGNED: 3,
        KEEPALIVE: 4,
        PULL_FRIEND: 5,
        socket: null,
        messageToSend: '',
        myId:'',
        friendId:'',
        friendName:'',
        goeasy:null,
        messageResponses: [
            'Why did the web developer leave the restaurant? Because of the table layout.',
            'How do you comfort a JavaScript bug? You console it.',
            'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
            'What is the most used language in programming? Profanity.',
            'What is the object-oriented way to become wealthy? Inheritance.',
            'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
        ],
        messageForResponse: '',
        render: function() {
            this.scrollToBottom();
            if (this.messageToSend.trim() !== '') {
                console.log(this.messageToSend)
                var template = Handlebars.compile($("#message-template").html());
                var context = {
                    name:"me",
                    response: this.messageToSend,
                    time: this.getCurrentTime()
                };
                this.$chatHistoryList.append(template(context));
                this.scrollToBottom();
                this.$textarea.val('');
            }
        },
        init: function() {
            //localStorage.clear()
            this.cacheDOM();
            this.bindEvents();
            this.render();
            if (window.WebSocket) {
                // 如果当前已连接，无需重复初始化WebSocket
                if (this.socket != null && this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
                    return false;
                }
                this.socket = new WebSocket("ws://100.80.116.145:8888/ws")
                this.socket.onopen = this.wsopen
                this.socket.onclose = this.wsclose
                this.socket.onerror = this.wserror
                this.socket.onmessage = this.wsmessage
            } else {
                console.log("浏览器不支持websocket")
                return false;
            }
            if(this.goeasy != null){
                return false
            }
            this.goeasy = GoEasy.getInstance({
                host:"hangzhou.goeasy.io",
                appkey:"BC-3cf3a0c8e7174231aab24ae08d3669b5",
                modules:['im']
            });
        },
        connect: function (){
            chat.goeasy.connect({
                id:this.myId, //pubsub选填，im必填
                data:{"avatar":"/www/xxx.png","nickname":"Neo"}, //必须是一个对象，pubsub选填，im必填，用于上下线提醒和查询在线用户列表时，扩展更多的属性
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
        },
        chatMessage2: function(e) {
            if (this.socket != null && this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
                return false;
            }else{
                chat.init();
                this.socket.send(e);
            }

        },
        wsopen: function() {
            console.log("webSocket 已连接")
            var userId = Number(localStorage.getItem("userId"));
            var chatMsg = new ChatMsg(userId,null,null,null);
            var dataContent = new DataContent(chat.CONNECT,chatMsg,null);
            chat.chatMessage2(JSON.stringify(dataContent));
        },
        wsclose: function() {
            console.log("webSocket 已连接")
        },
        wserror: function() {
            console.log("webSocket 已连接")
        },
        wsmessage: function(e) {
            var currentId = $(".chat").attr("id")
            var templateResponse = Handlebars.compile($("#message-response-template").html());
            var dataContent = JSON.parse(e.data)
            var chatMsg = dataContent.chatMsg;
            var msg = chatMsg.msg;
            var senderId = chatMsg.senderId;
            var receiverId = chatMsg.receiverId;
            console.log("接收到的消息：" +msg)
            console.log("当前聊天ID:"+ currentId)
            var isRead = true;
            if(currentId == senderId){
                var contextResponse = {
                    name:chat.friendName,
                    response: msg,
                    time: chat.getCurrentTime()
                };
                chat.$chatHistoryList.append(templateResponse(contextResponse));
                chat.scrollToBottom();
            }
            else{
                isRead = false;//聊天界面未打开
            }

            // 对消息签收
            var dataContentSign = new DataContent(chat.SIGNED,null,chatMsg.msgId)
            chat.chatMessage2(JSON.stringify(dataContentSign));

            console.log("msg")
            console.log(msg)
            console.log("id")
            console.log(chatMsg.msgId)
            //保存聊天记录到本地缓存
            chat.saveUserChatHistory(receiverId,senderId,msg,2);
            // 保存聊天快照到本地缓存
            chat.saveUserChatSnapShot(receiverId,senderId,msg,isRead);
        },
        // 快照部分
        saveUserChatSnapShot:function(myId,friendId,msg,isRead){
            var me = this;
            var chatKey = "chat-snapshot"+myId;
            var chatSnapshotListStr = localStorage.getItem(chatKey);
            var chatSnapshotList ;
            if(chatSnapshotListStr != "null" && chatSnapshotListStr != null){
                chatSnapshotList = JSON.parse(chatSnapshotListStr);
                // 循环快照list，并且判断每个元素是否包含朋友id，匹配则删除
                for(var i = 0; i< chatSnapshotList.length;i++){
                    chatSnapshotList.splice(i,1);
                    break;
                }
            }
            else{
                chatSnapshotList = [];
            }
            // 构建聊天快照对象
            var singleMsg = new ChatSnapShot(myId,friendId,msg,isRead)
            chatSnapshotList.push(singleMsg);
            var stringList = JSON.stringify(chatSnapshotList)
            console.log(stringList);
            // 本地缓存
            localStorage.setItem(chatKey,stringList);
        },
        getUserChatSnapShot:function(myId){
            var me = this;
            var chatKey = "chat-snapshot"+myId;
            var chatSnapshotListStr = localStorage.getItem(chatKey);
            var chatSnapshotList ;
            if(chatSnapshotListStr != "null" && chatSnapshotListStr != null){
                chatSnapshotList = JSON.parse(chatSnapshotListStr);
                // 循环快照list，并且判断每个元素是否包含朋友id，匹配则删除
                for(var i = 0; i< chatSnapshotList.length;i++){
                    chatSnapshotList.splice(i,1);
                    break;
                }
            }
            else{
                chatSnapshotList = [];
            }
            return chatSnapshotList
        },
        // flag 用于判断谁发送的
        saveUserChatHistory:function(myId,friendId,msg,flag){
            var me = this;
            var chatKey = "chat-"+myId+"-"+friendId;
            var chatHistoryListStr = localStorage.getItem(chatKey);
            var chatHistoryList ;
            if(chatHistoryListStr != "null" && chatHistoryListStr != null){
                chatHistoryList = JSON.parse(chatHistoryListStr);
            }
            else{
                chatHistoryList = [];
            }
            var singleMsg = new ChatHistory(myId,friendId,msg,flag)
            chatHistoryList.push(singleMsg);
            var stringList = JSON.stringify(chatHistoryList)
            console.log(stringList);
            // 本地缓存
            localStorage.setItem(chatKey,stringList);
        },
        getUserChatHistory:function(myId,friendId){
            var me = this;
            var chatKey = "chat-"+myId+"-"+friendId;
            var chatHistoryListStr = localStorage.getItem(chatKey);
            var chatHistoryList;
            console.log(chatHistoryListStr)
            if(chatHistoryListStr != "null" && chatHistoryListStr != null){
                chatHistoryList = JSON.parse(chatHistoryListStr);
            }
            else{
                chatHistoryList = [];
            }
            return chatHistoryList;
        },
        cacheDOM: function() {
            this.$chatHistory = $('.chat-history');
            this.$button = $('button.send');
            this.$textarea = $('#message-to-send');
            this.$chatHistoryList = this.$chatHistory.find('ul');
        },
        bindEvents: function() {
            this.$button.on('click', this.addMessage.bind(this));
            this.$textarea.on('keyup', this.addMessageEnter.bind(this));
        },
        addMessage: function() {
            this.messageToSend = this.$textarea.val()

            var userId = Number(localStorage.getItem("userId"));
            console.log(userId)
            var chatMsg = new ChatMsg(userId,this.friendId,chat.messageToSend,null);
            var dataContent = new DataContent(chat.CHAT,chatMsg,null);
            this.chatMessage2(JSON.stringify(dataContent));
            // 保存聊天历史记录到本地缓存
            this.saveUserChatHistory(userId,this.friendId,this.messageToSend,1);
            // 快照到本地缓存
            this.saveUserChatSnapShot(userId,this.friendId,this.messageToSend,true)
            this.render()
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
            return arr[Math.floor(Math.random() * arr.length)];
        }

    };

    chat.init();

    let searchFilter = {
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

    let menu = {
        init: function () {
            items = {
                list: document.querySelector('ul.items'),
                all: document.querySelectorAll('.item'),
                name: ''
            }
            items.all.forEach(i => {
                i.addEventListener('mousedown', () => {
                    i.classList.contains('item-active') || this.setActiveItem(i)
                })
            })
        },
        setActiveItem: function (i) {
            items.list.querySelector('.item-active').classList.remove('item-active')
            i.classList.add('item-active')
        }
    };

    menu.init()

})();