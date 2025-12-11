import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean; // Add custom property for conditional token inclusion
  }
}
