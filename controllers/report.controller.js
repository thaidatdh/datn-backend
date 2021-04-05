//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const chairModel = require("../models/chair.model");
const appointmentModel = require("../models/appointment.model");
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
const readFileAsync = promisify(fs.readFile);
jsreport.init();
exports.index = async function (req, res) {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(
      new Date(req.query.endDate).setDate(
        new Date(req.query.endDate).getDate() + 1
      )
    );
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
    const appointment_count = await appointmentModel.countDocuments({
      appointment_date: DateRange,
    });
    const treatment_count = await TreatmentModel.countDocuments({
      treatment_date: DateRange,
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
    const payment = await TreatmentModel.aggregate([
      { $match: { treatment_date: DateRange } },
      {
        $group: {
          _id: undefined,
          total_fee: { $sum: "$fee" },
          total_insurance_amount: { $sum: "$insurance_amount" },
          total_patient_amount: { $sum: "$patient_amount" },
          total_discount_amount: { $sum: "$discount" },
        },
      },
    ]);
    let appointmentStatistic = [];
    let paymentStatistic = [];
    let tempDate = new Date(startDate.toString("yyyy-MM-dd"));
    let chartDayGap = req.query.chartDayGap
      ? Number.parseInt(req.query.chartDayGap)
      : 1;
    while (tempDate < endDate) {
      const dayDiff =
        (endDate.getTime() - tempDate.getTime()) / (1000 * 3600 * 24);
      const gap = dayDiff >= chartDayGap ? chartDayGap : dayDiff;
      const tempDateEnd = new Date(
        new Date(tempDate).setDate(tempDate.getDate() + gap)
      );
      const apptCount = await appointmentModel.countDocuments({
        appointment_date: { $gte: tempDate, $lt: tempDateEnd },
      });

      appointmentStatistic.push({
        date: tempDate,
        date_end: tempDateEnd,
        count: apptCount,
        gap: gap,
      });
      const treatmentStat = await TreatmentModel.aggregate([
        { $match: { treatment_date: { $gte: tempDate, $lt: tempDateEnd } } },
        {
          $group: {
            _id: undefined,
            total_fee: { $sum: "$fee" },
            total_insurance_amount: { $sum: "$insurance_amount" },
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
      }
      tempDate = new Date(tempDateEnd.getTime());
    }
    const result = {
      success: true,
      treatment: treatment_count,
      procedure: procedure_count,
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
    let Query = {
      patient: mongoose.Types.ObjectId(req.params.patient_id),
    };
    const lang = req.query.lang;
    const createDate = formatReadableDate(new Date(), lang);
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
          message: await translator.FailedMessage(
            constants.ACTION.GET,
            "Statistic Report",
            req.query.lang
          ),
        });
      }
      startDateString = formatReadableDate(startDate, lang);
      endDateStr = formatReadableDate(new Date(req.query.endDate), lang);
      const DateRange = { $gte: startDate, $lt: endDate };
      Query = Object.assign(Query, { treatment_date: DateRange });
    }
    const Patient = await PatientModel.get(
      { _id: req.params.patient_id },
      { one: true }
    );
    if (Patient == null || Patient.length == 0) {
      return res.status(404).json({
        success: false,
        message: await translator.NotFoundMessage("Patient", req.query.lang),
      });
    }
    const User = await Patient.user;
    let treatment_selected_fields = {
      provider_name: 1,
      status: { $substr: ["$status", 0, 1] },
      ada_code: 1,
      tooth: 1,
      surface: 1,
      fee: { $ifNull: [ "$fee", 0 ] },
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
    const Practice = await PracticeModel.findOne();

    const content = await readFileAsync(
      "./report_template/treatment-history.hbs"
    );
    const css = await readFileAsync("./report_template/provider-report.css");
    const data = {
      css: css,
      startDate: startDateString,
      endDate: endDateStr,
      patient: {
        name: User.first_name + " " + User.last_name,
        dob: Patient.dob ? formatReadableDate(Patient.dob, lang) : null,
        id: Patient.patient_id,
      },
      total: TreatmentData.length,
      now: createDate,
      practice: {
        name: Practice.name,
        address: Practice.address,
        phone: Practice.phone,
      },
      items: TreatmentData,
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
