package cn.edu.tongji.uniplus.chatting.enums;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName MsgActionEnum.java
 * @Description TODO
 * @createTime 2021年12月09日 19:05:00
 */
public enum MsgActionEnum {
    CONNECT(1, "第一次(或重连)初始化连接"),
    CHAT(2, "聊天消息"),
    SIGNED(3, "消息签收"),
    KEEPALIVE(4, "客户端保持心跳"),
    PULL_FRIEND(5, "拉取好友");

    public final Integer type;
    public final String content;

    MsgActionEnum(Integer type, String content){
        this.type = type;
        this.content = content;
    }

    public Integer getType() {
        return type;
    }
}
