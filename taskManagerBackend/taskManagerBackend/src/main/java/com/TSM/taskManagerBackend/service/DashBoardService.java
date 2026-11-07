
package com.TSM.taskManagerBackend.service;

import com.TSM.taskManagerBackend.model.DashBoard;
import com.TSM.taskManagerBackend.model.UpcomingTasks;
import com.TSM.taskManagerBackend.repo.ProjectRepo;
import com.TSM.taskManagerBackend.repo.TaskRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashBoardService {

    private final ProjectRepo projectRepo;
    private final TaskRepo taskRepo;

    public DashBoardService(ProjectRepo projectRepo, TaskRepo taskRepo) {
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
    }

    public DashBoard getStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        long totalProjects = projectRepo.countByUser_Username(username);

        long totalTasks = taskRepo.countByProject_User_Username(username);

        long completedTasks = taskRepo.countByProject_User_UsernameAndCompletedTrue(username);

        long dueToday = taskRepo.countByProject_User_UsernameAndDueDateAndCompletedFalse(username, LocalDate.now());

        return new DashBoard(
                totalProjects,
                totalTasks,
                completedTasks,
                dueToday
        );
    }

    public List<UpcomingTasks> getUpcomingTasks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return taskRepo.findTop5ByProject_User_UsernameAndCompletedFalseOrderByDueDateAsc(username)
                .stream()
                .map(task -> new UpcomingTasks(
                        task.getId(),
                        task.getTitle(),
                        task.getPriority(),
                        task.isCompleted(),
                        task.getDueDate(),
                        task.getProject().getId()
                ))
                .toList();
    }

    public String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return username;
    }
}
