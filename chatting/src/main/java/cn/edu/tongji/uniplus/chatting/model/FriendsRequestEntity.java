package cn.edu.tongji.uniplus.chatting.model;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName FriendsRequestEntity.java
 * @Description TODO
 * @createTime 2021年12月12日 19:28:00
 */
@Entity
@Table(name = "friends_request", schema = "uniplus_chatting", catalog = "")
public class FriendsRequestEntity {
    private long requestId;
    private long sendUserId;
    private long acceptUserId;
    private Timestamp requestTime;
    private Integer state;

    @Id
    @Column(name = "request_id")
    public long getRequestId() {
        return requestId;
    }

    public void setRequestId(long requestId) {
        this.requestId = requestId;
    }

    @Basic
    @Column(name = "send_user_id")
    public long getSendUserId() {
        return sendUserId;
    }

    public void setSendUserId(long sendUserId) {
        this.sendUserId = sendUserId;
    }

    @Basic
    @Column(name = "accept_user_id")
    public long getAcceptUserId() {
        return acceptUserId;
    }

    public void setAcceptUserId(long acceptUserId) {
        this.acceptUserId = acceptUserId;
    }

    @Basic
    @Column(name = "request_time")
    public Timestamp getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(Timestamp requestTime) {
        this.requestTime = requestTime;
    }

    @Basic
    @Column(name = "state")
    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendsRequestEntity that = (FriendsRequestEntity) o;
        return requestId == that.requestId && sendUserId == that.sendUserId && acceptUserId == that.acceptUserId && Objects.equals(requestTime, that.requestTime) && Objects.equals(state, that.state);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requestId, sendUserId, acceptUserId, requestTime, state);
    }
}
