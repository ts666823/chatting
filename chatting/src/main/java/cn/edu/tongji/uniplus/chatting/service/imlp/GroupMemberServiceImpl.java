package cn.edu.tongji.uniplus.chatting.service.imlp;

import cn.edu.tongji.uniplus.chatting.idworker.Sid;
import cn.edu.tongji.uniplus.chatting.model.GroupEntity;
import cn.edu.tongji.uniplus.chatting.model.GroupMemberEntity;
import cn.edu.tongji.uniplus.chatting.repository.GroupMemberRepository;
import cn.edu.tongji.uniplus.chatting.repository.GroupRepository;
import cn.edu.tongji.uniplus.chatting.service.GroupMemberService;
import cn.edu.tongji.uniplus.chatting.service.GroupService;
import com.github.yitter.idgen.YitIdHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupMemberServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月20日 14:08:00
 */
@Service
public class GroupMemberServiceImpl implements GroupMemberService {

    @Resource
    GroupMemberRepository groupMemberRepository;

    @Resource
    GroupRepository groupRepository;

    @Override
    public List<Long> findGroupIdByMemberId(Long memberId) {
        List<GroupMemberEntity> groupMemberEntityList =  groupMemberRepository.findGroupMemberEntitiesByMemberId(memberId);
        List<Long> groupIds = new ArrayList<>();
        for(GroupMemberEntity groupMemberEntity : groupMemberEntityList){
            groupIds.add(groupMemberEntity.getGroupId());
        }
        return groupIds;
    }

    @Override
    public List<GroupEntity> findGroupByMemberId(Long memberId) {
        List<GroupMemberEntity> groupMemberEntityList =  groupMemberRepository.findGroupMemberEntitiesByMemberId(memberId);
        List<GroupEntity> groups = new ArrayList<>();
        for(GroupMemberEntity groupMemberEntity : groupMemberEntityList){
            groups.add(groupRepository.findGroupEntityByGroupId(groupMemberEntity.getGroupId()));
        }
        return groups;
    }

    @Override
    public void appendGroup(Long memberId, Long groupId) {
        GroupMemberEntity groupMemberEntity = new GroupMemberEntity();
        groupMemberEntity.setGroupId(groupId);
        groupMemberEntity.setMemberId(memberId);
        groupMemberEntity.setId(YitIdHelper.nextId());
        groupMemberRepository.save(groupMemberEntity);
    }

    @Override
    public void quitGroup(Long memberId, Long groupId) {
        List<GroupMemberEntity> groupMemberEntityList =  groupMemberRepository.findGroupMemberEntitiesByMemberIdAndGroupId(memberId,groupId);
        groupMemberRepository.deleteAll(groupMemberEntityList);
    }
}
