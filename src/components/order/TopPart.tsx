import React from "react";
import CounterTable from "./CounterTable";

const TopPart = () => {
  return (
    <div>
      <section className="flex justify-between my-2 px-4">
        {/* <!-- left section --> */}
        <div className="flex">
          <div className="flex space-x-2 rounded-sm border border-input bg-white px-4 py-2">
            <span>c</span>
            <span>Counter</span>
            <span className="rounded-full bg-gray-300 p-1 px-2 text-xs">1</span>
          </div>
          <div className="flex space-x-2 rounded-sm border border-input bg-white px-4 py-2">
            <span>c</span>
            <span>Delivery</span>
            <span className="rounded-full bg-gray-300 p-1 px-2 text-xs">1</span>
          </div>
          <div className="flex space-x-2 rounded-sm border border-input bg-white px-4 py-2">
            <span>c</span>
            <span>Tables</span>
            <span className="rounded-full bg-gray-300 p-1 px-2 text-xs">1</span>
          </div>
        </div>

        {/* <!-- right section  --> */}
        <div className="flex gap-2">
          <button className="rounded-sm bg-gray-200 px-6">r</button>
          <button className="rounded-sm bg-gray-200 px-6">S</button>
          <button className="rounded-sm bg-blue-500 px-4 py-2 text-white flex gap-2">
            <span>+</span>
            <span>New Orders</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default TopPart;
