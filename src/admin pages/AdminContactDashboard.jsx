import React, { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  Eye,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  Archive,
} from "lucide-react";
import { messageViewAPi } from "../services/adminProductServices";

export default function AdminContactDashboard() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ✅ Fetch messages
  useEffect(() => {
    messageViewAPi()
      .then((res) => {
        console.log("API response:", res);
        // If backend returns an array, use it directly
        // If it's wrapped in {data: [...]}, adjust accordingly
        
        setMessages(res.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  // ✅ Delete message (frontend only)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setMessages(messages.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const stats = {
    total: messages.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3">
        <h1 className="text-2xl font-semibold text-gray-800">
          Contact Messages
        </h1>
        <p className="text-gray-500 text-sm">Manage customer inquiries</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Messages</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">
                {stats.total}
              </p>
            </div>
            <Mail size={28} className="text-blue-500" />
          </div>
        </div>

        {/* Messages Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Message List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-2 border-b bg-gray-50 font-medium">
              Messages ({messages.length})
            </div>
            <div className="max-h-[70vh] overflow-y-auto divide-y">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail size={40} className="mx-auto mb-2 text-gray-300" />
                  No messages found
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedMessage?.id === msg.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm text-gray-800">
                        {msg.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {msg.subject}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            {selectedMessage ? (
              <>
                <div className="px-5 py-3 border-b bg-gray-50 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {selectedMessage.subject}
                    </h2>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="text-blue-600" size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-800">
                          {selectedMessage.name}
                        </span>
                        <span className="text-gray-500">
                          {new Date(
                            selectedMessage.created_at
                          ).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedMessage.email}
                      </p>
                      <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                <Eye size={48} className="mb-2 text-gray-300" />
                <p className="text-sm">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
