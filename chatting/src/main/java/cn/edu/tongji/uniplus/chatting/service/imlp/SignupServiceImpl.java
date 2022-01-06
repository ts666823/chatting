package cn.edu.tongji.uniplus.chatting.service.imlp;

import cn.edu.tongji.uniplus.chatting.enums.SignupStatus;
import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import cn.edu.tongji.uniplus.chatting.repository.UserRepository;
import cn.edu.tongji.uniplus.chatting.service.SignupService;

import javax.annotation.Resource;
import com.github.yitter.idgen.YitIdHelper;
import org.springframework.stereotype.Service;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName SignupServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月06日 14:15:00
 */
@Service
public class SignupServiceImpl implements SignupService {
    @Resource
    UserRepository userRepository;

    @Override
    public SignupStatus userSignup(UserEntity userEntity) {
        return userSignup(userEntity.getUserName(),userEntity.getUserEmail(),userEntity.getPassword(),userEntity.getFaceImage(),userEntity.getNickname());
    }

    /// TODO : USERNAME，EMAIL，PASSWORD（两次验证）需要在前端保证不为空
    @Override
    public SignupStatus userSignup(String userName, String email, String password,String face_image,String nickname) {
        if(userRepository.findUserEntityByUserName(userName) != null)
        {
            return SignupStatus.UserNameExisted;
        }
        if(userRepository.findUserEntityByUserEmail(email) != null)
        {
            return SignupStatus.EmailExisted;
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(YitIdHelper.nextId());
        userEntity.setUserName(userName);
        userEntity.setPassword(password);
        if(face_image!=null) {
            userEntity.setFaceImage(face_image);
        }
        else{
            userEntity.setFaceImage("https://guisu.oss-cn-shanghai.aliyuncs.com/img/customer_img.png");
        }
        if(nickname != null){
            userEntity.setNickname(nickname);
        }
        else {
            userEntity.setNickname("default name");
        }

        userEntity.setUserEmail(email);

        userRepository.save(userEntity);
        return SignupStatus.Successful;
    }
}
