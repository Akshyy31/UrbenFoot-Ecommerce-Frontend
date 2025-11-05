import React, { useState } from "react";
// import { Api } from "../commonapi/api";
import { toast } from "react-toastify";

function AddProducts({ onClose, onAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    image1: "",
    image2: "",
    image3: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: 1,
      isNew: "new",
    };

    try {
      await Api.post("/products", newProduct);
      toast.success("Product added!");
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        quantity:"",
        description: "",
        image: "",
        image1: "",
        image2: "",
        image3: "",
      });
      onAdded();   // Refresh product list
      onClose();   // Close the form
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 mb-6 rounded shadow"
    >
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="border p-2 rounded"
        required
      />
      <input
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        placeholder="Brand"
        className="border p-2 rounded"
        required
      />
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="border p-2 rounded"
        required
      />
      <input
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock Status"
        className="border p-2 rounded"
        required
      />
      <input
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        className="border p-2 rounded"
        required
      />
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Main Image URL"
        className="border p-2 rounded"
        required
      />
      <input
        name="image1"
        value={formData.image1}
        onChange={handleChange}
        placeholder="Image 1 URL"
        className="border p-2 rounded"
      />
      <input
        name="image2"
        value={formData.image2}
        onChange={handleChange}
        placeholder="Image 2 URL"
        className="border p-2 rounded"
      />
      <input
        name="image3"
        value={formData.image3}
        onChange={handleChange}
        placeholder="Image 3 URL"
        className="border p-2 rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Product Description"
        rows="3"
        className="border p-2 rounded col-span-full"
        required
      />
      <div className="col-span-full flex gap-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddProducts;
