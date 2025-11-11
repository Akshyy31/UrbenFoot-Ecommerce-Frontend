import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { ContactApi } from "../services/productSerives"; // adjust path if needed

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    else if (formData.subject.trim().length < 3)
      newErrors.subject = "Subject must be at least 3 characters";

    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await ContactApi(formData);
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 4000);
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-10 px-4 text-center md:text-left">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold m-3">Get In Touch</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
            Have questions about our shoes? Need help with sizing? Our team is
            here to help you step forward with confidence.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg md:p-10">
            <h2 className="text-3xl font-bold text-slate-800 m-3">
              Send Us a Message
            </h2>

            {submitted && (
              <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-5 flex items-center gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0"
                  size={24}
                />
                <div>
                  <p className="text-green-800 font-semibold">
                    Message sent successfully!
                  </p>
                  <p className="text-green-700 text-sm">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {["name", "email", "subject"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 p-2 capitalize">
                    {field} *
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={
                      field === "email"
                        ? "you@example.com"
                        : field === "subject"
                        ? "Product inquiry, sizing help..."
                        : "John Doe"
                    }
                    className={`w-full m-2 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                      errors[field] ? "border-red-400" : "border-slate-200"
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 p-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  className={`w-full m-2 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none ${
                    errors.message ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-5 space-y-6">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Contact Information
              </h2>

              {[
                {
                  icon: <Phone className="text-slate-700" size={24} />,
                  title: "Phone",
                  lines: ["8943945360", "Mon-Fri 9AM-6PM IST"],
                },
                {
                  icon: <Mail className="text-slate-700" size={24} />,
                  title: "Email",
                  lines: ["Urbanfoot@shoestore.com", "Replies within 24 hours"],
                },
                {
                  icon: <MapPin className="text-slate-700" size={24} />,
                  title: "Store Location",
                  lines: ["123 Fashion Avenue", "Kozhikode, Kerala"],
                },
                {
                  icon: <Clock className="text-slate-700" size={24} />,
                  title: "Store Hours",
                  lines: ["Mon-Sat: 10AM - 8PM", "Sunday: 11AM - 6PM"],
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-slate-100 p-3 m-3 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {item.title}
                    </h3>
                    {item.lines.map((line, j) => (
                      <p key={j} className="text-slate-600 text-sm">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl shadow-lg p-5">
              <h3 className="text-2xl font-bold mb-4">Quick Help</h3>
              <div className="space-y-3">
                {[
                  ["Need sizing help?", "Check our size guide for perfect fit"],
                  ["Track your order", "Get real-time delivery updates"],
                  ["Return policy", "30-day hassle-free returns"],
                ].map(([title, desc], i) => (
                  <div
                    key={i}
                    className="border-l-4 border-slate-400 pl-4 hover:translate-x-1 transition-transform"
                  >
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-slate-300">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-2xl p-5 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold m-3">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Our customer service team is always ready to help. Whether you need
            product recommendations, sizing advice, or order assistance, we're
            just a message away.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold">
              Avg Response Time: 2 Hours
            </div>
            <div className="bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold">
              Customer Satisfaction: 98%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
