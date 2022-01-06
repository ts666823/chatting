package cn.edu.tongji.uniplus.chatting.repository;

import cn.edu.tongji.uniplus.chatting.model.GroupMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupMemberRepository.java
 * @Description TODO
 * @createTime 2021年12月20日 14:01:00
 */
@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity,Long> {
    List<GroupMemberEntity> findGroupMemberEntitiesByMemberId(long memberId);
    List<GroupMemberEntity> findGroupMemberEntitiesByMemberIdAndGroupId(long memberId,long groupId);
}
