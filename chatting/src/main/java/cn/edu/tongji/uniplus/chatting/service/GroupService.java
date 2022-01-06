package cn.edu.tongji.uniplus.chatting.service;

import cn.edu.tongji.uniplus.chatting.model.GroupEntity;
import org.springframework.stereotype.Service;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupService.java
 * @Description TODO
 * @createTime 2021年12月20日 19:25:00
 */
@Service
public interface GroupService {
    GroupEntity findGroupById(Long groupId);
    void createGroup(String name,Long userId);
}
