package cn.edu.tongji.uniplus.chatting.service.imlp;

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

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月20日 19:31:00
 */
@Service
public class GroupServiceImpl implements GroupService {
    @Resource
    GroupRepository groupRepository;

    @Resource
    GroupMemberRepository groupMemberRepository;

    @Override
    public GroupEntity findGroupById(Long groupId) {
        return groupRepository.findGroupEntityByGroupId(groupId);
    }

    @Override
    public void createGroup(String name,Long userId) {
        GroupEntity groupEntity = new GroupEntity();
        groupEntity.setGroupName(name);
        groupEntity.setGroupId(YitIdHelper.nextId());
        //groupRepository.save(groupEntity);
        GroupMemberEntity groupMemberEntity = new GroupMemberEntity();
        groupMemberEntity.setGroupId(groupEntity.getGroupId());
        groupMemberEntity.setMemberId(userId);
        groupMemberEntity.setId(YitIdHelper.nextId());
        groupMemberRepository.save(groupMemberEntity);
    }
}
