package cn.edu.tongji.uniplus.chatting.repository;

import cn.edu.tongji.uniplus.chatting.model.FriendsRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName FriendsRequestRepository.java
 * @Description TODO
 * @createTime 2021年12月10日 15:29:00
 */
@Repository
public interface FriendsRequestRepository extends JpaRepository<FriendsRequestEntity,Long> {
    List<FriendsRequestEntity> findFriendsRequestEntitiesByAcceptUserId(long acceptUserId);
    List<FriendsRequestEntity> findFriendsRequestEntitiesByAcceptUserIdAndSendUserId(long senderId, long acceptUserId);
}
