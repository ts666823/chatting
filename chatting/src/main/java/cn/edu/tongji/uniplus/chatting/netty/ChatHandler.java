package cn.edu.tongji.uniplus.chatting.netty;

import cn.edu.tongji.uniplus.chatting.enums.MsgActionEnum;
import cn.edu.tongji.uniplus.chatting.service.ChatService;
import cn.edu.tongji.uniplus.chatting.untils.JsonUtils;
import cn.edu.tongji.uniplus.chatting.SpringUtil;
import io.micrometer.core.instrument.util.StringUtils;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.util.ArrayList;
import java.util.List;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName ChatHandler.java
 * @Description 用于处理消息
 * @createTime 2021年12月07日 00:11:00
 */
public class ChatHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
    private static ChannelGroup users = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {
        //获取客户端消息
        String content = msg.text();
        // 判断类型
        DataContent dataContent = JsonUtils.jsonToPojo(content,DataContent.class);
        Integer action = dataContent.getAction();
        Channel channel = ctx.channel();
        //2.判断消息类型，根据不同的类型来处理不同的业务
        if(action == MsgActionEnum.CONNECT.type){
            //2.1 当websocket 第一次open的时候，初始化channel，把用的channel 和 userid 关联起来
            Long senderId = dataContent.getChatMsg().getSenderId();
            UserChannelRel.put(senderId,channel);

            //测试
//            for (Channel c: users) {
//                System.out.println(c.id().asLongText());
//            }
//             UserChannelRel.output();
        } else if(action == MsgActionEnum.CHAT.type){
            //2.2 聊天类型的消息，把聊天记录保存到数据库，同时标记消息的签收状态[未签收]
            ChatMsg chatMsg = dataContent.getChatMsg();
            String msgContent = chatMsg.getMsg();
            Long senderId = chatMsg.getSenderId();
            Long receiverId = chatMsg.getReceiverId();
            //保存消息到数据库，并且标记为未签收
            ChatService chatService = (ChatService) SpringUtil.getBean("chatServiceImpl");
            String msgId = chatService.saveMsg(chatMsg);
            chatMsg.setMsgId(msgId);

            DataContent dataContentMsg = new DataContent();
            dataContentMsg.setChatMsg(chatMsg);

            //发送消息
            Channel receiverChannel = UserChannelRel.get(receiverId);
            if(receiverChannel ==null){
                //离线用户
            }else{
                //当receiverChannel 不为空的时候，从ChannelGroup 去查找对应的channel 是否存在
                Channel findChanel = users.find(receiverChannel.id());
                if(findChanel!=null){
                    //用户在线
                    receiverChannel.writeAndFlush(
                            new TextWebSocketFrame(
                                    JsonUtils.objectToJson(dataContentMsg)
                            )
                    );
                }else{
                    //离线用户
                }
            }
        } else if(action == MsgActionEnum.SIGNED.type){
            //2.3 签收消息类型，针对具体的消息进行签收，修改数据库中对应消息的签收状态[已签收]
            ChatService chatService = (ChatService) SpringUtil.getBean("chatServiceImpl");
            //扩展字段在signed 类型消息中 ，代表需要去签收的消息id，逗号间隔
            String msgIdsStr = dataContent.getExtend();
            String[] msgsId = msgIdsStr.split(",");

            List<String> msgIdList = new ArrayList<>();
            for (String mid: msgsId) {
                if(StringUtils.isNotBlank(mid)){
                    msgIdList.add(mid);
                }
            }
            System.out.println(msgIdList.toString());
            if(msgIdList!=null && !msgIdList.isEmpty() && msgIdList.size()>0){
                //批量签收
                chatService.updateMsgSigned(msgIdList);
            }

        } else if(action == MsgActionEnum.KEEPALIVE.type){
            //2.4 心跳类型的消息
            System.out.println("收到来自channel 为【"+channel+"】的心跳包");
        }

        // 获取客户端的消息
//        System.out.println("接收到的数据" + content);
//
//        // 将数据刷新到客户端上
//        users.writeAndFlush(
//                new TextWebSocketFrame(
//                        "[服务器在：]"+ LocalDateTime.now()+ "接收到消息，消息内容为：" + content
//                )
//        );
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        users.add(ctx.channel());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        users.remove(ctx.channel());
//        System.out.println("客户端断开，channel对应的长ID为:" + ctx.channel().id().asLongText());
//        System.out.println("客户端断开，channel对应的短ID为:" + ctx.channel().id().asShortText());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        // 关闭链接
        ctx.channel().close();
        users.remove(ctx.channel());
    }
}

