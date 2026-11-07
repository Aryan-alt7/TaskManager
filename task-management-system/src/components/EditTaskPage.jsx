import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./EditTaskPage.css";

export function EditTaskPage() {

    const { projectId, taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState({
        title: "",
        priority: "LOW",
        dueDate: "",
        completed: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchTask = async () => {
            try {
                const response = await fetch(`https://taskmanager-production-1540.up.railway.app/tasks/${taskId}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                if (!response.ok) {
                    throw new Error("failed to fetch task");
                }
                const data = await response.json();

                setTask({
                    title: data.title || "",
                    priority: data.priority || "LOW",
                    dueDate: data.dueDate || "",
                    completed: data.completed || false
                });
            }
            catch (e) {
                console.error(e);
                alert("failed to load task");
            }
            finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (task.title.trim() === "") {
            alert("Enter task title");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://taskmanager-production-1540.up.railway.app/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", 
                            "Authorization": "Bearer " + token
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                throw new Error("failed to update task");
            }

            await response.json();

            alert("Task updated successfully");

            navigate(`/projects/${projectId}`);
        }
        catch (e) {
            console.error(e);
            alert("Failed to update task");
        }

    };
    if (loading) {
        return <h1>Loading</h1>
    }

    return (
        <>
            <Navbar />

            <div className="edit-task-container">

                <h1>Edit Task</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="title"
                        placeholder="Task Title"
                        value={task.title}
                        onChange={handleChange}
                    />

                    <select
                        name="priority"
                        value={task.priority}
                        onChange={handleChange}
                    >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>

                    <input
                        type="date"
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/projects/${projectId}`)}
                    >
                        Cancel
                    </button>

                </form>

            </div>
        </>
    );
}