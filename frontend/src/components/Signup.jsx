import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
    setServerError("");
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.msg || "Something went wrong");
        return;
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setFormData({ name: "", email: "", password: "" });
      navigate("/dashboard"); // change to your route

    } catch (err) {
      setServerError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Create Your ShareDocs Account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          {errors.password && <p style={styles.error}>{errors.password}</p>}

          {serverError && <p style={styles.error}>{serverError}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.loginText}>
          Already have an account?
          <button onClick={() => navigate("/login")} style={styles.linkButton}>
            Login
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
    backgroundImage: "url('https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "Arial",
    fontSize: "24px",
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
    border: "1px solid #aaa",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "-10px",
  },
  button: {
    padding: "14px",
    backgroundColor: "black",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    opacity: 1,
  },
  loginText: {
    textAlign: "center",
    marginTop: "15px",
    fontSize: "14px",
  },
  linkButton: {
    marginLeft: "6px",
    color: "blue",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  },
};