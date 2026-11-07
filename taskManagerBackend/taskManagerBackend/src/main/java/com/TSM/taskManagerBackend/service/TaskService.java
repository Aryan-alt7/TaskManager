package com.TSM.taskManagerBackend.service;

import com.TSM.taskManagerBackend.model.Project;
import com.TSM.taskManagerBackend.model.Task;
import com.TSM.taskManagerBackend.repo.ProjectRepo;
import com.TSM.taskManagerBackend.repo.TaskRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepo repo;
    private final ProjectRepo projectRepo;

    TaskService(TaskRepo repo, ProjectRepo projectRepo) {
        this.repo = repo;
        this.projectRepo = projectRepo;
    }

    public List<Task> getAll() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return repo.findByProject_User_Username(username);
    }

    public Page<Task> getTasksByProject(int projId, Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        System.out.println("USERNAME = " + username);
        System.out.println("PROJECT ID = " + projId);
        return repo.findByProject_IdAndProject_User_Username(projId, username, pageable);
    }

    public List<Task> getTasksByProjectSorted(int projId, String order) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        if(order.equalsIgnoreCase("asc")) {
            return repo.findByProject_IdAndProject_User_UsernameOrderByDueDateAsc(projId, username);
        }

        return repo.findByProject_IdAndProject_User_UsernameOrderByDueDateDesc(projId, username);
    }

    public Task getById(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return repo.findByIdAndProject_User_Username(id, username).orElse(null);
    }

    public Task createTask(int projId, Task task) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Project project = projectRepo.findByIdAndUser_Username(projId, username).orElse(null);
        if(project == null) return null;

        if(task.getDueDate().isAfter(project.getDueDate())) {
            return null;
        }

        task.setProject(project);

        Task createdTask = repo.save(task);

        updateProjectStatus(project);
        return createdTask;
    }

    public Task updateTask(int id, Task task) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Task existing = repo.findByIdAndProject_User_Username(id, username).orElse(null);
        if(existing == null) return null;

        existing.setTitle(task.getTitle());
        existing.setCompleted(task.isCompleted());
        existing.setDueDate(task.getDueDate());
        existing.setPriority(task.getPriority());

        Task updatedTask = repo.save(existing);
        updateProjectStatus(existing.getProject());
        return updatedTask;
    }

    private void updateProjectStatus(Project project) {
        List<Task> tasks = project.getTasks();
        if(tasks == null || tasks.isEmpty()) {
            project.setCompleted(false);
            projectRepo.save(project);
            return;
        }
        boolean allCompleted = tasks.stream()
                                    .allMatch(Task ::isCompleted);
        project.setCompleted(allCompleted);
        projectRepo.save(project);
    }

    public void deleteTask(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Task task = repo.findByIdAndProject_User_Username(id, username).orElse(null);
        if(task == null) return;

        Project project = task.getProject();

        repo.deleteById(id);

        updateProjectStatus(project);
    }

    public List<Task> getTasksByProject(int projId) {
        return repo.findByProject_Id(projId);
    }
}
