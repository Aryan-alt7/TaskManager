import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import "./ProjectEditPage.css";

export function ProjectEditPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    // Form state
    const [project, setProject] = useState({
        title: "",
        description: "",
        completed: false,
        dueDate: ""
    });

    const [loading, setLoading] = useState(true);

    // =========================
    // FETCH PROJECT
    // =========================

    useEffect(() => {

        const fetchProject = async () => {

            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `https://taskmanager-production-1540.up.railway.app/projects/${id}`, {
                        headers: {"Authorization": "Bearer " + token}
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch project");
                }

                const data = await response.json();

                setProject({
                    title: data.title || "",
                    description: data.description || "",
                    completed: data.completed || false,
                    dueDate: data.dueDate || ""
                });

            }
            catch (e) {

                console.error(e);
                alert("Failed to fetch project");

            }
            finally {

                setLoading(false);

            }

        };

        fetchProject();

    }, [id]);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProject(prev => ({
            ...prev,
            [name]:
                name === "completed"
                    ? value === "true"
                    : value
        }));

    };


    // =========================
    // UPDATE PROJECT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Validate title
        if (project.title.trim() === "") {
            alert("Enter project title");
            return;
        }

        // Validate description
        if (project.description.trim() === "") {
            alert("Enter project description");
            return;
        }

        // Validate due date
        if (!project.dueDate) {
            alert("Enter project due date");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `https://taskmanager-production-1540.up.railway.app/projects/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify(project)
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to update project"
                );

            }

            await response.json();

            alert("Project updated successfully");

            navigate("/projects");

        }
        catch (e) {

            console.error(e);

            alert("Failed to update project");

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <>
                <Navbar />
                <h1>Loading...</h1>
            </>
        );

    }


    // =========================
    // UI
    // =========================

    return (
        <>
            <Navbar />

            <div className="project-edit-container">

                <h1>Edit Project</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="title"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Project Description"
                        value={project.description}
                        onChange={handleChange}
                    />

                    <select
                        name="completed"
                        value={project.completed}
                        onChange={handleChange}
                    >

                        <option value="false">
                            Active
                        </option>

                        <option value="true">
                            Completed
                        </option>

                    </select>

                    <input
                        type="date"
                        name="dueDate"
                        value={project.dueDate}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/projects")}
                    >
                        Cancel
                    </button>

                </form>

            </div>
        </>
    );
}