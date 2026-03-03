"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var student, Instructor, Admin, department, studentProfile, instructorProfile, course, resource, summary, quiz, question, attempt, progress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.upsert({
                        where: { email: "John@uni.test" },
                        update: {},
                        create: {
                            firstName: "John",
                            lastName: "Don",
                            email: "John@uni.test",
                            passwordHash: "12345678",
                            role: "STUDENT",
                        }
                    })];
                case 1:
                    student = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "Ins@uni.test" },
                            update: {},
                            create: {
                                firstName: "Mike",
                                lastName: "Mosby",
                                email: "Ins@uni.test",
                                passwordHash: "12345678",
                                role: "INSTRUCTOR",
                            }
                        })];
                case 2:
                    Instructor = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "Admin@uni.test" },
                            update: {},
                            create: {
                                firstName: "Joe",
                                lastName: "Herald",
                                email: "Admin@uni.test",
                                passwordHash: "12345678",
                                role: "ADMIN",
                            }
                        })];
                case 3:
                    Admin = _a.sent();
                    return [4 /*yield*/, prisma.department.upsert({
                            where: { code: "CS101" },
                            update: {},
                            create: {
                                name: "Computer Science",
                                code: "CS101"
                            }
                        })];
                case 4:
                    department = _a.sent();
                    return [4 /*yield*/, prisma.studentProfile.upsert({
                            where: { studnetId: student.id },
                            update: {},
                            create: {
                                studnetId: "UGR/1100/15",
                                departmentId: department.id,
                                acadamicYear: 2024,
                            }
                        })];
                case 5:
                    studentProfile = _a.sent();
                    return [4 /*yield*/, prisma.instructorProfile.upsert({
                            where: { instructorId: Instructor.id },
                            update: {},
                            create: {
                                instructorId: "INS/0001/15",
                                departmentId: department.id,
                            }
                        })];
                case 6:
                    instructorProfile = _a.sent();
                    return [4 /*yield*/, prisma.course.upsert({
                            where: { code: "CS101" },
                            update: {},
                            create: {
                                name: "Artificial Intelligence",
                                code: "AI101",
                                acadamicYear: 2024,
                                departmentId: department.id,
                                instructorId: instructorProfile.id
                            }
                        })];
                case 7:
                    course = _a.sent();
                    return [4 /*yield*/, prisma.resource.upsert({
                            where: { id: "001" },
                            update: {},
                            create: {
                                title: "Intro to AI",
                                type: "PDF",
                                fileUrl: "cloudinary_url",
                                courseId: course.id,
                                instructorId: instructorProfile.id,
                            }
                        })];
                case 8:
                    resource = _a.sent();
                    return [4 /*yield*/, prisma.summary.upsert({
                            where: { id: "001" },
                            update: {},
                            create: {
                                content: "Summary",
                                resourceId: resource.id,
                                studnetId: studentProfile.id,
                            }
                        })];
                case 9:
                    summary = _a.sent();
                    return [4 /*yield*/, prisma.quiz.upsert({
                            where: { id: "001" },
                            update: {},
                            create: {
                                title: "A Quiz on AI",
                                difficulty: "MEDIUM",
                                resourceId: resource.id,
                                studnetId: student.id
                            }
                        })];
                case 10:
                    quiz = _a.sent();
                    return [4 /*yield*/, prisma.question.upsert({
                            where: { id: "001" },
                            update: {},
                            create: {
                                content: "What is AI?",
                                options: {},
                                correctAns: 'A',
                                quizId: quiz.id
                            }
                        })];
                case 11:
                    question = _a.sent();
                    return [4 /*yield*/, prisma.quizAttempt.upsert({
                            where: { id: "001" },
                            update: {},
                            create: {
                                score: 10,
                                quizId: quiz.id,
                                studnetId: studentProfile.id,
                            }
                        })];
                case 12:
                    attempt = _a.sent();
                    return [4 /*yield*/, prisma.progress.upsert({
                            where: { id: "001" },
                            update: {},
                            create: {
                                resourceViewed: 3,
                                averageScore: 9,
                                studnetId: studentProfile.id,
                                courseId: course.id
                            }
                        })];
                case 13:
                    progress = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
