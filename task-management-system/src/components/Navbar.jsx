import { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";

export function Navbar() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchUsername = async () => {
            const response = await fetch("https://taskmanager-production-1540.up.railway.app/dashboard/username", {
                headers: { "Authorization": "Bearer " + token }
            })

            if (response.ok) {
                const name = await response.text();
                setUsername(name)
            }
        };

        fetchUsername();
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="navbar">

            <div className="logo">
                <h2>ProjectHub</h2>
            </div>


            <ul className="nav-links">

                <li>
                    <NavLink to="/">
                        Home
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/projects">
                        Projects
                    </NavLink>
                </li>

            </ul>


            <div className="nav-right">

                <button className="notification">
                    🔔
                </button>


                <div className="profile">

                    <span>{username}</span>

                </div>
                <button className="logout-button" onClick={handleLogout} > Logout </button>

            </div>

        </nav>
    );
}