//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const chairModel = require("../models/chair.model");
const AppointmentModel = require("../models/appointment.model");
const AppointmentRequestModel = require("../models/appointment.request.model");
const TreatmentModel = require("../models/treatment.model");
const procedureCodeModel = require("../models/procedure.code.model");
const PatientModel = require("../models/patient.model");
const StaffModel = require("../models/staff.model");
const PracticeModel = require("../models/practice.model");
const translator = require("../utils/translator");
const jsreport = require("jsreport-core")();
const fs = require("fs");
const { promisify } = require("util");
const { formatMoney, formatReadableDate } = require("../utils/utils");
const { PATIENT } = require("../constants/constants");
const { co } = require("translatte/languages");
const readFileAsync = promisify(fs.readFile);
jsreport.init();
exports.index = async function (req, res) {
  try {
    if (req.query.startDate == null) {
      res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Statistic Report require start date",
          req.query.lang
        ),
      });
    }
    if (req.query.endDate == null) {
      res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Statistic Report require end date",
          req.query.lang
        ),
      });
    }
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(
      new Date(req.query.endDate).setDate(
        new Date(req.query.endDate).getDate() + 1
      )
    );
    const chartDayGap = req.query.chartDayGap
      ? Number.parseInt(req.query.chartDayGap)
      : 1;
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: await translator.FailedMessage(
          constants.ACTION.GET,
          "Statistic Report",
          req.query.lang
        ),
      });
    }
    const DateRange = { $gte: startDate, $lt: endDate };
    const appointment_count = await AppointmentModel.countDocuments({
      appointment_date: DateRange,
    });
    const appointment_request_stat = await AppointmentRequestModel.aggregate([
      {
        $match: {
          request_date: DateRange,
        },
      },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const treatment_count = await TreatmentModel.countDocuments({
      treatment_date: DateRange,
    });
    const treatment_plan_count = await TreatmentModel.countDocuments({
      treatment_date: DateRange,
      status: constants.TREATMENT.STATUS_PLAN,
    });
    const procedure_count = await procedureCodeModel.estimatedDocumentCount();
    const patient_active = await PatientModel.countDocuments({
      is_active: true,
    });
    const patient_inactive = await PatientModel.countDocuments({
      is_active: false,
    });
    const patient_new = await PatientModel.countDocuments({
      new_patient: true,
    });
    const patient_new_in_range = await PatientModel.countDocuments({
      new_patient: true,
      active_date: DateRange,
    });
    const practiceWorkingTime = await PracticeModel.findOne({});
    const payment = await TreatmentModel.aggregate([
      { $match: { treatment_date: DateRange } },
      {
        $group: {
          _id: undefined,
          total_fee: { $sum: "$fee" },
          //total_insurance_amount: { $sum: "$insurance_amount" },
          total_patient_amount: { $sum: "$patient_amount" },
          total_discount_amount: { $sum: "$discount" },
        },
      },
    ]);
    let appointmentStatistic = [];
    let paymentStatistic = [];
    let tempDate = new Date(startDate.toString("yyyy-MM-dd"));

    while (tempDate < endDate) {
      const dayDiff =
        (endDate.getTime() - tempDate.getTime()) / (1000 * 3600 * 24);
      const gap = dayDiff >= chartDayGap ? chartDayGap : dayDiff;
      const tempDateEnd = new Date(
        new Date(tempDate).setDate(tempDate.getDate() + gap)
      );
      const tempDateRange = { $gte: tempDate, $lt: tempDateEnd };
      const apptCount = await AppointmentModel.countDocuments({
        appointment_date: tempDateRange,
      });

      appointmentStatistic.push({
        date: tempDate,
        date_end: tempDateEnd,
        count: apptCount,
        gap: gap,
      });
      const treatmentStat = await TreatmentModel.aggregate([
        { $match: { treatment_date: tempDateRange } },
        {
          $group: {
            _id: undefined,
            total_fee: { $sum: "$fee" },
            //total_insurance_amount: { $sum: "$insurance_amount" },
            total_patient_amount: { $sum: "$patient_amount" },
            total_discount_amount: { $sum: "$discount" },
          },
        },
      ]);
      if (treatmentStat[0]) {
        paymentStatistic.push(
          Object.assign(treatmentStat[0], {
            date: tempDate,
            date_end: tempDateEnd,
          })
        );
      } else {
        paymentStatistic.push({
          total_fee: 0,
          total_patient_amount: 0,
          total_discount_amount: 0,
          date: tempDate,
          date_end: tempDateEnd,
          gap: gap,
        });
      }
      tempDate = new Date(tempDateEnd.getTime());
    }
    const result = {
      success: true,
      payload: {
        practice: {
          start_time: practiceWorkingTime.start_time,
          end_time: practiceWorkingTime.end_time,
        },
        treatment: {
          total: treatment_count,
          plan_count: treatment_plan_count,
        },
        procedure: procedure_count,
        appointment_request: appointment_request_stat,
        appointment: {
          count: appointment_count,
          chart: appointmentStatistic,
        },
        patient: {
          patient_total: patient_active + patient_inactive,
          patient_active: patient_active,
          patient_inactive: patient_inactive,
          new_patient_total: patient_new,
          new_patient_in_range: patient_new_in_range,
        },
        payment: {
          summary: payment[0],
          chart: paymentStatistic,
        },
      },
    };

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Statistic Report",
        req.query.lang
      ),
      exeption: err,
    });
  }
};
exports.test = async function (req, res) {
  try {
    const content = await readFileAsync(
      "./report_template/provider-report.hbs"
    );
    const css = await readFileAsync("./report_template/provider-report.css");
    let providerData = await StaffModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "UserData",
        },
      },
      {
        $unwind: "$UserData",
      },
      {
        $addFields: {
          name: {
            $concat: ["$UserData.first_name", " ", "$UserData.last_name"],
          },
        },
      },
      {
        $match: {
          staff_type: "PROVIDER",
          is_active: true,
        },
      },
      {
        $project: {
          _id: 1,
          display_id: 1,
          name: 1,
        },
      },
    ]);
    let count = 0;
    for (let provider of providerData) {
      const treatmentStat = await TreatmentModel.aggregate([
        { $match: { provider: provider._id } },
        {
          $group: {
            _id: undefined,
            total_amount: { $sum: "$fee" },
            treatment_count: { $sum: 1 },
          },
        },
      ]);

      provider.amount =
        treatmentStat.length > 0
          ? formatMoney(treatmentStat[0].total_amount)
          : 0;
      provider.treatment =
        treatmentStat.length > 0
          ? formatMoney(treatmentStat[0].treatment_count)
          : 0;
      provider.order = ++count;
    }
    const Practice = await PracticeModel.findOne();
    const data = {
      css: css,
      number: "Active",
      total: providerData.length,
      now: new Date().toLocaleDateString(),
      practice: {
        name: Practice.name,
        address: Practice.address,
        phone: Practice.phone,
      },
      items: providerData,
    };
    const ReportFile = await jsreport.render({
      template: {
        content: content.toString(),
        engine: "handlebars",
        recipe: "chrome-pdf",
      },
      data: data,
    });
    res.contentType("application/pdf").send(ReportFile.content);
  } catch (e) {
    console.log(e);
    res.end(e.message);
  }
};
exports.report_treatment_history = async function (req, res) {
  try {
    let Query = {};
    let mode = "";
    if (req.query.patient_id) {
      Query = {
        patient: mongoose.Types.ObjectId(req.query.patient_id),
      };
      mode = "Patient";
    }
    if (req.query.provider_id) {
      Query = {
        provider: mongoose.Types.ObjectId(req.query.provider_id),
      };
      mode = "Dentist";
    }
    if (req.query.assistant_id) {
      Query = {
        assistant: mongoose.Types.ObjectId(req.query.assistant_id),
      };
      mode = "Assistant";
    }
    const lang = req.query.lang;
    const createDate = formatReadableDate(new Date());
    let startDateString = null;
    let endDateStr = null;
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(
        new Date(req.query.endDate).setDate(
          new Date(req.query.endDate).getDate() + 1
        )
      );
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: await translator.Translate(
            "Statistic Report require start date <= end date",
            req.query.lang
          ),
        });
      }
      startDateString = formatReadableDate(startDate);
      endDateStr = formatReadableDate(new Date(req.query.endDate));
      const DateRange = { $gte: startDate, $lt: endDate };
      Query = Object.assign(Query, { treatment_date: DateRange });
    } else {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Statistic Report require start date and end date",
          req.query.lang
        ),
      });
    }
    let patientInfo = null;

    if (req.query.patient_id) {
      const Patient = await PatientModel.get(
        { _id: req.query.patient_id },
        { one: true }
      );
      if (Patient != null) {
        const User = await Patient.user;
        patientInfo = {
          name: User.first_name + " " + User.last_name,
          dob: Patient.dob ? formatReadableDate(Patient.dob) : null,
          id: Patient.patient_id,
        };
      }
    }
    if (req.query.provider_id || req.query.assistant_id) {
      const staff_id = req.query.provider_id
        ? req.query.provider_id
        : req.query.assistant_id;
      const Staff = await StaffModel.get({ _id: staff_id }, { one: true });
      if (Staff != null) {
        const User = await Staff.user;
        patientInfo = {
          name: User.first_name + " " + User.last_name,
          dob: null,
          id: Staff.display_id,
        };
      }
    }
    let treatment_selected_fields = {
      provider_name: 1,
      status: { $substr: ["$status", 0, 1] },
      ada_code: 1,
      tooth: 1,
      surface: 1,
      fee: { $ifNull: ["$fee", 0] },
      description: 1,
      treatment_date: {
        $dateToString: {
          format: "%d/%m/%Y",
          date: "$treatment_date",
        },
      },
    };
    const TreatmentData = await TreatmentModel.aggregate([
      {
        $match: Query,
      },
      {
        $lookup: {
          from: "staffs",
          localField: "provider",
          foreignField: "_id",
          as: "Provivder",
        },
      },
      {
        $unwind: "$Provivder",
      },
      {
        $addFields: {
          provider_user: "$Provivder.user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "provider_user",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: "$User",
      },
      {
        $addFields: {
          provider_name: {
            $concat: ["$User.first_name", " ", "$User.last_name"],
          },
        },
      },
      {
        $sort: {
          treatment_date: 1,
        },
      },
      {
        $project: treatment_selected_fields,
      },
    ]);
    let treatmentList = [];
    for (const treatment of TreatmentData) {
      const treatmentValue = Object.assign({}, treatment, {fee: parseFloat(treatment.fee)});
      treatmentList.push(treatmentValue);
    }
    const Practice = await PracticeModel.findOne();

    const content = await readFileAsync(
      "./report_template/treatment-history.hbs"
    );
    const css = await readFileAsync("./report_template/provider-report.css");
    const data = {
      css: css,
      mode: mode,
      startDate: startDateString,
      endDate: endDateStr,
      patient: patientInfo == null ? undefined : patientInfo,
      total: TreatmentData.length,
      now: createDate,
      practice: {
        name: Practice.name,
        address: Practice.address,
        phone: Practice.phone,
      },
      items: treatmentList,
    };
    const ReportFile = await jsreport.render({
      template: {
        content: content.toString(),
        engine: "handlebars",
        recipe: "chrome-pdf",
      },
      data: data,
    });
    //return res.contentType("application/pdf").send(ReportFile.content);
    const payload = Buffer.from(ReportFile.content).toString("base64");
    res.json({
      success: true,
      payload: payload,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Statistic Report",
        req.query.lang
      ),
    });
  }
};
exports.report_appointment = async function (req, res) {
  try {
    let Query = {};
    let mode = "";
    if (req.query.patient_id) {
      Query = {
        patient: mongoose.Types.ObjectId(req.query.patient_id),
      };
      mode = "Patient";
    }
    if (req.query.provider_id) {
      Query = {
        provider: mongoose.Types.ObjectId(req.query.provider_id),
      };
      mode = "Dentist";
    }
    if (req.query.assistant_id) {
      Query = {
        assistant: mongoose.Types.ObjectId(req.query.assistant_id),
      };
      mode = "Assistant";
    }
    const lang = req.query.lang;
    const createDate = formatReadableDate(new Date());
    let startDateString = null;
    let endDateStr = null;
    if (req.query.startDate && req.query.endDate) {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(
        new Date(req.query.endDate).setDate(
          new Date(req.query.endDate).getDate() + 1
        )
      );
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: await translator.Translate(
            "Statistic Report require start date <= end date",
            req.query.lang
          ),
        });
      }
      startDateString = formatReadableDate(startDate);
      endDateStr = formatReadableDate(new Date(req.query.endDate));
      const DateRange = { $gte: startDate, $lt: endDate };
      Query = Object.assign(Query, { appointment_date: DateRange });
    } else {
      return res.status(403).json({
        success: false,
        message: await translator.Translate(
          "Statistic Report require start date and end date",
          req.query.lang
        ),
      });
    }

    let patientInfo = null;

    if (req.query.patient_id) {
      const Patient = await PatientModel.get(
        { _id: req.query.patient_id },
        { one: true }
      );
      if (Patient != null) {
        const User = await Patient.user;
        patientInfo = {
          name: User.first_name + " " + User.last_name,
          dob: Patient.dob ? formatReadableDate(Patient.dob) : null,
          id: Patient.patient_id,
        };
      }
    }
    if (req.query.provider_id || req.query.assistant_id) {
      const staff_id = req.query.provider_id
        ? req.query.provider_id
        : req.query.assistant_id;
      const Staff = await StaffModel.get({ _id: staff_id }, { one: true });
      if (Staff != null) {
        const User = await Staff.user;
        patientInfo = {
          name: User.first_name + " " + User.last_name,
          dob: null,
          id: Staff.display_id,
        };
      }
    }
    let appointment_selected_fields = {
      provider_name: 1,
      patient_name: 1,
      status: 1,
      facility: 1,
      time: {
        $concat: [
          { $substr: ["$appointment_time", 0, 2] },
          ":",
          { $substr: ["$appointment_time", 2, 2] },
        ],
      },
      duration: 1,
      appointment_date: {
        $dateToString: {
          format: "%d/%m/%Y",
          date: "$appointment_date",
        },
      },
    };
    const AppointmentData = await AppointmentModel.aggregate([
      {
        $match: Query,
      },
      {
        $lookup: {
          from: "staffs",
          localField: "provider",
          foreignField: "_id",
          as: "Provivder",
        },
      },
      {
        $unwind: "$Provivder",
      },
      {
        $addFields: {
          provider_user: "$Provivder.user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "provider_user",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: "$User",
      },
      {
        $addFields: {
          provider_name: {
            $concat: ["$User.first_name", " ", "$User.last_name"],
          },
        },
      },
      {
        $lookup: {
          from: "patients",
          localField: "patient",
          foreignField: "_id",
          as: "Patient",
        },
      },
      {
        $unwind: "$Patient",
      },
      {
        $addFields: {
          patient_user: "$Patient.user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "patient_user",
          foreignField: "_id",
          as: "PatientUser",
        },
      },
      {
        $unwind: "$PatientUser",
      },
      {
        $addFields: {
          patient_name: {
            $concat: ["$PatientUser.first_name", " ", "$PatientUser.last_name"],
          },
        },
      },
      {
        $lookup: {
          from: "chairs",
          localField: "chair",
          foreignField: "_id",
          as: "Chair",
        },
      },
      {
        $unwind: "$Chair",
      },
      {
        $addFields: {
          facility: "$Chair.name",
        },
      },
      {
        $sort: {
          appointment_date: 1,
          time: 1,
          facility: 1,
        },
      },
      {
        $project: appointment_selected_fields,
      },
    ]);
    const Practice = await PracticeModel.findOne();
    const content = await readFileAsync("./report_template/appointment.hbs");
    const css = await readFileAsync("./report_template/provider-report.css");
    let TotalData = {
      New: 0,
      Check_in_seated: 0,
      Check_in_waiting: 0,
      Check_out: 0,
      Confirm_Hold: 0,
      Confirmed: 0,
      Rescheduled: 0,
      Cancelled: 0,
      No_Show: 0,
    };
    for (const appointment of AppointmentData) {
      const field = appointment.status.toString().replace(" ", "_");
      if (TotalData[field] == undefined) {
        TotalData[field] = 1;
      } else {
        TotalData[field] = parseInt(TotalData[field]) + 1;
      }
    }
    const data = {
      css: css,
      mode: mode,
      statistic: TotalData,
      startDate: startDateString,
      endDate: endDateStr,
      patient: patientInfo == null ? undefined : patientInfo,
      total: AppointmentData.length,
      now: createDate,
      practice: {
        name: Practice.name,
        address: Practice.address,
        phone: Practice.phone,
      },
      items: AppointmentData,
    };
    const ReportFile = await jsreport.render({
      template: {
        content: content.toString(),
        engine: "handlebars",
        recipe: "chrome-pdf",
      },
      data: data,
    });
    //return res.contentType("application/pdf").send(ReportFile.content);
    const payload = Buffer.from(ReportFile.content).toString("base64");
    res.json({
      success: true,
      payload: payload,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: await translator.FailedMessage(
        constants.ACTION.GET,
        "Statistic Report",
        req.query.lang
      ),
    });
  }
};
