package cn.edu.tongji.uniplus.chatting.controller;

import cn.edu.tongji.uniplus.chatting.model.GroupEntity;
import cn.edu.tongji.uniplus.chatting.service.FriendService;
import cn.edu.tongji.uniplus.chatting.service.GroupMemberService;
import cn.edu.tongji.uniplus.chatting.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupMemberController.java
 * @Description TODO
 * @createTime 2021年12月20日 14:47:00
 */
@RestController
@RequestMapping("/api/v1/chat/group")
public class GroupMemberController {
    @Autowired
    private GroupMemberService groupMemberService;

    @Autowired
    private GroupService groupService;

    @GetMapping("/getGroupId/{memberId}")
    List<Long> getGroupIdByMemberId(@PathVariable Long memberId){
        return groupMemberService.findGroupIdByMemberId(memberId);
    }

    @GetMapping("/getGroup/{memberId}")
    List<GroupEntity> getGroupByMemberId(@PathVariable Long memberId){
        return groupMemberService.findGroupByMemberId(memberId);
    }

    @DeleteMapping("/quitGroup")
    void quitGroup(@RequestParam Long memberId,@RequestParam Long groupId){
        groupMemberService.quitGroup(memberId, groupId);
    }

    @PostMapping("/appendGroup")
    void appendGroup(@RequestBody AddGroupBody addGroupBody){
        groupMemberService.appendGroup(addGroupBody.getMemberId(), addGroupBody.getMemberId());
    }

    @PostMapping("/creatGroup")
    void createGroup(@RequestBody CreateGroupBody createGroupBody){
        groupService.createGroup(createGroupBody.getGroupName(),createGroupBody.getMemberId());
    }
}

class AddGroupBody
{
    long memberId;
    long groupId;

    public long getMemberId() {
        return memberId;
    }

    public void setMemberId(long memberId) {
        this.memberId = memberId;
    }

    public long getGroupId() {
        return groupId;
    }

    public void setGroupId(long groupId) {
        this.groupId = groupId;
    }
}

class CreateGroupBody
{
    String groupName;
    Long memberId;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
}
