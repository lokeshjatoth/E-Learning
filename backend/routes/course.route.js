import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLectures, getCreatorCourses, getLectureById, getPublishedCourses, removeLecture, searchCourse, togglePublishCourse } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";
import { createCheckoutSession, getAllPurchasedCourses, getCourseDetailWithPurchaseStatus, paymentVerify } from "../controllers/purchaseCourse.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, createCourse);
router.get("/search", isAuthenticated, searchCourse);
router.get("/", isAuthenticated, getCreatorCourses);
router.get("/published-courses", getPublishedCourses);
router.put("/:courseId", isAuthenticated, upload.single("courseThumbnail") ,editCourse);
router.get("/purchasedCourses", isAuthenticated, getAllPurchasedCourses);
router.get("/:courseId", isAuthenticated, getCourseById);
router.post("/:courseId/lecture", isAuthenticated, createLecture);
router.get("/:courseId/lecture", isAuthenticated, getCourseLectures);
router.put("/:courseId/lecture/:lectureId", isAuthenticated,editLecture);
router.delete("/:courseId/lecture/:lectureId", isAuthenticated,removeLecture);
router.get("/lecture/:lectureId", isAuthenticated, getLectureById);
router.patch("/:courseId", isAuthenticated, togglePublishCourse);
router.post("/payment/:courseId",isAuthenticated ,createCheckoutSession);
router.post("/payment/:coureseId/verification",isAuthenticated ,paymentVerify);
router.get("/:courseId/details", isAuthenticated, getCourseDetailWithPurchaseStatus);

export default router;