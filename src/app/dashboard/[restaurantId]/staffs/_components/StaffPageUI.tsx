"use client";

import React, { useState } from "react";

// Sample constant data
const staffData = [
  {
    id: 1,
    name: "Suman Adhikari",
    email: "suman@example.com",
    phone: "9800000000",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "9811111111",
    role: "Staff",
    status: "pending",
  },
];

const pendingInvites = [
  {
    id: 101,
    email: "newstaff@example.com",
    role: "Staff",
    status: "pending",
  },
];

export default function StaffPageUI() {
  const [users, setUsers] = useState(staffData);
  const [invites, setInvites] = useState(pendingInvites);

  const handleStatusChange = (id: number, newStatus: "active" | "pending") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleInviteUser = (email: string, role: string) => {
    const newInvite = {
      id: Date.now(),
      email,
      role,
      status: "pending",
    };
    setInvites((prev) => [...prev, newInvite]);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage My Team</h2>

      {/* Invite Section */}
      <div className="mb-6 p-4 border rounded-md bg-white">
        <h3 className="font-semibold mb-2">Invite Staff</h3>
        <InviteForm onInvite={handleInviteUser} />
      </div>

      {/* Staff Table */}
      <div className="mb-6 bg-white p-2">
        <h3 className="font-semibold mb-2">Staff & Owner</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.status}</td>
                <td className="border p-2">
                  {user.role !== "Admin" && (
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(
                          user.id,
                          e.target.value as "active" | "pending"
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Invites */}
      <div className="bg-white p-2">
        <h3 className="font-semibold mb-2">Pending Invites</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {invites.map((invite) => (
              <tr key={invite.id}>
                <td className="border p-2">{invite.email}</td>
                <td className="border p-2">{invite.role}</td>
                <td className="border p-2">{invite.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple invite form
const InviteForm = ({
  onInvite,
}: {
  onInvite: (email: string, role: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Staff");

  return (
    <div className="flex gap-2">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="Staff">Staff</option>
        <option value="Admin">Admin</option>
      </select>
      <button
        onClick={() => {
          onInvite(email, role);
          setEmail("");
        }}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Invite
      </button>
    </div>
  );
};
