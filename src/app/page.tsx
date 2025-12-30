// // src/app/(public)/page.tsx
// import React from "react";
// import Link from "next/link";
// import { Restaurant, restaurantType } from "@/lib/types/resturant-types";
// import { getAllPublicRestaurants } from "@/services/server/serverRestaurantServices";

// const HomePage = async () => {
//   const restaurants = await getAllPublicRestaurants();

//   if (!restaurants || restaurants.length === 0) {
//     return <p>No restaurants available.</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <h1 className="text-3xl font-bold mb-6">Our Restaurants</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {restaurants.map((restaurant: Restaurant) => (
//           <Link
//             key={restaurant.id}
//             href={`/${restaurant.id}`} // navigate to restaurant page
//           >
//             <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer">
//               {restaurant.banner_url && (
//                 <img
//                   src={
//                     restaurant.banner_url || "https://picsum.photos/1200/300"
//                   }
//                   alt={restaurant.name}
//                   className="w-full h-40 object-cover rounded-md mb-4"
//                 />
//               )}
//               <h2 className="text-xl font-semibold">{restaurant.name}</h2>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  return redirect("/login");
};

export default page;
