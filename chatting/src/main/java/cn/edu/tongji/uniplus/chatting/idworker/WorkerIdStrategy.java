package cn.edu.tongji.uniplus.chatting.idworker;

public interface WorkerIdStrategy {
    void initialize();

    long availableWorkerId();

    void release();
}
