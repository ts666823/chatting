package cn.edu.tongji.uniplus.chatting.service;

import cn.edu.tongji.uniplus.chatting.netty.ChatMsg;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName ChatServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月09日 19:45:00
 */
@Service
public interface ChatService {
    // 保存用户聊天信息
    String saveMsg(ChatMsg chatMsg);
    void updateMsgSigned(List<String> msgIdList);
}
