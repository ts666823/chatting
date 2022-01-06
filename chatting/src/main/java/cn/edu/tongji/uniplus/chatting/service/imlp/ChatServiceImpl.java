package cn.edu.tongji.uniplus.chatting.service.imlp;

import cn.edu.tongji.uniplus.chatting.enums.MsgSignFlagEnum;
import cn.edu.tongji.uniplus.chatting.idworker.Sid;
import cn.edu.tongji.uniplus.chatting.model.ChatMsgEntity;
import cn.edu.tongji.uniplus.chatting.netty.ChatMsg;
import cn.edu.tongji.uniplus.chatting.repository.ChatMsgRepository;
import cn.edu.tongji.uniplus.chatting.service.ChatService;
import com.github.yitter.idgen.YitIdHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;


/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName ChatServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月09日 19:47:00
 */
@Service
public class ChatServiceImpl implements ChatService {
    @Resource
    ChatMsgRepository chatMsgRepository;

    @Autowired
    Sid sid;

    @Override
    public String saveMsg(ChatMsg chatMsg) {
        ChatMsgEntity chatMsgEntity = new ChatMsgEntity();
        String msgId = sid.nextShort();
        chatMsgEntity.setMsgId(msgId);
        chatMsgEntity.setAcceptUserId(chatMsg.getReceiverId());
        chatMsgEntity.setSendUserId(chatMsg.getSenderId());
        chatMsgEntity.setCreateTime(new Timestamp(System.currentTimeMillis()));
        chatMsgEntity.setSignFlag(MsgSignFlagEnum.unsign.type);
        chatMsgEntity.setMsg(chatMsg.getMsg());
        chatMsgRepository.save(chatMsgEntity);
        return msgId;
    }

    @Override
    public void updateMsgSigned(List<String> msgIdList) {
        for(String msgId : msgIdList){
            Optional<ChatMsgEntity> optionalChatMsg = chatMsgRepository.findById(msgId);
            optionalChatMsg.ifPresent(chatMsgEntity -> chatMsgEntity.setSignFlag(1));
        }
    }
}
