package cn.edu.tongji.uniplus.chatting.repository;

import cn.edu.tongji.uniplus.chatting.model.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author tangshuo
 * @version 1.0.0
 * @ClassName UserRepository.java
 * @Description TODO
 * @createTime 2021年12月06日 13:49:00
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findUserEntityByUserName(String userName);
    UserEntity findUserEntityByUserEmail(String userEmail);
    UserEntity findUserEntityByUserEmailAndPassword(String userEmail,String password);
    UserEntity findUserEntityByUserId(Long userId);

    @Query("SELECT u FROM UserEntity u WHERE u.userName LIKE CONCAT('%',?1,'%')")
    List<UserEntity> findUsersByNickNameLike(String username);
}
