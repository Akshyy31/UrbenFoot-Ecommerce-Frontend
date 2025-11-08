import React, { useEffect, useState } from "react";
import { Ban, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { adminUserListApi, blockUserApi } from "../services/adminUserServices";

import swal from "sweetalert";

function Users() {
  const [userList, setUserList] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await adminUserListApi();
      setUserList(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";

    try {
      const confirm = await swal({
        title: `Are you sure?`,
        text: `You want to ${action} this user?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (confirm) {
        const res = await blockUserApi(id, action);
        swal(
          "Success",
          res.message || `User ${action}ed successfully!`,
          "success"
        );
        fetchUsers(); 
      }
    } catch (error) {
      console.error("Error updating user:", error);
      swal("Error", "Failed to update user status", "error");
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-auto p-4">
      <h5 className="text-3xl font-bold text-blue-600 mb-4">User Management</h5>

      {userList.length > 0 ? (
        <div className="overflow-auto rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 font-semibold uppercase">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-gray-700">{user.id}</td>
                  <td className="px-4 py-3 capitalize text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-4 py-3">
                    {user.blocked ? (
                      <span className="text-red-500 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <button
                        onClick={() => handleToggleBlock(user.id, user.blocked)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold text-white transition ${
                          user.blocked
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {user.blocked ? (
                          <>
                            <CheckCircle size={14} />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            Block
                          </>
                        )}
                      </button>

                      <Link
                        to={`/admin/users/${user.id}`}
                        className="px-3 py-2 rounded-md text-xs bg-blue-600 font-semibold hover:bg-blue-700 text-white no-underline"
                      >
                        View More
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">No users found.</p>
      )}
    </div>
  );
}

export default Users;
