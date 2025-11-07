import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { adminAddProductApi, categoryViewApi } from "../services/adminProductServices";

function AddProducts({ onClose, onAdded }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "available",
    quantity: "",
    description: "",
    image: null,
    image1: null,
    image2: null,
    image3: null,
    is_new: false,
  });

  // Fetch categories
  useEffect(() => {
    categoryViewApi()
      .then((res) => setCategories(res))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("category", formData.category);
      data.append("price", parseFloat(formData.price));
      data.append("stock", formData.stock);
      data.append("quantity", parseInt(formData.quantity));
      data.append("description", formData.description);
      data.append("is_new", formData.is_new);

      if (formData.image) data.append("image", formData.image);
      if (formData.image1) data.append("image1", formData.image1);
      if (formData.image2) data.append("image2", formData.image2);
      if (formData.image3) data.append("image3", formData.image3);

      await adminAddProductApi(data);

      toast.success("Product added successfully!");
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "available",
        quantity: "",
        description: "",
        image: null,
        image1: null,
        image2: null,
        image3: null,
        is_new: false,
      });
      onAdded();
      onClose();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Failed to add product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded shadow grid gap-4"
    >
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
        className="border p-2 rounded"
      />

      <input
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        placeholder="Brand"
        required
        className="border p-2 rounded"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
        className="border p-2 rounded"
      />

      <select
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      >
        <option value="available">Available</option>
        <option value="not_available">Not Available</option>
      </select>

      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
        className="border p-2 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_new"
          checked={formData.is_new}
          onChange={handleChange}
        />
        New Product
      </label>

      {/* File inputs restricted to image selection only */}
      <label>Upload Images (only .jpg, .png, etc.):</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="image1"
        accept="image/*"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="image2"
        accept="image/*"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="image3"
        accept="image/*"
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        rows="3"
        required
        className="border p-2 rounded"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddProducts;
