
package com.TSM.taskManagerBackend.repo;

import com.TSM.taskManagerBackend.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepo extends JpaRepository<Task, Integer> {

    List<Task> findByProject_Id(int projId);
    Page<Task> findByProject_Id(int projId, Pageable pageable);
    List<Task> findByProject_IdAndProject_User_UsernameOrderByDueDateAsc(int projId, String username);
    List<Task> findByProject_IdAndProject_User_UsernameOrderByDueDateDesc(int projId, String username);
    long countByCompletedTrue();
    long countByDueDateAndCompletedFalse(LocalDate dueDate);
    List<Task> findTop5ByCompletedFalseOrderByDueDateAsc();
    Page<Task> findByProject_IdAndProject_User_Username(int projId, String username, Pageable pageable);
    Optional<Task> findByIdAndProject_User_Username(int id, String username);
    List<Task> findByProject_User_Username(String username);

    // USER-WISE DASHBOARD
    long countByProject_User_Username(String username);
    long countByProject_User_UsernameAndCompletedTrue(String username);
    long countByProject_User_UsernameAndDueDateAndCompletedFalse(String username, LocalDate dueDate);
    List<Task> findTop5ByProject_User_UsernameAndCompletedFalseOrderByDueDateAsc(String username);
}
