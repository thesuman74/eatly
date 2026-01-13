import "@testing-library/jest-dom";
import { Assertion } from "vitest";

declare module "vitest" {
  interface Assertion<T> extends jest.Matchers<void, T> {}
}
