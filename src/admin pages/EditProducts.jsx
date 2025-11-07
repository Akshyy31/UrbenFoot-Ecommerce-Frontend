import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../Common API/api";
import { adminEditGetProductApi, adminEditProductApi } from "../services/adminProductServices";

function EditProduct({ id, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    quantity: "",
    description: "",
    image: null,
    image1: null,
    image2: null,
    image3: null,
  });

  // ✅ Fetch product details
  const fetchProduct = async () => {
    try {
      const data = await adminEditGetProductApi(id);
      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        category: data.category?.name || "",
        price: data.price || "",
        stock: data.stock || "",
        quantity: data.quantity || "",
        description: data.description || "",
        image: null,
        image1: null,
        image2: null,
        image3: null,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle submit (update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }

      await api.patch(`adminside/product/management/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
            Edit Product
          </h2>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["name", "brand", "category", "price", "stock", "quantity"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type={key === "price" || key === "quantity" ? "number" : "text"}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["image", "image1", "image2", "image3"].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="file"
                  name={key}
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-sm"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
 