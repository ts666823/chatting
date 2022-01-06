# Web系统与技术

> 1952293 唐烁 授课教师：金伟祖

[TOC]

## 作业综述

​		本在线聊天系统网站均由自己完成，前端部分采取HTML、CSS、JS三件套完成，未使用任何第三方框架。

​		后端部分采取SpringBoot完成，其中登陆部分采取SSO单点登录，即当用户登录后会记录用户登录状态，即使用户关闭浏览器或离开页面，均可保持其登录状态，当异地登录时会将当前账号强制下线，当用户未登录访问时会被拒绝。

​		聊天部分采取分布式框架Netty完成，Netty与Tomcat采取通信协议不同，Tomcat基于Http协议，实质为一个基于Http协议的Web容器，但Netty可以通过编程自定义各种协议。适合于需要采用Web Socket的聊天室/实时聊天搭建。

​		作业已上传至[个人GitHub](https://github.com/ts666823/chatting)上，部署网站为:[1952293 Chatting](http://112.124.59.163:8081/chat/Group/index.html),账号为823206295@qq.com 、823206299@qq.com、1952293@tongji.edu.cn密码均为 1111

## 作业内容

​		该部分将依照作业要求进行逐一展示，作业要求如下所述：

### 登录注册模块

- [x] 登录和注册界面设计

​		登录界面如下所示：

<img src="https://s4.ax1x.com/2022/01/01/TIgYSH.png" alt="TIgYSH.png" style="zoom:50%;" />

​		实现登录的功能代码：

```javascript
$("#loginBtn").click(function() {
  // 使用Ajax发起网络请求
    $.get("http://localhost:8080/api/v1/chat/user/login", {
        userEmail: $("#loginUserEmail").val(),
        userPassword: $("#loginPassword").val()
    },
    function(data, status) {
       if(data.code === 200){
         // 成功后跳转界面
         $(location).attr("href",'../Home/index.html')
       }
       else {
         // 失败则提示相应信息
          alert("Data:" + data.data + "\nStatus:" + status);
       }
	});
});
```

​		演示如下，先从登录界面开始，以错误密码为例子，随后成功登录：

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%889.36.24.mov"></video>

​		注册界面如下：![TITzqg.png](https://s4.ax1x.com/2022/01/01/TITzqg.png)

在这里用户名和邮箱不能是重复的，否则将给出对应的提示，实现的方式与登录一致，但采取的为Post方法，代码如下：

```javascript
 $("#signUpBtn").click(function() {
   // 使用JQuery选取按钮并使用Ajax来发起网络请求
                $.ajax({
                    async: true,
                    type: "post",
                    url: "http://localhost:8080/api/v1/chat/user/signup",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        "userName": $("#signUpUserName").val(),
                        "userEmail": $("#signUpEmail").val(),
                        "password": $("#signUpPassword").val()
                    }),
                    success: function(data) {
                        console.log(data.code)
                        if(data.code === 200){
                            $(location).attr("href",'../Home/index.html')
                        }
                        else {
                            alert("Data:" + data.data);
                        }
                    },
                    error : function() {
                        alert("系统错误");
                        $(location).attr("href",'../Login/index.html')
                    }
                });
            });
        });
```

其中两幅素材选取于[drawkit](https://drawkit.com)，并已经经过作者同意。

界面切换的过渡如下：

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%888.34.26.mov"></video>

### 个人信息模块

- [x] 个人信息界面
- [x] 实现修改个人信息功能

​		个人界面设计如下：

<img src="https://s4.ax1x.com/2022/01/01/TI5zqJ.png" alt="TI5zqJ.png" style="zoom:50%;" />

​		提供了载入动画以及修改信息，其中会验证邮箱格式是否规范，注销登录的功能，代码如下：

```javascript
// 验证邮箱格式是否规范
function verify(obj) {
    var e = obj.value;
    if (reg.test(e)) {
        sp.innerHTML = "V";
        sp.style.color = "green";
        $(".submit_1").attr("class","submit_1")
        $(".submit_1").attr("disabled",false)
    } else {
        sp.innerHTML = "×";
        sp.style.color = "red";
        $(".submit_1").attr("class","submit_1-disable")
        $(".submit_1").attr("disabled",true)
    }
}
// 弹出框
    <div class="form_1">
        <form >
            <div class="input_1"><div class="login_logo">用户信息修改</div><div class="close">X</div></div>
            <hr>
            <div class="input_1"><input type="text" name="name_modify" class="name_modify" placeholder="&nbsp;用户名"></div>
            <div class="input_1"><input type="email" name="email_modify" class="email_modify" placeholder="&nbsp;邮箱" onkeyup="verify(this)"><span></span></div>
            <div class="input_1"><input class="submit_1" type="button" value="提&nbsp;交"></div>
        </form>
    </div>
// 注销登录
$('.btn').on('click', function() {
    var $this = $(this);
    let tokenName = localStorage.getItem('tokenName');
    let tokenValue = localStorage.getItem('tokenValue');
    $this.button('loading');
    setTimeout(function() {
        $.ajax({
            url: "http://localhost:8080/api/v1/chat/user/logout",
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(tokenName, tokenValue);
            },
            success: function (data, status) {
                if(data.code === 200){
                    alert("登出成功")
                }
                $(location).attr("href",'../Login/index.html')
            }
        });
    }, 80);
});
```

​		演示如下：

<video src= "https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%889.46.19.mov"></video>

​		过渡效果如下：

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%889.19.59.mov"></video>

### 添加好友界面

- [x] 好友列表界面
- [x] 添加好友功能

​		好友列表界面和聊天界面设计在一起，方便使用，这里提供一个申请加好友即查找新好友的界面。左侧为好友申请而右侧为查找好友的界面，使用OSS服务对头像进行存储。

<img src="https://s4.ax1x.com/2022/01/01/TI5kuQ.png" alt="TI5kuQ.png" style="zoom:50%;" />

​		添加好友功能，方便期间，使用了另一个客户端发起添加好友请求，这里演示同意添加好友/拒绝添加好友的功能。

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%A4%B4%E5%83%8F/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%889.59.40.mov" />

### 聊天界面

- [x] 聊天界面
- [x] 删除好友功能
- [x] 实时聊天功能
- [x] 文件消息功能
- [x] 转发功能
- [x] 消息撤回功能
- [x] 历史消息功能

<img src="https://s4.ax1x.com/2022/01/01/TII3z8.png" alt="TII3z8.png" style="zoom:50%;" />

删除好友功能演示：

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%A4%B4%E5%83%8F/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%889.59.40.mov" />

聊天相关功能演示如下：

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%A4%B4%E5%83%8F/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%8810.11.25.mov" />

消息部分采用Netty框架，为后端技术，前端主要是通过WebSocket进行通信，如下所示：

```javascript
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
```

为了使得前端能够渲染消息，采取模版形式进行发送，发送消息为：

```javascript
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
```

### 群聊界面

- [x] 群聊界面
- [x] 群聊功能

![TIoN6O.png](https://s4.ax1x.com/2022/01/01/TIoN6O.png)

群聊功能演示如下：

<video src="https://chat4goeasy.oss-cn-hangzhou.aliyuncs.com/%E5%B1%8F%E5%B9%95%E5%BD%95%E5%88%B62022-01-01%20%E4%B8%8B%E5%8D%8810.15.42.mov" />
