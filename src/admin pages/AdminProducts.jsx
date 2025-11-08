import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import AddProducts from "./Addproducts";
import EditProduct from "./EditProducts";
import swal from "sweetalert";
import {
  adminDeleteProductApi,
  adminProductListApi,
} from "../services/adminProductServices";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [editProductId, setEditProductId] = useState(null);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [total, setTotal] = useState(0);

  // 🧩 Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await adminProductListApi(page, searchName, selectedCategory);
      setProducts(res.products || []);
      setNext(res.next);
      setPrev(res.previous);
      setTotal(res.count);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchName, selectedCategory]);

  // 🧹 Refresh after closing edit modal
  const closeEditModal = () => {
    setEditProductId(null);
    fetchProducts();
  };

  // 👁 View product details
  const handleViewProduct = (product) => {
    swal({
      title: product.name,
      content: createProductContent(product),
      buttons: ["Close"],
    });
  };

  const createProductContent = (product) => {
    const container = document.createElement("div");
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <img src="${product.image}" alt="${product.name}" style="width: 200px; height: auto; border-radius: 8px;" />
      </div>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Description:</strong> ${product.description}</p>
    `;
    return container;
  };

  // ❌ Delete product
  const handleDeleteProduct = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await adminDeleteProductApi(id);
          setProducts((prev) => prev.filter((p) => p.id !== id)); // remove immediately
          swal("Deleted!", "The product has been removed.", "success");
        } catch (error) {
          console.error("Delete failed:", error);
          swal("Oops!", "Failed to delete product.", "error");
        }
      }
    });
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-gray-800">Products List</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {showAddForm ? "Close Form" : "Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <AddProducts
          onClose={() => setShowAddForm(false)}
          onAdded={fetchProducts}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-3">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/3"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/3"
        >
          <option value="ALL">All Categories</option>
          <option value="MEN">Men</option>
          <option value="WOMEN">Women</option>
          <option value="KIDS">Kids</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto p-3">
        <table className="min-w-full bg-white border rounded-xl shadow-md">
          <thead className="bg-white border">
            <tr className="text-left text-gray-700 text-sm">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">ID</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-2 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-gray-800 font-medium">{product.name}</p>
                  </div>
                </td>
                <td className="p-3 text-sm">₹{product.price}</td>
                <td className="p-3 text-sm">#{product.id}</td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock.toLowerCase() === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded"
                  >
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setEditProductId(product.id)}
                    className="bg-yellow-100 hover:bg-yellow-200 p-2 rounded"
                  >
                    <Pencil size={16} className="text-yellow-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-100 hover:bg-red-200 p-2 rounded"
                  >
                    <Trash size={16} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-gray-500 text-center py-6">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={!prev}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 rounded ${
            !prev ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Prev
        </button>

        <span className="px-3 py-1">Page {page}</span>

        <button
          disabled={!next}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 rounded ${
            !next ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
              onClick={closeEditModal}
            >
              ×
            </button>
            <EditProduct id={editProductId} onClose={closeEditModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
