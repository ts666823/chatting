package cn.edu.tongji.uniplus.chatting.untils;

import java.sql.Timestamp;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName RequestRes.java
 * @Description TODO
 * @createTime 2021年12月12日 12:07:00
 */
public class RequestRes {
    public String avatorImage;
    public String userName;
    public Timestamp requestTime;
    public Long senderId;
    public Long accepterId;

    public String getAvatorImage() {
        return avatorImage;
    }

    public void setAvatorImage(String avatorImage) {
        this.avatorImage = avatorImage;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Timestamp getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(Timestamp requestTime) {
        this.requestTime = requestTime;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getAccepterId() {
        return accepterId;
    }

    public void setAccepterId(Long accepterId) {
        this.accepterId = accepterId;
    }
}
