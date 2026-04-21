import type { Role } from "@unilearn/shared-types";
import { UserRepository } from "./user.repository.js"

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUsers() {
        return this.userRepository.findAll();
    }

    // This should be admin functionality, but for now let's keep it simple.
    // Admins can create instructors and students.
    async createUser(data: {email: string, name: string, password: string, role: Role}) {
        // check if user exists and other business logic
        return this.userRepository.create(data);
    }
}

// What is service’s role?
// Service is where use cases live.

// Like:
// • registerUser
// • enrollUserInCourse
// • generateCertificate
// • assignRoleToUser