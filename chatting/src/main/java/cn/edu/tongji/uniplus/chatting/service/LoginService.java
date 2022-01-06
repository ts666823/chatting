package cn.edu.tongji.uniplus.chatting.service;

import cn.edu.tongji.uniplus.chatting.enums.LoginStatus;
import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName LoginService.java
 * @Description TODO
 * @createTime 2021年12月06日 13:58:00
 */
@Service
public interface LoginService {
    LoginStatus userLogin(UserEntity userEntity);

    LoginStatus userLogin(String email,String password);

    Long getUserIdByEmail(String email);

    UserEntity getUserInfo(Long userId);

    void changeUserName(String userEmail,String userName,Long id);

}
