import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../contextapi/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      toast.error("Please fill both username and password.");
      return;
    }

    const user = await loginUser(username, password);
    console.log("user for admin", user);

    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 p-5">
      <div className="bg-white rounded-2xl shadow-xl flex max-w-4xl w-full overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?fm=jpg&q=60&w=1000"
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-5">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 font-medium text-sm"
              >
                Username
              </label>
              <input
                id="username"
                name="username" // match the state key
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your username or email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-sm"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-5 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-black font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
