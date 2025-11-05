import { useEffect, useState } from "react";
import Navbar1 from "../Navbar/Navbar1";
import ProductCard from "./ProductCard";
import Footer from "../components/Footer";
import { FilterProductApi } from "../services/productSerives";

function ProductList() {
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // 👇 Build query params to send to backend
      const filters = {};
      if (selectedCategory !== "All") filters.category = selectedCategory;
      if (searchTerm.trim()) filters.name = searchTerm;

      const res = await FilterProductApi(filters);

      // Optional frontend sorting (or could handle on backend)
      let sortedData = [...res];
      if (sortOption === "lowToHigh") {
        sortedData.sort((a, b) => a.price - b.price);
      } else if (sortOption === "highToLow") {
        sortedData.sort((a, b) => b.price - a.price);
      }

      setProductList(sortedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Call backend whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortOption]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar1 />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1 bg-white p-5 rounded shadow h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Filters
            </h2>

            {/* Search Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                className="border px-3 py-2 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="All">All</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            {/* Sort */}
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">
                Sort By Price
              </label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="default">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="md:col-span-3">
            {loading ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : productList.length > 0 ? (
              <ProductCard productList={productList} />
            ) : (
              <p className="text-gray-600 text-center">No products found.</p>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductList;
