import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { PurchaseCourse } from "../models/purchaseCourse.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY,
        });

        const userId = req.id;
        const { courseId } = req.params;

        // Validate and fetch course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        // Create a new course purchase record
        const newPurchase = new PurchaseCourse({
            courseId,
            userId,
            amount: course.coursePrice,
            status: "pending",
        });

        // Create a Razorpay order
        const options = {
            amount: course.coursePrice * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${new Date().getTime()}`, // Unique receipt ID
            notes: { courseId, userId },
        };
        

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(400).json({ success: false, message: "Error while creating order" });
        }

        // Save the purchase record with the order ID
        newPurchase.paymentId = order.id;
        await newPurchase.save();
        return res.status(200).json({
            success: true,
            order,
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            key: process.env.RAZORPAY_KEY_ID, // Send the public key to the client
        });
    } catch (error) {
        console.error("Error in createCheckoutSession:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const paymentVerify = async (req, res) => {
    try {
        const {razorpay_payment_id,razorpay_order_id,razorpay_signature,} = req.body;
        // Verify the signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        // Find the purchase record
        const purchase = await PurchaseCourse.findOne({
          paymentId: razorpay_order_id,
          status: "pending",
        }).populate({ path: "courseId" });

        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        // Update purchase status to "completed"
        purchase.status = "success";
        await purchase.save();

        // Make all lectures visible
        if (purchase.courseId && purchase.courseId.lectures.length > 0) {
            await Lecture.updateMany(
                { _id: { $in: purchase.courseId.lectures } },
                { $set: { isPreviewFree: true } }
            );
        }

        // Update user's enrolled courses
        await User.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { enrolledCourses: purchase.courseId._id } },
            { new: true }
        );

        // Update course to add user to enrolled students
        await Course.findByIdAndUpdate(
            purchase.courseId._id,
            { $addToSet: { enrolledStudents: purchase.userId } },
            { new: true }
        );

        return res.status(200).json({ message: "Payment verified and processed successfully" });
    } catch (error) {
        console.error("Error in paymentVerify:", error);
        return res.status(500).json({ message: "Internal Server Error in verifying payment" });
    }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
      const {courseId} = req.params;
      const userId = req.id;

      const course = await Course.findById(courseId).populate({path: "creator"}).populate({path: "lectures", select:"-videoUrl"});

      if(!course){
        return res.status(404).json({
            message: "Course not found"
        })
      }

      // add back the videoUrl for the first lecture only
      if (course.lectures && course.lectures.length > 0) {
        const firstLectureId = course.lectures[0]._id;
        const firstLecture = await Lecture.findById(firstLectureId).select("videoUrl");
        if (firstLecture) {
          course.lectures[0].videoUrl = firstLecture.videoUrl; // attach videoUrl to the first lecture
        }
      }

      const purchased = await PurchaseCourse.findOne({
        userId,
        courseId,
        status: "success",
      });

      return res.status(200).json({
        message: "Course details fetched successfully",
        course,
        purchased: !!purchased
      })

    } catch (error) {
      console.error("Error in getCourseDetailWithPurchaseStatus:", error);
      return res.status(500).json({ message: "Internal Server Error in getting course details" });
    }
};
  

export const getAllPurchasedCourses = async (req, res) => {
  try {
    
    const purchasedCourses = await PurchaseCourse.find({ status: "success"}).populate({path: "courseId"});
    if(!purchasedCourses){
      return res.status(404).json({
          purchasedCourses:[],
          message: "Purchased courses not found"
      })
    }
    return res.status(200).json({
      message: "Purchased courses fetched successfully",
      purchasedCourses
    })
  } catch (error) {
    console.error("Error in getAllPurchasedCourses:", error);
    return res.status(500).json({ message: "Internal Server Error in getting purchased courses" });
  }
}