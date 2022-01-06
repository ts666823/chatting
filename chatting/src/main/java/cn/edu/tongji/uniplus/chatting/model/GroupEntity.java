package cn.edu.tongji.uniplus.chatting.model;

import javax.persistence.*;
import java.util.Objects;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupEntity.java
 * @Description TODO
 * @createTime 2021年12月20日 19:22:00
 */
@Entity
@Table(name = "group", schema = "uniplus_chatting", catalog = "")
public class GroupEntity {
    private long groupId;
    private String groupName;

    @Id
    @Column(name = "group_id")
    public long getGroupId() {
        return groupId;
    }

    public void setGroupId(long groupId) {
        this.groupId = groupId;
    }

    @Basic
    @Column(name = "group_name")
    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupEntity that = (GroupEntity) o;
        return groupId == that.groupId && Objects.equals(groupName, that.groupName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId, groupName);
    }
}
