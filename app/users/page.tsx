"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  UserCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Show notification and auto-dismiss
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showNotification("error", "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    if (!name || !email) {
      showNotification("error", "Please fill in both name and email");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers: { "Content-Type": "application/json" },
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setName("");
      setEmail("");
      showNotification("success", "User added successfully");
    } catch (error) {
      console.error("Failed to add user:", error);
      showNotification("error", "Failed to add user");
    }
  };

  const updateUser = async () => {
    if (!name || !email) {
      showNotification("error", "Please fill in both name and email");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ id: editUserId, name, email }),
        headers: { "Content-Type": "application/json" },
      });
      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user.id === editUserId ? updatedUser : user))
      );
      setName("");
      setEmail("");
      setEditUserId(null);
      showNotification("success", "User updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);
      showNotification("error", "Failed to update user");
    }
  };

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await fetch("/api/users", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      setUsers(users.filter((user) => user.id !== id));
      showNotification("success", "User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      showNotification("error", "Failed to delete user");
    }
  };

  const cancelEdit = () => {
    setEditUserId(null);
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Notification Area */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 
            ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="inline-block mr-2 -mt-1" />
          ) : (
            <AlertCircle className="inline-block mr-2 -mt-1" />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
          <h1 className="text-4xl font-bold text-white text-center flex items-center justify-center space-x-3">
            <UserPlus className="h-10 w-10" />
            <span>User Management</span>
          </h1>
        </div>

        <div className="p-8">
          <form className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 md:col-span-1"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 md:col-span-1"
            />

            <div className="flex space-x-2 md:col-span-1">
              {editUserId ? (
                <>
                  <button
                    type="button"
                    onClick={updateUser}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <UserCheck className="h-5 w-5" />
                    <span>Update</span>
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={addUser}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Add User</span>
                </button>
              )}
            </div>
          </form>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center justify-between">
              <span>User List</span>
              <button
                onClick={fetchUsers}
                disabled={isLoading}
                className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse flex justify-center items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center">
                <UserPlus className="h-16 w-16 text-gray-300 mb-4" />
                <p>No users found. Add a new user to get started.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="bg-gray-100 p-4 rounded-lg flex items-center justify-between hover:shadow-md transition duration-300 group"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                        {user.name}
                      </p>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        href={`/users/${user.id}`}
                        className="text-blue-500 hover:text-blue-700 transition duration-300 opacity-0 group-hover:opacity-100"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => {
                          setEditUserId(user.id);
                          setName(user.name);
                          setEmail(user.email);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition duration-300 opacity-0 group-hover:opacity-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 transition duration-300 opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
