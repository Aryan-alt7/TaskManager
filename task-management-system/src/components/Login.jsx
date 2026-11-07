import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"

export function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        const response = await fetch("https://taskmanager-production-1540.up.railway.app/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const token = await response.text();

            localStorage.setItem("token", token);

            alert("Login successful");
            navigate("/");
        }
        else {
            alert("Invalid Username or password");
        }
    }
    return (
        <div className="login-page">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <input type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <br />

                <div className="password-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        className="eye-button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <br />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}