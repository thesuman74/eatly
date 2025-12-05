// services/productServices.ts

// services/productServices.ts
export async function getProductsAPI(categoryId: string) {
  const res = await fetch(`/api/menu/products?categoryId=${categoryId}`);
  const data = await res.json();
  console.log("getProductsAPI data", data);
  if (!res.ok) throw new Error(data.error || "Failed to fetch products");
  return data.products;
}

export async function addProductAPI(product: {
  name: string;
  description?: string;
  price: number;
  category_id: string;
}) {
  const response = await fetch("/api/menu/products/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add product");
  }

  return data.product; // return the created product
}

export async function deleteProductAPI(productId: string) {
  if (!productId) throw new Error("Product ID is required");

  const res = await fetch(`/api/menu/products/delete?productId=${productId}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete product");

  return data.message;
}

export async function duplicateProductAPI(productId: string) {
  const res = await fetch(`/api/menu/products/duplicate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to duplicate product");
  return data.product;
}

export async function updateProductAPI(product: any) {
  const res = await fetch(`/api/menu/products/update`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update product");
  return data.product;
}
