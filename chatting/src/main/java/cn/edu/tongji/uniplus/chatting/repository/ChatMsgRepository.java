package cn.edu.tongji.uniplus.chatting.repository;

import cn.edu.tongji.uniplus.chatting.model.ChatMsgEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName ChatMsgRepository.java
 * @Description TODO
 * @createTime 2021年12月09日 19:49:00
 */
@Repository
public interface ChatMsgRepository extends JpaRepository<ChatMsgEntity,String> {
}
