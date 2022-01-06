package cn.edu.tongji.uniplus.chatting.idworker;

public interface RandomCodeStrategy {
    void init();

    int prefix();

    int next();

    void release();
}
