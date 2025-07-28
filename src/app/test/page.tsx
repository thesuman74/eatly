"use client";

import { useState } from "react";

export default function VisaFormTest() {
  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    countryOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    phoneNumber: "",
    email: "",
    confirmEmail: "",
    university: "",
    residenceAddress: "",
    reasonForAppointment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Submitted Data:\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        German Visa Appointment Form (Test)
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="surname" className="block font-medium">
            Surname
          </label>
          <input
            id="surname"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block font-medium">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block font-medium">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="placeOfBirth" className="block font-medium">
            Place of Birth
          </label>
          <input
            id="placeOfBirth"
            type="text"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="countryOfBirth" className="block font-medium">
            Country of Birth
          </label>
          <input
            id="countryOfBirth"
            type="text"
            name="countryOfBirth"
            value={formData.countryOfBirth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="nationality" className="block font-medium">
            Nationality
          </label>
          <input
            id="nationality"
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="passportNumber" className="block font-medium">
            Passport Number
          </label>
          <input
            id="passportNumber"
            type="text"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="passportIssueDate" className="block font-medium">
            Passport Issue Date
          </label>
          <input
            id="passportIssueDate"
            type="date"
            name="passportIssueDate"
            value={formData.passportIssueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="passportExpiryDate" className="block font-medium">
            Passport Expiry Date
          </label>
          <input
            id="passportExpiryDate"
            type="date"
            name="passportExpiryDate"
            value={formData.passportExpiryDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block font-medium">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="confirmEmail" className="block font-medium">
            Confirm Email Address
          </label>
          <input
            id="confirmEmail"
            type="email"
            name="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="university" className="block font-medium">
            university
          </label>
          <input
            id="university"
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="residenceAddress" className="block font-medium">
            Residence Address in Nepal
          </label>
          <input
            id="residenceAddress"
            type="text"
            name="residenceAddress"
            value={formData.residenceAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="reasonForAppointment" className="block font-medium">
            Reason for Appointment
          </label>
          <select
            id="reasonForAppointment"
            name="reasonForAppointment"
            value={formData.reasonForAppointment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select</option>
            <option value="student-visa">Student Visa</option>
            <option value="language-course">Language Course</option>
            <option value="blocked-account">Blocked Account</option>
          </select>
        </div>

        <p className="text-gray-500 text-sm">
          Captcha cannot be autofilled and must be completed manually on the
          actual website.
        </p>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit (Dummy)
        </button>
      </form>
    </div>
  );
}
