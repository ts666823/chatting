var tokenName = localStorage.getItem('tokenName');
var tokenValue = localStorage.getItem('tokenValue');

var defaultName = ""
var defaultEmail = ""

getInfo()

function getInfo(){
    var tokenName = localStorage.getItem('tokenName');
    var tokenValue = localStorage.getItem('tokenValue');
    $.ajax({
        url: "http://112.124.59.163:8080/api/v1/chat/user",
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(tokenName, tokenValue);
        },
        success: function (data, status) {
            if(data.code === 200){
                console.log(data.data)
                defaultName = data.data.userName
                defaultEmail = data.data.userEmail
                $(".userName").text(data.data['userName']);
                $(".userEmail").text(data.data.userEmail);
                $(".avator").attr('src',data.data.faceImage)
                localStorage.setItem("userName",defaultName)
                localStorage.setItem("userImage",data.data.faceImage)
                console.log(data)
            }
            else {
                if(data.data === 1){
                    alert("您还未登陆或登陆状态已经失效");
                }
                else{
                    alert("未知错误");
                }
                $(location).attr("href",'../Login/index.html')
            }
        }
    });
}

$('.btn').on('click', function() {
    var $this = $(this);
    let tokenName = localStorage.getItem('tokenName');
    let tokenValue = localStorage.getItem('tokenValue');
    $this.button('loading');
    setTimeout(function() {
        $.ajax({
            url: "http://112.124.59.163:8080/api/v1/chat/user/logout",
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

$(".button.-modify").on('click',function (){
    var form_1 = $(".form_1")
    form_1.attr("class","form_1 open");
    console.log(form_1.attr("class"))
})

$(".close").on('click',function (){
    $(".form_1").attr("class","form_1");
})

$(".submit_1").on('click',function () {
    if($(".submit_1").attr("disable")){

    }else {
        $(".form_1").attr("class", "form_1");
        defaultName = $(".name_modify").val()
        defaultEmail = $(".email_modify").val()
        console.log(defaultEmail)
        console.log(defaultName)
        $.ajax({
            async: true,
            type: "PUT",
            url: "http://112.124.59.163:8080/api/v1/chat/user/changeInfo",
            contentType: 'application/json;charset=UTF-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(tokenName, tokenValue);
            },
            data: JSON.stringify({
                "name": defaultName,
                "email":defaultEmail
            }),
            success: function(data, status) {
                console.log(data)
                if(data.code === 200){
                    alert("更改信息申请成功")
                    $(location).attr("href", '../Home/index.html')
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
                $(location).attr("href",'../Home/index.html')
            }
        });
    }
})

var reg = /^\w{6,12}@\w{2,4}\.com$/;
var sp=document.getElementsByTagName("span")[0];
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

// var btn_1=document.getElementById("btn_1");
// var close=document.getElementsByClassName("close");
// var form_1=document.getElementsByClassName("form_1");
// btn_1.addEventListener('click',function(){
//     form_1[0].className="form_1 open";
// })
// close[0].addEventListener('click',function(){
//     form_1[0].className="form_1";
// })





