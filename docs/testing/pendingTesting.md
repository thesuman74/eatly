# RLS & Multi-Tenancy Verification Notes

## Current Status (Confirmed)

* Logged in with two different accounts (test2, pasal)
* Each account is linked to a different restaurant
* Orders (paid and unpaid):

  * Created successfully
  * Visible only within the corresponding restaurant
  * No cross-restaurant data leakage observed

**Conclusion:** Functional verification passed. RLS appears to be working correctly at a basic level.

---

## Pending Security Verification (To Be Done Later)

### 1. Cross-Tenant Read Tests

* Attempt to fetch orders belonging to another restaurant
* Expected result: empty response

### 2. Cross-Tenant Write Tests

* Insert order with another restaurant_id
* Update order status of another restaurant
* Delete order of another restaurant
* Expected result: permission denied or 0 rows affected

### 3. Update Scope Validation

* Verify restricted fields cannot be modified (e.g., restaurant_id, payment_status)
* Confirm role-based permissions if applicable

### 4. Anonymous Access Test

* Try accessing orders/restaurants without authentication
* Expected result: no data returned

### 5. Service Role Safety Check

* Ensure service role key is used only in server-side/admin contexts
* Confirm it is never exposed to the client

---

## Final Verification Matrix (Checklist)

| Operation | Same Restaurant | Other Restaurant |
| --------- | --------------- | ---------------- |
| SELECT    | Allowed         | Blocked          |
| INSERT    | Allowed         | Blocked          |
| UPDATE    | Allowed         | Blocked          |
| DELETE    | Allowed         | Blocked          |

---

## Notes

* UI testing validates functionality
* Postman/API testing validates security
* System should be considered production-ready only after all pending checks pass
