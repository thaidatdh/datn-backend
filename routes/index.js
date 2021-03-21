let router = require("express").Router();
const patientRouter = require("./patient.route");
const staffRouter = require("./staff.route");
const specialistRouter = require("./specialist.route");
const practiceRouter = require("./practice.route");
const referralSourceRouter = require("./referral.source.route");
const documentRouter = require("./document.route");
const appointmentRouter = require("./appointment.route");
const authRouter = require("./auth.route");
const imageRouter = require("./image.route");
const drugRouter = require("./drug.route");
const insurerRouter = require("./insurer.route");
const noteMacroRouter = require("./note.macro.route");
const procedureRouter = require("./procedure.code.route");
const referralRouter = require("./referral.route");
const recallRouter = require("./recall.route");
const toothRouter = require("./tooth.route");
const progressNoteRouter = require("./progress.note.route");
const treatmentPlanRouter = require("./treatment.plan.route");
const treatmentRouter = require("./treatment.route");
const insuranceRouter = require("./insurance.route");
const imageMouthRouter = require("./mouth.route");
const imageMouthTemplateRouter = require("./mouth.template.route");
router.use("/patient", patientRouter);
router.use("/staff", staffRouter);
router.use("/specialist", specialistRouter);
router.use("/practice", practiceRouter);
router.use("/referral-source", referralSourceRouter);
router.use("/document", documentRouter);
router.use("/appointment", appointmentRouter);
router.use("/authorization", authRouter);
router.use("/image", imageRouter);
router.use("/drug", drugRouter);
router.use("/insurer", insurerRouter);
router.use("/note-macro", noteMacroRouter);
router.use("/procedure", procedureRouter);
router.use("/referral", referralRouter);
router.use("/recall", recallRouter);
router.use("/tooth", toothRouter);
router.use("/progress-note", progressNoteRouter);
router.use("/treatment-plan", treatmentPlanRouter);
router.use("/treatment", treatmentRouter);
router.use("/insurance", insuranceRouter);
router.use("/image-mouth", imageMouthRouter);
router.use("/image-mouth-template", imageMouthTemplateRouter);
module.exports = router;
