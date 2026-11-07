import { useState } from "react";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./NewProjectPage.css";

export function NewProjectPage() {
    const navigate = useNavigate();
    const [project, setProject] = useState({
        title: "",
        description: "",
        completed: false,
        dueDate: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProject(prev => ({
            ...prev,
            [name]: name === "completed"
            ? value === "true" : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(project.title.trim() === "") {
            alert("Enter Project title");
            return;
        }


        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://taskmanager-production-1540.up.railway.app/projects/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(project)
            });

            if (!response.ok) {
                throw new Error("failed to create project");
            }

            const createdProject = await response.json();
            if(createdProject.dueDate == null) {
                alert("enter the due date");
                throw new Error("enter the due date");
            }
            console.log(createdProject);
            
            alert("project created successfully");
            navigate("/projects");
            setProject({
                title: "",
                description: "",
                completed: false,
                dueDate: ""
            });
        }
        catch (e) {
            console.error(e);
        }

   
    };

    return (
        <>
            <Navbar />

            <div className="new-project-container">

                <h1>Create New Project</h1>

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
                        name="status"
                        value={project.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>

                    <input
                        type="date"
                        name="dueDate"
                        value={project.dueDate}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Create Project
                    </button>

                </form>

            </div>
        </>
    );
}