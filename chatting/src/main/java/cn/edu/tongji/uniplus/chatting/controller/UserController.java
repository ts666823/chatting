package cn.edu.tongji.uniplus.chatting.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import cn.edu.tongji.uniplus.chatting.enums.LoginStatus;
import cn.edu.tongji.uniplus.chatting.enums.ReturnStatus;
import cn.edu.tongji.uniplus.chatting.enums.SignupStatus;
import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import cn.edu.tongji.uniplus.chatting.service.LoginService;
import cn.edu.tongji.uniplus.chatting.service.SignupService;
import cn.edu.tongji.uniplus.chatting.untils.CheckSumBuilder;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName UserController.java
 * @Description TODO
 * @createTime 2021年12月06日 14:44:00
 */
@RestController
@RequestMapping("/api/v1/chat/user")
public class UserController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private SignupService signupService;

    /// TODO 加密
    @GetMapping("/login")
    public SaResult userLogin(@RequestParam("userEmail") String userEmail, @RequestParam("userPassword") String userPassword) throws IOException {
        UserEntity loginUser = new UserEntity();
        loginUser.setUserEmail(userEmail);
        loginUser.setPassword(userPassword);
        switch (loginService.userLogin(loginUser)) {
            case IncorrectPassword:
                return SaResult.code(400).setData("Incorrect Password");
            case Success:
                Long userId = loginService.getUserIdByEmail(userEmail);
                StpUtil.login(userId,true);
                return SaResult.data(StpUtil.getTokenInfo());
            case NoUser:
                return SaResult.code(404).setData("No Such User");
        }
        return SaResult.code(500).setData("Unknown State");
    }

    @PostMapping("/signup")
    public SaResult addUserLike(@RequestBody UserEntity userEntity) {
        switch (signupService.userSignup(userEntity)) {
            case Successful:
                StpUtil.login(userEntity.getUserId(),true);
                return SaResult.data(StpUtil.getTokenInfo());
            case EmailExisted:
                return SaResult.code(400).setData("Email Existed");
            case UserNameExisted:
                return SaResult.code(400).setData("User Name Existed");
        }
        return SaResult.code(500).setData("Unknown State");
    }

    @GetMapping("/isLogin")
    public ResponseEntity<Object> isLogin() {
        return  ResponseEntity.ok(StpUtil.isLogin());
    }

    @GetMapping("")
    public SaResult getProfile(){
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            UserEntity userEntity = loginService.getUserInfo(userId);
            return SaResult.data(userEntity);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @GetMapping("/logout")
    public SaResult doLogout(){
        StpUtil.logout();
        return SaResult.ok();
    }

    @GetMapping("/getId")
    public SaResult getLoginId(){
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            return SaResult.data(stpLoginID);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @PutMapping("/changeInfo")
    public SaResult changeName(@RequestBody ModifyInfoBody data){
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            loginService.changeUserName(data.getEmail(), data.getName(),userId);
            return SaResult.ok();
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }
}
