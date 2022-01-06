package cn.edu.tongji.uniplus.chatting.repository;

import cn.edu.tongji.uniplus.chatting.model.MyFriendsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName MyFriendsRepository.java
 * @Description TODO
 * @createTime 2021年12月10日 18:58:00
 */
@Repository
public interface MyFriendsRepository extends JpaRepository<MyFriendsEntity,Long> {
    List<MyFriendsEntity> findMyFriendsEntitiesByMyUserId(long myUserId);
    List<MyFriendsEntity> findMyFriendsEntitiesByMyUserIdAndMyFriendUserId(long myUserId,long myFriendId);
}
