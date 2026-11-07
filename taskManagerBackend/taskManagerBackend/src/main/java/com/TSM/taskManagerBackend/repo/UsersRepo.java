package com.TSM.taskManagerBackend.repo;

import com.TSM.taskManagerBackend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository <Users, Integer> {
    Users findUserByUsername(String username);
}
