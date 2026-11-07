
import { Link } from "react-router-dom";
import "./Home.css";
import { Navbar } from "./Navbar";
import { useEffect, useState } from "react";

export function Home() {

    const [projects, setProjects] = useState([]);

    const [stats, setStats] = useState({
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        dueToday: 0
    });

    const [upcomingTasks, setUpcomingTasks] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchDashboard = async () => {

            try {
                const token = localStorage.getItem("token");
                // Fetch projects
                const projectResponse =
                    await fetch("https://taskmanager-production-1540.up.railway.app/projects/", {
                        headers: {"Authorization": "Bearer " + token}
                    });
                console.log("PROJECT STATUS:", projectResponse.status);

                if (!projectResponse.ok) {
                    throw new Error("Failed to fetch projects");
                }

                const projectData = await projectResponse.json();


                // Fetch dashboard statistics
                const statsResponse =
                    await fetch("https://taskmanager-production-1540.up.railway.app/dashboard/stats", {
                        headers: {"Authorization": "Bearer " + token}
                    });
                console.log("STATS STATUS:", statsResponse.status);
                if (!statsResponse.ok) {
                    throw new Error("Failed to fetch dashboard stats");
                }

                const statsData = await statsResponse.json();


                // Fetch upcoming tasks
                const upcomingResponse =
                    await fetch("https://taskmanager-production-1540.up.railway.app/dashboard/upcoming", {
                        headers: {"Authorization": "Bearer " + token}
                    });
                console.log("UPCOMING STATUS:", upcomingResponse.status);
                if (!upcomingResponse.ok) {
                    throw new Error("Failed to fetch upcoming tasks");
                }

                const upcomingData = await upcomingResponse.json();


                setProjects(projectData);
                setStats(statsData);
                setUpcomingTasks(upcomingData);

            }
            catch (e) {
                console.error(e);
                alert("Failed to load dashboard");
            }
            finally {
                setLoading(false);
            }
        };

        fetchDashboard();

    }, []);


    if (loading) {
        return (
            <>
                <Navbar />
                <h1>Loading...</h1>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <div className="home-container">

                {/* Header */}

                <div className="home-header">

                    <div>
                        <h1>Dashboard</h1>
                        <p>Manage your projects and tasks.</p>
                    </div>

                    <Link to="/projects/new">
                        <button className="new-project-btn">
                            + New Project
                        </button>
                    </Link>

                </div>


                {/* Statistics */}

                <div className="stats-container">

                    <div className="stat-card">
                        <h3>Total Projects</h3>
                        <p>{stats.totalProjects}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <p>{stats.totalTasks}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Completed Tasks</h3>
                        <p>{stats.completedTasks}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Due Today</h3>
                        <p>{stats.dueToday}</p>
                    </div>

                </div>


                {/* Recent Projects */}

                <div className="home-section">

                    <div className="section-header">
                        <h2>Recent Projects</h2>

                        <Link to="/projects">
                            View All
                        </Link>
                    </div>


                    {projects.length === 0 ? (

                        <div className="empty-projects">

                            <h2>No Projects Yet</h2>

                            <p>Create your first project.</p>

                            <Link to="/projects/new">
                                <button>
                                    Create Project
                                </button>
                            </Link>

                        </div>

                    ) : (

                        <div className="recent-projects">

                            {projects.slice(0, 5).map(project => (

                                <div
                                    className="home-project-card"
                                    key={project.id}
                                >

                                    <h3>{project.title}</h3>

                                    <p>
                                        {project.description}
                                    </p>

                                    <span>
                                        {project.completed
                                            ? "Completed"
                                            : "Active"}
                                    </span>

                                    <p>
                                        Due: {project.dueDate}
                                    </p>

                                    <Link
                                        to={`/projects/${project.id}`}
                                    >
                                        Open Project →
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* Upcoming Tasks */}

                <div className="home-section">

                    <div className="section-header">

                        <h2>Upcoming Tasks</h2>

                    </div>


                    {upcomingTasks.length === 0 ? (

                        <div className="empty-projects">

                            <h2>No Upcoming Tasks 🎉</h2>

                            <p>
                                You have no pending tasks.
                            </p>

                        </div>

                    ) : (

                        <div className="recent-projects">

                            {upcomingTasks.map(task => (

                                <div
                                    className="home-project-card"
                                    key={task.id}
                                >

                                    <h3>{task.title}</h3>

                                    <p>
                                        <strong>Priority:</strong>{" "}
                                        {task.priority}
                                    </p>

                                    <p>
                                        <strong>Due:</strong>{" "}
                                        {task.dueDate}
                                    </p>

                                    <p>
                                        Status: Pending ⏳
                                    </p>

                                    <Link
                                        to={`/projects/${task.projectId}`}
                                    >
                                        Open Project →
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}

