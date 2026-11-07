import { Link } from "react-router-dom";
import "./ProjectDetailsPage.css";

export function TaskCard({
    task,
    projectId,
    deleteTask,
    toggleComplete
}) {

    return (
        <div className="task-card">

            <div className="task-top">

                <h3>{task.title}</h3>

                <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                </span>

            </div>

            <div className="task-info">

                <p>
                    <strong>Due:</strong> {task.dueDate}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {task.completed
                        ? "Completed ✅"
                        : "Pending ⏳"
                    }
                </p>

            </div>

            <div className="task-buttons">

                <Link
                    to={`/projects/${projectId}/tasks/${task.id}/edit`}
                >
                    <button>Edit</button>
                </Link>

                <button
                    onClick={() => toggleComplete(task.id)}
                >
                    {task.completed
                        ? "Mark Pending"
                        : "Complete"
                    }
                </button>

                <button
                    onClick={() => deleteTask(task.id)}
                >
                    Delete
                </button>

            </div>

        </div>
    );
}