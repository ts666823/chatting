package cn.edu.tongji.uniplus.chatting.service.imlp;

import cn.edu.tongji.uniplus.chatting.model.FriendsRequestEntity;
import cn.edu.tongji.uniplus.chatting.model.MyFriendsEntity;
import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import cn.edu.tongji.uniplus.chatting.repository.FriendsRequestRepository;
import cn.edu.tongji.uniplus.chatting.repository.MyFriendsRepository;
import cn.edu.tongji.uniplus.chatting.repository.UserRepository;
import cn.edu.tongji.uniplus.chatting.service.FriendService;
import cn.edu.tongji.uniplus.chatting.untils.RequestRes;
import com.github.yitter.idgen.YitIdHelper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName FriendServiceImpl.java
 * @Description TODO
 * @createTime 2021年12月10日 18:17:00
 */
@Service
public class FriendServiceImpl implements FriendService {
    @Resource
    FriendsRequestRepository friendsRequestRepository;
    @Resource
    UserRepository userRepository;
    @Resource
    MyFriendsRepository myFriendsRepository;


    @Override
    public List<UserEntity> getUsersByNickNameLike(String nickname,Long userId) {
        // 找出所有名字有nickname的
        List<UserEntity> userEntityList = userRepository.findUsersByNickNameLike(nickname);
        List<MyFriendsEntity> myFriendsEntityList = myFriendsRepository.findMyFriendsEntitiesByMyUserId(userId);
        // 去除所有的已经是好友的
        Iterator<UserEntity> it = userEntityList.iterator();
        while (it.hasNext()){
            UserEntity userEntity = it.next();
            for(MyFriendsEntity myFriendsEntity:myFriendsEntityList) {
                if (userEntity.getUserId() == myFriendsEntity.getMyFriendUserId()) {
                    it.remove();
                }
            }
            if(userEntity.getUserId() == userId){
                it.remove();
            }

        }
        return userEntityList;
    }

    @Override
    public void addFriendRequest(Long senderUserId, Long acceptUserId) {
        FriendsRequestEntity friendsRequestEntity = new FriendsRequestEntity();
        friendsRequestEntity.setRequestId(YitIdHelper.nextId());
        friendsRequestEntity.setRequestTime(new Timestamp(System.currentTimeMillis()));
        friendsRequestEntity.setSendUserId(senderUserId);
        friendsRequestEntity.setAcceptUserId(acceptUserId);
        friendsRequestRepository.save(friendsRequestEntity);
    }

    @Override
    public List<UserEntity> getFriends(Long userId) {
        List<UserEntity> userEntityList = new ArrayList<UserEntity>();
        List<MyFriendsEntity> myFriendsEntityList = myFriendsRepository.findMyFriendsEntitiesByMyUserId(userId);
        for(MyFriendsEntity myFriendsEntity:myFriendsEntityList){
            Optional<UserEntity> userEntityOptional = userRepository.findById(myFriendsEntity.getMyFriendUserId());
            userEntityOptional.ifPresent(userEntityList::add);
        }
        return userEntityList;
    }

    @Override
    public void acceptFriendRequest(Long senderUserId, Long acceptUserId) {
        List<FriendsRequestEntity> friendsRequestEntityList = friendsRequestRepository.findFriendsRequestEntitiesByAcceptUserIdAndSendUserId(acceptUserId,senderUserId);
        for(FriendsRequestEntity friendsRequestEntity:friendsRequestEntityList){
            friendsRequestEntity.setState(1);
            friendsRequestRepository.delete(friendsRequestEntity);
        }

        MyFriendsEntity myFriendsEntity4sender = new MyFriendsEntity();
        myFriendsEntity4sender.setId(YitIdHelper.nextId());
        myFriendsEntity4sender.setMyFriendUserId(senderUserId);
        myFriendsEntity4sender.setMyUserId(acceptUserId);
        myFriendsRepository.save(myFriendsEntity4sender);

        MyFriendsEntity myFriendsEntity4acceptUser = new MyFriendsEntity();
        myFriendsEntity4acceptUser.setId(YitIdHelper.nextId());
        myFriendsEntity4acceptUser.setMyFriendUserId(acceptUserId);
        myFriendsEntity4acceptUser.setMyUserId(senderUserId);
        myFriendsRepository.save(myFriendsEntity4acceptUser);
    }

    @Override
    public void refuseFriendRequest(Long senderUserId, Long acceptUserId) {
        List<FriendsRequestEntity> friendsRequestEntityList = friendsRequestRepository.findFriendsRequestEntitiesByAcceptUserIdAndSendUserId(acceptUserId,senderUserId);
        for(FriendsRequestEntity friendsRequestEntity:friendsRequestEntityList){
            friendsRequestEntity.setState(2);
            friendsRequestRepository.delete(friendsRequestEntity);
        }
    }

    @Override
    public List<RequestRes> getFriendRequest(Long userId) {
        List<RequestRes> res = new ArrayList<RequestRes>();
        List<FriendsRequestEntity> friendsRequestEntityList= friendsRequestRepository.findFriendsRequestEntitiesByAcceptUserId(userId);
        for(FriendsRequestEntity friendsRequestEntity:friendsRequestEntityList){
            UserEntity userEntity= userRepository.findUserEntityByUserId(friendsRequestEntity.getSendUserId());
            RequestRes requestRes = new RequestRes();
            requestRes.setAvatorImage(userEntity.getFaceImage());
            requestRes.setAccepterId(friendsRequestEntity.getAcceptUserId());
            requestRes.setRequestTime(friendsRequestEntity.getRequestTime());
            requestRes.setUserName(userEntity.getUserName());
            requestRes.setSenderId(friendsRequestEntity.getSendUserId());
            res.add(requestRes);
        }
        return res;
    }

    @Override
    public void deleteFriend(Long userId, Long friendId) {
        List<MyFriendsEntity> myFriendsEntityList = myFriendsRepository.findMyFriendsEntitiesByMyUserIdAndMyFriendUserId(userId,friendId);
        List<MyFriendsEntity> myFriendsEntity4FriendList = myFriendsRepository.findMyFriendsEntitiesByMyUserIdAndMyFriendUserId(friendId,userId);
        myFriendsRepository.deleteAll(myFriendsEntityList);
        myFriendsRepository.deleteAll(myFriendsEntity4FriendList);
    }
}
