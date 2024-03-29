let router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const holidayRouter = require("./holiday.route");
const patientRouter = require("./patient.route");
const staffRouter = require("./staff.route");
const accessRouter = require("./access.group.route");
const specialtyRouter = require("./specialty.route");
const practiceRouter = require("./practice.route");
const referralSourceRouter = require("./referral.source.route");
const documentRouter = require("./document.route");
const appointmentRouter = require("./appointment.route");
const authRouter = require("./auth.route");
const imageRouter = require("./image.route");
const drugRouter = require("./drug.route");
//const insurerRouter = require("./insurer.route"); //deprecated
const noteMacroRouter = require("./note.macro.route");
const procedureRouter = require("./procedure.code.route");
const referralRouter = require("./referral.route");
const recallRouter = require("./recall.route");
const toothRouter = require("./tooth.route");
const progressNoteRouter = require("./progress.note.route");
const treatmentPlanRouter = require("./treatment.plan.route");
const treatmentRouter = require("./treatment.route");
//const insuranceRouter = require("./insurance.route");//deprecated
const imageMouthRouter = require("./mouth.route");
const imageMouthTemplateRouter = require("./mouth.template.route");
const multiCodeRouter = require("./multicode.route");
const prescriptionRouter = require("./prescription.route");
const reportRouter = require("./report.route");
const transactionRouter = require("./transaction.route");
const scheduleRouter = require("./provider.schedule.route");
const requestRouter = require("./appointment.request.route");
const paymentRouter = require("./payment.route");
router.use("/report", reportRouter);
router.use("/patient", patientRouter);
router.use("/staff", staffRouter);
router.use("/specialty", specialtyRouter);
router.use("/practice", practiceRouter);
router.use("/referral-source", referralSourceRouter);
router.use("/document", documentRouter);
router.use("/appointment", appointmentRouter);
router.use("/authorization", authRouter);
router.use("/image", imageRouter);
router.use("/drug", drugRouter);
//router.use("/insurer", insurerRouter);//deprecated
router.use("/note-macro", noteMacroRouter);
router.use("/procedure", procedureRouter);
router.use("/referral", referralRouter);
router.use("/recall", recallRouter);
router.use("/tooth", toothRouter);
router.use("/progress-note", progressNoteRouter);
//router.use("/treatment-plan", treatmentPlanRouter);//deprecated
router.use("/treatment", treatmentRouter);
//router.use("/insurance", insuranceRouter);//deprecated
router.use("/image-mouth", imageMouthRouter);
router.use("/image-mouth-template", imageMouthTemplateRouter);
//router.use("/multi-code", multiCodeRouter);//deprecated
router.use("/prescription", prescriptionRouter);
router.use("/holiday", holidayRouter);
router.use("/access-control", accessRouter);
router.use("/transaction", transactionRouter);
router.use("/schedule", scheduleRouter);
router.use("/appointment-request", requestRouter);
router.use("/payment", paymentRouter);
module.exports = router;
