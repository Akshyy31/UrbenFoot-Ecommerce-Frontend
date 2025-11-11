import { React, useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import Navbar1 from "../Navbar/Navbar1";
import ProductCard from "../products/ProductCard";
// import { Api } from "../commonapi/api";
import api from "../Common API/api";
import { Heart } from "lucide-react";
import HeroBanner from "./HeroBanner";
import HomeCard from "../Home_page_Card/HomeCard";
import CategoryHome from "../Home_page_Card/CategoryHome";
import About from "../About/About";
import AuthContext from "../contextapi/AuthContext";
import { userProfile } from "../services/userServices";

function Home() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  if (currentUser && currentUser.role === "admin") {
    navigate("/admin/dashboard");
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      userProfile()
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching user", err));
    }
  }, []);

  return (
    <div>
      <Navbar1 />
      <HeroBanner />

      <CategoryHome />

      <div className=" mx-auto px-4 py-10 bg-gray-100">
        <div className="font-bold text-3xl text-zinc-700 p-4">
          Most Ordered Products
        </div>

        <div className="bg-[#85929f] rounded-xl p-5 text-center text-white mb-10">
          <HomeCard />

          <p className="text-lg text-black max-w-2xl mx-auto mb-7">
            Discover our full range of Collections
          </p>
          <button
            onClick={() => navigate("/productlist")}
            className="bg-black text-white font-semibold text-base px-2 py-2 rounded-full shadow-md transition-all duration-300"
          >
            Browse All Products
          </button>
        </div>
        <About />

        {/* VIEW FULL COLLECTION */}
        {/* <div className="flex justify-center mt-10">
          <Link
            to={`/productlist`}
            className="inline-block mt-3 text-xs font-medium text-white !bg-black px-3 py-2 rounded hover:bg-gray-800 transition"
          >
            View More Collection
          </Link>
        </div> */}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
