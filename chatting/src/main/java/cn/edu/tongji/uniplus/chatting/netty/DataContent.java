package cn.edu.tongji.uniplus.chatting.netty;

import java.io.Serializable;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName DataContent.java
 * @Description TODO
 * @createTime 2021年12月09日 18:38:00
 */
public class DataContent implements Serializable {
    private Integer action;//动作类型
    private ChatMsg chatMsg;//用户的聊天内容
    private String extend;//扩展字段

    public Integer getAction() {
        return action;
    }

    public void setAction(Integer action) {
        this.action = action;
    }

    public ChatMsg getChatMsg() {
        return chatMsg;
    }

    public void setChatMsg(ChatMsg chatMsg) {
        this.chatMsg = chatMsg;
    }

    public String getExtend() {
        return extend;
    }

    public void setExtend(String extend) {
        this.extend = extend;
    }
}
