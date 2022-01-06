package cn.edu.tongji.uniplus.chatting.model;

import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 * @ClassName ChatMsgEntity.java
 * @author tangshuo
 * @version 1.0.0
 * @Description TODO
 * @createTime 2021年12月09日 19:50:00
 */
@Entity
@Table(name = "chat_msg", schema = "uniplus_chatting", catalog = "")
@DynamicInsert
@DynamicUpdate
public class ChatMsgEntity {
    private String msgId;
    private long sendUserId;
    private long acceptUserId;
    private String msg;
    private int signFlag;
    private Timestamp createTime;

    @Id
    @Column(name = "msg_id")
    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
    }

    @Basic
    @Column(name = "send_user_id")
    public Long getSendUserId() {
        return sendUserId;
    }

    public void setSendUserId(long sendUserId) {
        this.sendUserId = sendUserId;
    }

    @Basic
    @Column(name = "accept_user_id")
    public Long getAcceptUserId() {
        return acceptUserId;
    }

    public void setAcceptUserId(long acceptUserId) {
        this.acceptUserId = acceptUserId;
    }

    @Basic
    @Column(name = "msg")
    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    @Basic
    @Column(name = "sign_flag")
    public int getSignFlag() {
        return signFlag;
    }

    public void setSignFlag(int signFlag) {
        this.signFlag = signFlag;
    }

    @Basic
    @Column(name = "create_time")
    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChatMsgEntity that = (ChatMsgEntity) o;
        return msgId == that.msgId && signFlag == that.signFlag && Objects.equals(sendUserId, that.sendUserId) && Objects.equals(acceptUserId, that.acceptUserId) && Objects.equals(msg, that.msg) && Objects.equals(createTime, that.createTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(msgId, sendUserId, acceptUserId, msg, signFlag, createTime);
    }
}
