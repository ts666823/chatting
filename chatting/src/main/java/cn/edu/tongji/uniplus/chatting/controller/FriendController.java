package cn.edu.tongji.uniplus.chatting.controller;

import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import cn.edu.tongji.uniplus.chatting.enums.ReturnStatus;
import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import cn.edu.tongji.uniplus.chatting.service.FriendService;
import cn.edu.tongji.uniplus.chatting.untils.RequestRes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName FriendController.java
 * @Description TODO
 * @createTime 2021年12月10日 15:23:00
 */
@RestController
@RequestMapping("/api/v1/chat/friend")
public class FriendController {
    @Autowired
    private FriendService friendService;
    // 寻找好友
    @GetMapping("/searchFriend/{userNickName}")
    public SaResult userLogin(@PathVariable String userNickName) {
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            List<UserEntity> userEntityList = friendService.getUsersByNickNameLike(userNickName, userId);
            return SaResult.data(userEntityList);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @GetMapping("")
    public SaResult getAllFriend(){
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            List<UserEntity> userEntityList = friendService.getFriends(userId);
            return SaResult.data(userEntityList);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @PostMapping("/addFriendRequest")
    public SaResult userAddFriendRequest(@RequestBody FriendRequestBody data){
        Long acceptUserId = Long.parseLong(data.getUserIdStr());
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            friendService.addFriendRequest(userId,acceptUserId);
            return SaResult.data(ReturnStatus.success.type);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @GetMapping("/acceptFriendRequest/{senderId}")
    public SaResult userAddFriend(@PathVariable String senderId){
        Long acceptUserId = Long.parseLong(senderId);
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            friendService.acceptFriendRequest(acceptUserId,userId);
            return SaResult.data(ReturnStatus.success.type);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @GetMapping("/refuseFriendRequest/{senderId}")
    public SaResult refuseFriend(@PathVariable String senderId){
        Long acceptUserId = Long.parseLong(senderId);
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            friendService.refuseFriendRequest(acceptUserId,userId);
            return SaResult.data(ReturnStatus.success.type);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @GetMapping("/getFriendRequest")
    public SaResult getFriendRequest(){
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            List<RequestRes> friendsRequestList = friendService.getFriendRequest(userId);
            return SaResult.data(friendsRequestList);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }

    @DeleteMapping("/deleteFriendRequest/{myFriendId}")
    public SaResult deleteFriendRequest(@PathVariable Long myFriendId){
        Object stpLoginID =  StpUtil.getLoginIdDefaultNull();
        if(stpLoginID != null) {
            Long userId = Long.parseLong((String) stpLoginID);
            friendService.deleteFriend(userId,myFriendId);
            return SaResult.data(ReturnStatus.success.type);
        }
        else{
            return SaResult.code(400).setData(ReturnStatus.unlogin.type);
        }
    }
}

class FriendRequestBody{
    private String userIdStr;

    public String getUserIdStr() {
        return userIdStr;
    }

    public void setUserIdStr(String userIdStr) {
        this.userIdStr = userIdStr;
    }
}


