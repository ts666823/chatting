package cn.edu.tongji.uniplus.chatting.netty;


import io.netty.channel.Channel;

import java.util.HashMap;
import java.util.Map;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName UserChannelRel.java
 * @Description TODO
 * @createTime 2021年12月09日 19:13:00
 */
public class UserChannelRel {
    private  static HashMap<Long, Channel> manage = new HashMap<>();
    public static void put(Long senderID,Channel channel){
        manage.put(senderID,channel);
    }
    public static Channel get(Long senderId){
        return manage.get(senderId);
    }
    public static void output(){
        for(Map.Entry<Long,Channel>entry :manage.entrySet()){
            System.out.println("UserId"+entry.getKey() + ",ChannelId:"+ entry.getValue().id().asLongText());
        }
    }
}
