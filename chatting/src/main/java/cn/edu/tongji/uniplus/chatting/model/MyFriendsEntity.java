package cn.edu.tongji.uniplus.chatting.model;

import javax.persistence.*;
import java.util.Objects;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName MyFriendsEntity.java
 * @Description TODO
 * @createTime 2021年12月10日 19:30:00
 */
@Entity
@Table(name = "my_friends", schema = "uniplus_chatting", catalog = "")
public class MyFriendsEntity {
    private long id;
    private long myUserId;
    private long myFriendUserId;

    @Id
    @Column(name = "id")
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "my_user_id")
    public long getMyUserId() {
        return myUserId;
    }

    public void setMyUserId(long myUserId) {
        this.myUserId = myUserId;
    }

    @Basic
    @Column(name = "my_friend_user_id")
    public long getMyFriendUserId() {
        return myFriendUserId;
    }

    public void setMyFriendUserId(long myFriendUserId) {
        this.myFriendUserId = myFriendUserId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MyFriendsEntity that = (MyFriendsEntity) o;
        return id == that.id && myUserId == that.myUserId && myFriendUserId == that.myFriendUserId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, myUserId, myFriendUserId);
    }
}
