"use client";

import React, { useState } from "react";

interface StatusDropdownProps {
  currentStatus: string;
  onChange: (newStatus: string) => void;
}

const options = ["Accepted", "Ready", "Preparing", "Completed"];

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onChange,
}) => {
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    onChange(e.target.value);
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      className="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;
