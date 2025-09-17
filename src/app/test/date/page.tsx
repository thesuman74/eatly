"use client";

import { useState } from "react";

export default function GermanEmbassyForm() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    repeatEmail: "",
    passportNumber: "",
    publicUniversity: "",
    captcha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert("Form submitted (test mode)");
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        national visa (D) - admission to bachelor's or master's programme at a
        public university, researcher or scholarship holders (only DAAD,
        ERASMUS)
      </h2>

      <p className="text-sm mb-4">
        Date / Time: <strong>04.09.2025 11:00 – 11:30</strong> <br />
        Location: <strong>Kathmandu</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name:
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name:
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="repeatEmail"
            className="block text-sm font-medium text-gray-700"
          >
            Repeat Email:
          </label>
          <input
            id="repeatEmail"
            name="repeatEmail"
            type="email"
            value={formData.repeatEmail}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="passportNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Passport Number:
          </label>
          <input
            id="passportNumber"
            name="passportNumber"
            type="text"
            value={formData.passportNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="publicUniversity"
            className="block text-sm font-medium text-gray-700"
          >
            Public University:
          </label>
          <input
            id="publicUniversity"
            name="publicUniversity"
            type="text"
            value={formData.publicUniversity}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="captcha"
            className="block text-sm font-medium text-gray-700"
          >
            Captcha:
          </label>
          <input
            id="captcha"
            name="captcha"
            type="text"
            placeholder="Enter captcha"
            value={formData.captcha}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
