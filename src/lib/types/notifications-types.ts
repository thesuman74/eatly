export type Notification = {
  id: string;
  user_id: string;
  restaurant_id: string;
  type: "order" | "payment" | "system";
  entity_type: "order" | "payment";
  entity_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
