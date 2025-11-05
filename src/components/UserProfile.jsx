import React, { useContext, useEffect, useState } from "react";
import api from "../Common API/api";
import AuthContext from "../contextapi/AuthContext";
import Swal from "sweetalert2";
import { changePasswordApi, userProfile } from "../services/userServices";

function UserProfile() {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  console.log("userData   :  ", userData);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await userProfile();
        setUserData(res);
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Change Password",
      html: `
      <input id="old-password" type="password" class="swal2-input" placeholder="Old password" />
      <input id="new-password" type="password" class="swal2-input" placeholder="New password (min 6 chars)" />
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const oldPassword = document.getElementById("old-password").value;
        const newPassword = document.getElementById("new-password").value;

        if (!oldPassword || !newPassword) {
          Swal.showValidationMessage("Both fields are required");
          return false;
        }
        if (newPassword.length < 6) {
          Swal.showValidationMessage(
            "New password must be at least 6 characters"
          );
          return false;
        }

        return { oldPassword, newPassword };
      },
    });

    if (formValues) {
      try {
        // Make API call to your Django endpoint
        const response = await changePasswordApi({
          old_password: formValues.oldPassword,
          new_password: formValues.newPassword,
        });

        Swal.fire(
          "Success!",
          response.message || "Password changed successfully",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "Failed to change password",
          "error"
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5 m-5 mt-10 bg-blue-300 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
          Profile Information
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* Left: Profile Image */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-56 h-56 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center shadow-inner">
            <img
              src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
              alt="user_profile"
              className="w-56 h-56 object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <div className="bg-gray-50 p-2 rounded-xl">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </span>
              <p className="font-semibold text-gray-800 mt-1">
                {userData.user.first_name + " " + userData.user.last_name}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-xl">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </span>
              <p className="font-semibold text-gray-800 mt-1">
                {userData.user.email}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-xl">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </span>
              <p className="font-semibold text-gray-800 mt-1">
                {userData.user.phone}
              </p>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8">
            <h5 className="text-lg font-semibold text-gray-700 p-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Account Security
            </h5>
            <div className="">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Change Password
                  </p>
                </div>
                <button
                  onClick={handleChangePassword}
                  className="text-sm text-white bg-blue-600 px-3 py-2 hover:text-blue-00 font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
