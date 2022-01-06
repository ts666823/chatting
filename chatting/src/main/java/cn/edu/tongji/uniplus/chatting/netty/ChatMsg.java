package cn.edu.tongji.uniplus.chatting.netty;

import java.io.Serializable;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName ChatMsg.java
 * @Description TODO
 * @createTime 2021年12月09日 19:00:00
 */
public class ChatMsg implements Serializable {
    private Long senderId;//发送者id
    private Long receiverId;//接收者id
    private String msg;//聊天内容
    private String msgId; //用于消息的签收

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
    }
}
