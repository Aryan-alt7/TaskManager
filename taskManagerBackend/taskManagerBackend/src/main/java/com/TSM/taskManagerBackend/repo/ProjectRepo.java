package com.TSM.taskManagerBackend.repo;

import com.TSM.taskManagerBackend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepo extends JpaRepository<Project, Integer> {
    List<Project>findUserByUser_Username(String username);
    Optional<Project> findByIdAndUser_Username(int id, String username);
    long countByUser_Username(String username);
}
