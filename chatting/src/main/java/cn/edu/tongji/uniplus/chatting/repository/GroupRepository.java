package cn.edu.tongji.uniplus.chatting.repository;

import cn.edu.tongji.uniplus.chatting.model.GroupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupRepository.java
 * @Description TODO
 * @createTime 2021年12月20日 19:23:00
 */
@Repository
public interface GroupRepository extends JpaRepository<GroupEntity,Long> {
    GroupEntity findGroupEntityByGroupId(Long groupId);
}
