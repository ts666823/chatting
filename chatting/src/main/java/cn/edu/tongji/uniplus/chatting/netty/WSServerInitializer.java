package cn.edu.tongji.uniplus.chatting.netty;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketClientProtocolHandler;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.stream.ChunkedWriteHandler;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName WSServerInitializer.java
 * @Description TODO
 * @createTime 2021年12月07日 00:06:00
 */
public class WSServerInitializer extends ChannelInitializer<SocketChannel> {

    @Override
    protected void initChannel(SocketChannel channel) throws Exception {
        // 获取pipeline
        ChannelPipeline pipeline = channel.pipeline();
        // http编解码器
        pipeline.addLast(new HttpServerCodec());
        // http 上有数据流参数，使用netty进行处理
        pipeline.addLast(new ChunkedWriteHandler());
        // HttpMessage聚合处理
        pipeline.addLast(new HttpObjectAggregator(1024 * 64));

        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));

        pipeline.addLast(new ChatHandler());
    }
}
