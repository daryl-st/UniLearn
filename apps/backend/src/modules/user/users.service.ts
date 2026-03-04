import type { Role } from "@unilearn/shared-types";
import { UserRepository } from "./user.repository.js"

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUsers() {
        return this.userRepository.findAll();
    }

    async createUser(data: {email: string, firstName: string, lastName: string, passwordHash: string, role: Role}) {
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