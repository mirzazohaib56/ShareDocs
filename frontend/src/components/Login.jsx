import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be 8 characters long");
      return;
    }

    setError("");
    navigate("/main");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.signupText}>
          Don't have an account?
          <button onClick={() => navigate("/")} style={styles.linkButton}>
            Signup
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    // 🔐 Login related background
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
      url('https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "12px",

    // 🔥 glass effect
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",

    boxShadow: "0 0 25px rgba(0,0,0,0.3)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "Arial",
    fontSize: "26px",
    fontWeight: "bold",
    color: "#000",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    padding: "14px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
  },

  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
    textAlign: "center",
  },

  signupText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
    color: "#000",
  },

  linkButton: {
    marginLeft: "6px",
    color: "#007bff",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  },
};