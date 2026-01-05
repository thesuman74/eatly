import React from "react";

interface pendingInvitesProps {
  invites: {
    id: string;
    email: string;
    role: string;
    invite_status: string;
  }[];
}
const InviteLists = ({ invites }: pendingInvitesProps) => {
  return (
    <div>
      {/* Pending Invites */}
      <h2 className="text-2xl font-bold mb-4">Invites</h2>
      <div className="bg-white p-2">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {invites?.map((invite) => (
              <tr key={invite.id}>
                <td className="border p-2">{invite.email}</td>
                <td className="border p-2">{invite.role}</td>
                <td className="border p-2">{invite.invite_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InviteLists;
