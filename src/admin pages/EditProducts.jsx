import React, { useEffect, useState } from "react";
// import { Api } from "../commonapi/api";

function EditProduct({ id, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    quantity: "",
    description: "",
    image: "",
    image1: "",
    image2: "",
    image3: "",
  });

  const fetchProduct = async () => {
    try {
      const res = await Api.get(`/products/${id}`);
      setFormData(res.data);
      console.log("product res : ", res);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.put(`/products/${id}`, formData);
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/04/a7/1d/04a71d1f1ae885fb8207b4e31ff11532.jpg'",
        backgroundColor: "",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-6 w-full max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
            Edit Product
          </h2>

          {/* Main Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Image Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["image", "image1", "image2", "image3"].map((imgKey) => (
              <div key={imgKey}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {imgKey}
                </label>
                <input
                  type="text"
                  name={imgKey}
                  value={formData[imgKey]}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
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
