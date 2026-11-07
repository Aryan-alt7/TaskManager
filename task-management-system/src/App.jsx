import { Home } from './components/Home';
import { NewProjectPage } from './components/NewProjectPage';
import { ProjectDetailsPage } from './components/ProjectDetailsPage';
import { ProjectEditPage } from "./components/ProjectEditPage";
import { ProjectsPage } from './components/ProjectsPage';
import { EditTaskPage } from "./components/EditTaskPage"
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Register } from './components/Register';
import './App.css'
// import { useEffect, useState } from 'react';

function App() {

  // const [projects, setProjects] = useState([]);
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await fetch("https://taskmanager-production-1540.up.railway.app/projects/");

  //       if (!response.ok) throw new Error("failed to fetch projects");

  //       const data = await response.json();
  //       setProjects(data);
  //     }
  //     catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   fetchProjects();
  // }, []);


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/projects' element={<ProjectsPage />} />
        <Route path='/projects/new' element={<NewProjectPage />} />
        <Route path='/projects/:id' element={<ProjectDetailsPage />} />
        <Route path="/projects/:projectId/tasks/:taskId/edit" element={<EditTaskPage />} />
        <Route path="/projects/edit/:id" element={<ProjectEditPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App
