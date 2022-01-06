package cn.edu.tongji.uniplus.chatting.enums;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName MsgSignFlagEnum.java
 * @Description TODO
 * @createTime 2021年12月09日 20:13:00
 */
public enum MsgSignFlagEnum {
    unsign(0, "未签收"),
    signed(1, "已签收");

    public final Integer type;
    public final String content;

    MsgSignFlagEnum(Integer type, String content){
        this.type = type;
        this.content = content;
    }

    public Integer getType() {
        return type;
    }
}
