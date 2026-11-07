
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Link } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";
import "./ProjectsPage.css";

export function ProjectsPage() {

    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH PROJECTS
    // =========================================

    useEffect(() => {

        const fetchProjects = async () => {

            try {
                const token = localStorage.getItem("token");
                const response = await fetch("https://taskmanager-production-1540.up.railway.app/projects/", {
                    headers: { "Authorization": "Bearer " + token }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const data = await response.json();

                setProjects(data);

            }
            catch (e) {

                console.error(e);
                alert("Failed to fetch projects");

            }
            finally {

                setLoading(false);

            }

        };

        fetchProjects();

    }, []);


    // =========================================
    // SEARCH + FILTER
    // =========================================

    const filteredProjects = projects.filter(project => {

        const matchesSearch =
            project.title
                .toLowerCase()
                .includes(search.toLowerCase());


        const matchesFilter =
            filter === "all" ||
            (filter === "active" && !project.completed) ||
            (filter === "completed" && project.completed);


        return matchesSearch && matchesFilter;

    });


    // =========================================
    // DELETE PROJECT
    // =========================================

    const deleteProject = async (id) => {

        if (!window.confirm("Delete this project?")) {
            return;
        }


        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://taskmanager-production-1540.up.railway.app/projects/${id}`, {
                headers: { "Authorization": "Bearer " + token },
                method: "DELETE"
            });


            if (!response.ok) {
                throw new Error("Failed to delete project");
            }


            setProjects(prevProjects =>
                prevProjects.filter(
                    project => project.id !== id
                )
            );


            alert("Project deleted successfully");

        }
        catch (e) {

            console.error(e);
            alert("Failed to delete project");

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <h1>
                    Loading projects...
                </h1>
            </>
        );

    }


    // =========================================
    // UI
    // =========================================

    return (
        <>
            <Navbar />

            <div className="projects-container">


                {/* ================= HEADER ================= */}

                <div className="projects-header">

                    <div>

                        <h1>
                            My Projects ({filteredProjects.length})
                        </h1>

                        <p>
                            Create and manage all your projects.
                        </p>

                    </div>


                    <Link to="/projects/new">

                        <button className="new-project-btn">
                            + New Project
                        </button>

                    </Link>

                </div>


                {/* ================= SEARCH + FILTER ================= */}

                <div className="search-filter">

                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                    />


                    <select
                        value={filter}
                        onChange={e =>
                            setFilter(e.target.value)
                        }
                    >

                        <option value="all">
                            All
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                    </select>

                </div>


                {/* ================= PROJECTS ================= */}

                <div className="projects-grid">

                    {projects.length === 0 ? (

                        <div className="empty-projects">

                            <h2>
                                No Projects Yet
                            </h2>

                            <p>
                                Create your first project.
                            </p>

                            <Link to="/projects/new">

                                <button>
                                    Create Project
                                </button>

                            </Link>

                        </div>

                    ) : filteredProjects.length === 0 ? (

                        <div className="empty-projects">

                            <h2>
                                No matching projects
                            </h2>

                            <p>
                                Try a different search or filter.
                            </p>

                        </div>

                    ) : (

                        filteredProjects.map(project => (

                            <ProjectCard
                                key={project.id}
                                project={project}
                                deleteProject={deleteProject}
                            />

                        ))

                    )}

                </div>

            </div>
        </>
    );
}

