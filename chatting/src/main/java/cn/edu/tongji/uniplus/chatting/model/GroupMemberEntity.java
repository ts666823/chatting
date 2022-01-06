package cn.edu.tongji.uniplus.chatting.model;

import javax.persistence.*;
import java.util.Objects;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName GroupMemberEntity.java
 * @Description TODO
 * @createTime 2021年12月20日 14:00:00
 */
@Entity
@Table(name = "group_member", schema = "uniplus_chatting", catalog = "")
public class GroupMemberEntity {
    private long id;
    private Long groupId;
    private Long memberId;

    @Id
    @Column(name = "id")
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Basic
    @Column(name = "group_id")
    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    @Basic
    @Column(name = "member_id")
    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GroupMemberEntity that = (GroupMemberEntity) o;
        return id == that.id && Objects.equals(groupId, that.groupId) && Objects.equals(memberId, that.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, groupId, memberId);
    }
}
