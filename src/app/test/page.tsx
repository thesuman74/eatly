"use client";

import BouncingText from "@/components/animation/BouncingText";
import CategoryList from "@/components/dashboard/DragAndDrop/CategoryList";
import { DragAndDropProvider } from "@/components/dashboard/DragAndDrop/DragAndDropContext";
import { useState } from "react";

// import { useState } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { motion } from "framer-motion";
// import {
//   Grip,
//   EllipsisVertical,
//   ChevronDown,
//   ChevronRight,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const DraggableItem = ({ category, onToggle, expanded }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: category.id });

//   return (
//     <motion.div
//       ref={setNodeRef}
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition,
//       }}
//       className="p-3 border bg-gray-100 rounded-lg mb-2 shadow-md"
//     >
//       <div className="flex justify-between items-center">
//         {/* Left side */}
//         <div className="flex items-center space-x-2">
//           <span
//             {...attributes}
//             {...listeners}
//             className="cursor-grab active:cursor-grabbing text-gray-500"
//           >
//             <Grip />
//           </span>
//           <div className="flex flex-col">
//             <span className="text-sm text-gray-500">Category Name</span>
//             <span className="font-semibold">{category.name}</span>
//           </div>
//         </div>

//         {/* Right side */}
//         <div className="flex items-center space-x-2">
//           <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
//             {category.products.length}
//           </span>
//           <Button variant="outline">+ Product</Button>
//           <EllipsisVertical />
//           <button onClick={() => onToggle(category.id)}>
//             {expanded ? <ChevronDown /> : <ChevronRight />}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const DraggableSubItem = ({ product }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: product.id });

//   return (
//     <motion.div
//       ref={setNodeRef}
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition,
//       }}
//       className="p-3 border bg-white rounded-lg mb-1 shadow-sm flex items-center justify-between"
//     >
//       <span
//         {...attributes}
//         {...listeners}
//         className="cursor-grab active:cursor-grabbing text-gray-500"
//       >
//         <Grip />
//       </span>
//       <div className="flex items-center space-x-2">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-8 h-8 rounded"
//         />
//         <span>{product.name}</span>
//       </div>
//       <span className="text-gray-500">{product.price}</span>
//     </motion.div>
//   );
// };

// export default function DragAndDropList() {
//   const [categories, setCategories] = useState([
//     {
//       id: "tea-specials",
//       name: "Tea Specials",
//       products: [
//         {
//           id: "green-tea",
//           name: "Green Tea",
//           price: "Rs 4,00",
//           image: "/tea.jpg",
//         },
//         {
//           id: "masala-tea",
//           name: "Masala Tea",
//           price: "Rs 5,00",
//           image: "/masala.jpg",
//         },
//         {
//           id: "lemon-tea",
//           name: "Lemon Tea",
//           price: "Rs 5,00",
//           image: "/lemon.jpg",
//         },
//       ],
//     },
//     {
//       id: "desserts",
//       name: "Desserts",
//       products: [
//         {
//           id: "chocolate-cake",
//           name: "Chocolate Cake",
//           price: "Rs 6,00",
//           image: "/cake.jpg",
//         },
//         {
//           id: "ice-cream",
//           name: "Ice Cream",
//           price: "Rs 3,50",
//           image: "/icecream.jpg",
//         },
//       ],
//     },
//     {
//       id: "drinks",
//       name: "Drinks",
//       products: [
//         {
//           id: "cold-coffee",
//           name: "Cold Coffee",
//           price: "Rs 4,50",
//           image: "/coffee.jpg",
//         },
//         {
//           id: "mango-shake",
//           name: "Mango Shake",
//           price: "Rs 5,50",
//           image: "/mango.jpg",
//         },
//       ],
//     },
//   ]);

//   const [expandedCategories, setExpandedCategories] = useState({});

//   const handleToggle = (id) => {
//     setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     // Check if it's a category move
//     const oldIndex = categories.findIndex((c) => c.id === active.id);
//     const newIndex = categories.findIndex((c) => c.id === over.id);

//     if (oldIndex !== -1 && newIndex !== -1) {
//       setCategories(arrayMove(categories, oldIndex, newIndex));
//       return;
//     }

//     // Otherwise, it's a product move within a category
//     for (let category of categories) {
//       const oldProductIndex = category.products.findIndex(
//         (p) => p.id === active.id
//       );
//       const newProductIndex = category.products.findIndex(
//         (p) => p.id === over.id
//       );

//       if (oldProductIndex !== -1 && newProductIndex !== -1) {
//         setCategories((prev) =>
//           prev.map((c) =>
//             c.id === category.id
//               ? {
//                   ...c,
//                   products: arrayMove(
//                     c.products,
//                     oldProductIndex,
//                     newProductIndex
//                   ),
//                 }
//               : c
//           )
//         );
//         return;
//       }
//     }
//   };

//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext
//         items={categories}
//         strategy={verticalListSortingStrategy}
//       >
//         <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
//           <h2 className="text-xl font-bold mb-4">
//             Drag & Drop with Nested Items
//           </h2>
//           {categories.map((category) => (
//             <div key={category.id} className="mb-4">
//               <DraggableItem
//                 category={category}
//                 onToggle={handleToggle}
//                 expanded={expandedCategories[category.id]}
//               />
//               {expandedCategories[category.id] && (
//                 <SortableContext
//                   items={category.products}
//                   strategy={verticalListSortingStrategy}
//                 >
//                   <div className="ml-8 mt-2">
//                     {category.products.map((product) => (
//                       <DraggableSubItem key={product.id} product={product} />
//                     ))}
//                   </div>
//                 </SortableContext>
//               )}
//             </div>
//           ))}
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// }

export default function Home() {
  const [price, setPrice] = useState(100);

  return (
    <>
      <DragAndDropProvider>
        <CategoryList />
      </DragAndDropProvider>

      <div className="flex flex-col items-center justify-center h-screen">
        <BouncingText text={price.toString()} />

        <button
          onClick={() => setPrice((prev) => prev + 10)}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Increase Price
        </button>
      </div>
    </>
  );
}
