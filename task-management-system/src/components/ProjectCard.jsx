
import { Link } from "react-router-dom";
import "./ProjectsPage.css";

export function ProjectCard({ project, deleteProject }) {

    const status = project.completed
        ? "Completed"
        : "Active";


    return (
        <div className="project-card">

            {/* ================= PROJECT TITLE ================= */}

            <h2>
                {project.title}
            </h2>


            {/* ================= DESCRIPTION ================= */}

            <p>
                {project.description}
            </p>


            {/* ================= STATUS ================= */}

            <div className="project-status">

                <span>
                    Status: {status}
                </span>

            </div>


            {/* ================= DEADLINE ================= */}

            <p className="deadline">

                {project.completed
                    ? "Project Completed"
                    : `Due: ${project.dueDate}`}

            </p>


            {/* ================= BUTTONS ================= */}

            <div className="card-buttons">

                <Link to={`/projects/edit/${project.id}`}>

                    <button>
                        Edit
                    </button>

                </Link>


                <button
                    onClick={() => deleteProject(project.id)}
                >
                    Delete
                </button>


                <Link to={`/projects/${project.id}`}>

                    <button>
                        Open
                    </button>

                </Link>

            </div>

        </div>
    );
}

