package cn.edu.tongji.uniplus.chatting.service;

import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import cn.edu.tongji.uniplus.chatting.untils.RequestRes;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName FriendServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月10日 18:14:00
 */
@Service
public interface FriendService {
    List<UserEntity> getUsersByNickNameLike(String nickname,Long userId);

    void addFriendRequest(Long senderUserId,Long acceptUserId);

    List<UserEntity> getFriends(Long userId);

    void acceptFriendRequest(Long senderUserId,Long acceptUserId);

    void refuseFriendRequest(Long senderUserId,Long acceptUserId);

    List<RequestRes> getFriendRequest(Long userId);

    void deleteFriend(Long userId,Long friendId);
}
