package cn.edu.tongji.uniplus.chatting.enums;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName ReturnStatus.java
 * @Description TODO
 * @createTime 2021年12月10日 20:16:00
 */
public enum ReturnStatus {
    success(0, "成功"),
    unlogin(1, "未登陆");

    public final Integer type;
    public final String content;

    ReturnStatus(Integer type, String content){
        this.type = type;
        this.content = content;
    }

    public Integer getType() {
        return type;
    }
}
