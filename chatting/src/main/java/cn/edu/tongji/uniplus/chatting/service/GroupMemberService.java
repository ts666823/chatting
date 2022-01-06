package cn.edu.tongji.uniplus.chatting.service;

import cn.edu.tongji.uniplus.chatting.model.GroupEntity;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupMemberService.java
 * @Description TODO
 * @createTime 2021年12月20日 14:06:00
 */
@Service
public interface GroupMemberService {
    List<Long> findGroupIdByMemberId(Long memberId);

    List<GroupEntity> findGroupByMemberId(Long memberId);

    void appendGroup(Long memberId, Long groupId);
    void quitGroup(Long memberId,Long groupId);
}
