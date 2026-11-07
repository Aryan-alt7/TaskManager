
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import { TaskCard } from "./TaskCard";
import "./ProjectDetailsPage.css";

export function ProjectDetailsPage() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);


    const [task, setTask] = useState({
        title: "",
        priority: "LOW",
        dueDate: "",
        completed: false
    });


    const [loading, setLoading] = useState(true);


    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");


    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);


    const [sortOrder, setSortOrder] = useState("");

    // AI STATES
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [selectedSuggestions, setSelectedSuggestions] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSaving, setAiSaving] = useState(false);

    // =========================================
    // FETCH PROJECT + TASKS
    // =========================================

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("token");
        // Fetch project
        const projectResponse = await fetch(
            `https://taskmanager-production-1540.up.railway.app/projects/${id}`, {
            headers: { "Authorization": "Bearer " + token }
        }
        );

        if (!projectResponse.ok) {
            throw new Error("Failed to fetch project");
        }

        const projectData = await projectResponse.json();


        // Build pagination parameters
        const params = new URLSearchParams();

        params.set("page", currentPage);
        params.set("size", 5);

        if (sortOrder) {
            params.set(
                "sort",
                `dueDate,${sortOrder}`
            );
        }


        // Fetch tasks
        const taskResponse = await fetch(
            `https://taskmanager-production-1540.up.railway.app/projects/${id}/tasks?${params.toString()}`, {
            headers: { "Authorization": "Bearer " + token }
        }
        );

        if (!taskResponse.ok) {
            throw new Error("Failed to fetch tasks");
        }

        const tasksData = await taskResponse.json();


        // Return the data instead of changing state here
        return {
            projectData,
            tasksData
        };

    }, [id, currentPage, sortOrder]);


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        let cancelled = false;


        const loadData = async () => {

            try {

                const data = await fetchData();


                if (cancelled) {
                    return;
                }


                setProject(data.projectData);
                setTasks(data.tasksData.content);
                setTotalPages(data.tasksData.totalPages);
                setTotalTasks(data.tasksData.totalElements);

            }
            catch (e) {

                if (!cancelled) {
                    console.error(e);
                    alert("Failed to load project");
                }

            }
            finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };


        loadData();


        return () => {
            cancelled = true;
        };

    }, [fetchData]);


    // =========================================
    // HANDLE TASK INPUT
    // =========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setTask(prev => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================================
    // CREATE TASK
    // =========================================

    const createTask = async (e) => {

        e.preventDefault();


        if (task.title.trim() === "") {
            alert("Enter task title");
            return;
        }


        if (!task.dueDate) {
            alert("Enter task due date");
            return;
        }


        // Task cannot be after project deadline
        if (task.dueDate > project.dueDate) {

            alert(
                "Task due date cannot be after project due date"
            );

            return;
        }


        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `https://taskmanager-production-1540.up.railway.app/projects/${id}/tasks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify(task)
                }
            );


            if (!response.ok) {
                const error = await response.text();

                console.log("STATUS:", response.status);
                console.log("ERROR:", error);

                throw new Error("Failed to create task");
            }


            await response.json();


            // Clear form
            setTask({
                title: "",
                priority: "LOW",
                dueDate: "",
                completed: false
            });


            // Go back to first page
            setCurrentPage(0);


            // If already on page 0, refresh immediately.
            // Otherwise changing currentPage will trigger useEffect.
            if (currentPage === 0) {

                const data = await fetchData();

                setProject(data.projectData);
                setTasks(data.tasksData.content);
                setTotalPages(data.tasksData.totalPages);
                setTotalTasks(data.tasksData.totalElements);

            }


            alert("Task created successfully");

        }
        catch (e) {

            console.error(e);
            alert("Failed to create task");

        }

    };

    // =========================================
    // AI TASK GENERATOR
    // =========================================

    const generateAiTasks = async (e) => {
        e.preventDefault();

        if (aiPrompt.trim() === "") {
            alert("Write a prompt");
            return;
        }

        try {
            setAiLoading(true);
            setSelectedSuggestions([]);
            setAiSuggestions([]);

            const token = localStorage.getItem("token");
            console.log("Token exists:", !!token);
            console.log("Token length:", token ? token.length : 0);
            const response = await fetch(
                "https://taskmanager-production-1540.up.railway.app/ai/generate-tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        prompt: aiPrompt
                    })
                }
            );

            if (!response.ok) {
                const error = await response.text();

                console.error("AI STATUS:", response.status);
                console.error("AI RESPONSE:", error);
                console.error("AI HEADERS:", [...response.headers.entries()]);

                throw new Error(
                    `AI request failed with status ${response.status}: ${error}`
                );
            }

            const data = await response.json();

            setAiSuggestions(Array.isArray(data) ? data : []);

        } catch (e) {
            console.error(e);
            alert("Failed to generate AI tasks");
        } finally {
            setAiLoading(false);
        }
    };


    // Handle selecting and unselecting suggestions

    const toggleSuggestions = (index) => {
        setSelectedSuggestions(prev => {
            const current = Array.isArray(prev) ? prev : [];

            if (current.includes(index)) {
                return current.filter(i => i !== index);
            }

            return [...current, index];
        });
    };

    // =========================================
    // SAVE SELECTED AI TASKS
    // =========================================

    const saveSelectedTasks = async () => {

        if (selectedSuggestions.length === 0) {
            alert("Please select at least one task");
            return;
        }

        try {
            setAiSaving(true);

            const token = localStorage.getItem("token");

            let savedIndexes = [];
            let failedTasks = [];

            // Save selected tasks one by one
            for (const index of selectedSuggestions) {

                const suggestion = aiSuggestions[index];

                if (!suggestion) {
                    continue;
                }

                try {
                    const response = await fetch(
                        `https://taskmanager-production-1540.up.railway.app/ai/projects/${id}/save-task`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token
                            },
                            body: JSON.stringify(suggestion)
                        }
                    );

                    if (response.ok) {
                        savedIndexes.push(index);
                    } else {
                        const error = await response.text();

                        console.error(
                            "Failed to save:",
                            suggestion.title,
                            error
                        );

                        failedTasks.push(suggestion.title);
                    }

                } catch (error) {
                    console.error(error);
                    failedTasks.push(suggestion.title);
                }
            }

            // Remove successfully saved tasks from selection
            setSelectedSuggestions(prev =>
                prev.filter(index => !savedIndexes.includes(index))
            );

            // Refresh project and task data
            if (savedIndexes.length > 0) {

                const data = await fetchData();

                setProject(data.projectData);
                setTasks(data.tasksData.content);
                setTotalPages(data.tasksData.totalPages);
                setTotalTasks(data.tasksData.totalElements);

            }

            // Show result
            if (failedTasks.length === 0) {

                alert(`${savedIndexes.length} task(s) saved successfully!`);

            } else {

                alert(
                    `${savedIndexes.length} task(s) saved successfully.\n` +
                    `Failed to save: ${failedTasks.join(", ")}\n\n` +
                    `Check whether their due dates exceed the project deadline.`
                );

            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong while saving tasks");
        } finally {
            setAiSaving(false);
        }
    };


    // =========================================
    // DELETE TASK
    // =========================================

    const deleteTask = async (taskId) => {

        if (!window.confirm("Delete this task?")) {
            return;
        }


        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `https://taskmanager-production-1540.up.railway.app/tasks/${taskId}`,
                {
                    headers: { "Authorization": "Bearer " + token },
                    method: "DELETE"
                }
            );


            if (!response.ok) {
                throw new Error("Failed to delete task");
            }


            // If last task on page was deleted,
            // move to previous page if possible.
            if (tasks.length === 1 && currentPage > 0) {

                setCurrentPage(prev => prev - 1);

            }
            else {

                const data = await fetchData();

                setProject(data.projectData);
                setTasks(data.tasksData.content);
                setTotalPages(data.tasksData.totalPages);
                setTotalTasks(data.tasksData.totalElements);

            }


            alert("Task deleted successfully");

        }
        catch (e) {

            console.error(e);
            alert("Failed to delete task");

        }

    };


    // =========================================
    // TOGGLE COMPLETE
    // =========================================

    const toggleComplete = async (taskId) => {

        const selectedTask = tasks.find(
            task => task.id === taskId
        );


        if (!selectedTask) {
            return;
        }


        const updatedTask = {
            ...selectedTask,
            completed: !selectedTask.completed
        };


        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `https://taskmanager-production-1540.up.railway.app/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify(updatedTask)
                }
            );


            if (!response.ok) {
                throw new Error("Failed to update task");
            }


            await response.json();


            const data = await fetchData();

            setProject(data.projectData);
            setTasks(data.tasksData.content);
            setTotalPages(data.tasksData.totalPages);
            setTotalTasks(data.tasksData.totalElements);

        }
        catch (e) {

            console.error(e);
            alert("Failed to update task");

        }

    };


    // =========================================
    // SEARCH + FILTER
    // =========================================

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title
                .toLowerCase()
                .includes(search.toLowerCase());


        const matchesFilter =
            filter === "all" ||
            (filter === "active" && !task.completed) ||
            (filter === "completed" && task.completed);


        return matchesSearch && matchesFilter;

    });


    // =========================================
    // PAGINATION
    // =========================================

    const nextPage = () => {

        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }

    };


    const previousPage = () => {

        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <>
                <Navbar />
                <h1>Loading...</h1>
            </>
        );

    }


    if (!project) {

        return (
            <>
                <Navbar />
                <h1>Project not found</h1>
            </>
        );

    }


    // =========================================
    // UI
    // =========================================

    return (
        <>
            <Navbar />


            <div className="project-details-container">


                {/* ================= PROJECT INFO ================= */}

                <div className="project-header">

                    <div>

                        <h1>
                            {project.title}
                        </h1>

                        <p>
                            {project.description}
                        </p>

                    </div>


                    <button
                        onClick={() => navigate("/projects")}
                    >
                        Back to Projects
                    </button>

                </div>


                {/* ================= PROJECT INFO ================= */}

                <div className="project-info">

                    <p>
                        <strong>Status:</strong>{" "}

                        {project.completed
                            ? "Completed"
                            : "Active"}
                    </p>


                    <p>
                        <strong>Due:</strong>{" "}
                        {project.dueDate}
                    </p>


                    <p>
                        <strong>Total Tasks:</strong>{" "}
                        {totalTasks}
                    </p>

                </div>


                {/* ================= ADD TASK ================= */}

                <div className="add-task">

                    <h2>Add Task</h2>


                    <form onSubmit={createTask}>

                        <input
                            type="text"
                            name="title"
                            placeholder="Task title"
                            value={task.title}
                            onChange={handleChange}
                        />


                        <select
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                        >

                            <option value="LOW">
                                LOW
                            </option>

                            <option value="MEDIUM">
                                MEDIUM
                            </option>

                            <option value="HIGH">
                                HIGH
                            </option>

                        </select>


                        <input
                            type="date"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                        />


                        <button type="submit">
                            Add Task
                        </button>

                    </form>

                </div>

                {/* ================= AI TASK GENERATOR ================= */}

                <div className="ai-task-generator">

                    <h2>AI Task Generator</h2>

                    <form onSubmit={generateAiTasks}>

                        <textarea
                            placeholder="Describe what you want to accomplish..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />

                        <button type="submit" disabled={aiLoading}>
                            {aiLoading ? "Generating..." : "Generate Tasks"}
                        </button>

                    </form>

                    {aiSuggestions.length > 0 && (

                        <div className="ai-suggestions">

                            <h3>AI Suggestions</h3>

                            {aiSuggestions.map((suggestion, index) => (


                                <div key={index}
                                    className={`ai-suggestion-card ${selectedSuggestions.includes(index) ? "selected" : ""
                                        }`}>

                                    <input
                                        type="checkbox"
                                        checked={selectedSuggestions.includes(index)}
                                        onChange={() => toggleSuggestions(index)}
                                    />

                                    <div>
                                        <h4>{suggestion.title}</h4>

                                        <p>Priority: {suggestion.priority}</p>

                                        <p>Due Date: {suggestion.dueDate}</p>
                                    </div>

                                </div>

                            ))}

                            <p>
                                Selected: {
                                    Array.isArray(selectedSuggestions)
                                        ? selectedSuggestions.length
                                        : 0
                                }
                            </p>

                            <button
                                type="button"
                                onClick={saveSelectedTasks}
                                disabled={selectedSuggestions.length === 0 || aiSaving}
                            >
                                {aiSaving ? "Saving Tasks..." : "Save Selected Tasks"}
                            </button>

                        </div>

                    )}

                </div>


                {/* ================= SEARCH / FILTER ================= */}

                <div className="search-filter">

                    <input
                        type="text"
                        placeholder="Search tasks..."
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


                    <select
                        value={sortOrder}
                        onChange={e => {

                            setSortOrder(e.target.value);
                            setCurrentPage(0);

                        }}
                    >

                        <option value="">
                            Sort by Due Date
                        </option>

                        <option value="asc">
                            Earliest First
                        </option>

                        <option value="desc">
                            Latest First
                        </option>

                    </select>

                </div>


                {/* ================= TASKS ================= */}

                <div className="tasks-container">

                    {filteredTasks.length === 0 ? (

                        <div className="empty-tasks">

                            <h2>
                                No tasks found
                            </h2>

                            <p>
                                Try a different search/filter
                                or create a new task.
                            </p>

                        </div>

                    ) : (

                        filteredTasks.map(task => (

                            <TaskCard
                                key={task.id}
                                task={task}
                                projectId={id}
                                deleteTask={deleteTask}
                                toggleComplete={toggleComplete}
                            />

                        ))

                    )}

                </div>


                {/* ================= PAGINATION ================= */}

                {totalPages > 0 && (

                    <div className="pagination">

                        <button
                            onClick={previousPage}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>


                        <span>
                            Page {currentPage + 1} of {totalPages}
                        </span>


                        <button
                            onClick={nextPage}
                            disabled={
                                currentPage === totalPages - 1
                            }
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>

        </>
    );

}

