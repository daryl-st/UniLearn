export * from "./User";
export * from "./Course";
export * from "./AI";

// Only create shared types for:
// - Things returned in API responses
// - Things accepted in API requests
// - Cross-service contracts

// Prisma Model → Internal Backend Types → DTO (shared) → JSON → Frontend

// Naming convention will look like this:
// • CreateUserInput
// • UpdateCourseInput
// • CourseResponse

// Database says:
//  User has id, email, name.

// Shared type says:
//  When we send a user to frontend, it looks like this.

// Entity says:
//  A user is allowed to do these things.