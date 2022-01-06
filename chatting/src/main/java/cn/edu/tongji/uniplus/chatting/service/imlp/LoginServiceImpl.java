package cn.edu.tongji.uniplus.chatting.service.imlp;

import cn.edu.tongji.uniplus.chatting.enums.LoginStatus;
import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import cn.edu.tongji.uniplus.chatting.repository.UserRepository;
import cn.edu.tongji.uniplus.chatting.service.LoginService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Objects;
import java.util.Optional;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName LoginServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月06日 14:14:00
 */
@Service
public class LoginServiceImpl implements LoginService {
    @Resource
    UserRepository userRepository;

    @Override
    public LoginStatus userLogin(UserEntity userEntity) {
        return userLogin(userEntity.getUserEmail(),userEntity.getPassword());
    }

    /// TODO:用户名和邮箱皆可登陆
    @Override
    public LoginStatus userLogin(String email, String password) {
        UserEntity userEntity = userRepository.findUserEntityByUserEmail(email);
        if(userEntity == null)
        {
            return LoginStatus.NoUser;
        }
        else if(Objects.equals(userEntity.getPassword(), password)){
            return LoginStatus.Success;
        }
        else{
            return LoginStatus.IncorrectPassword;
        }
    }

    /// TODO 为什么用Option封装
    @Override
    public Long getUserIdByEmail(String email) {
        UserEntity user = userRepository.findUserEntityByUserEmail(email);
        if (user == null) {
            throw new RuntimeException("User email not registered");
        } else {

            return user.getUserId();
        }
    }

    @Override
    public UserEntity getUserInfo(Long userId) {
        return userRepository.findUserEntityByUserId(userId);
    }

    @Override
    public void changeUserName(String userEmail,String userName,Long id) {
        UserEntity userEntity = userRepository.findUserEntityByUserId(id);
        userEntity.setUserName(userName);
        userEntity.setUserEmail(userEmail);
        userRepository.save(userEntity);
    }
}
