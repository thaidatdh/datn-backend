//Import User Model
const mongoose = require("mongoose");
const constants = require("../constants/constants");
const chairModel = require("../models/chair.model");
const appointmentModel = require("../models/appointment.model");
const treatmentModel = require("../models/treatment.model");
const procedureCodeModel = require("../models/procedure.code.model");
const patientModel = require("../models/patient.model");
const translator = require("../utils/translator");
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
    const treatment_count = await treatmentModel.countDocuments({
      treatment_date: DateRange,
    });
    const procedure_count = await procedureCodeModel.estimatedDocumentCount();
    const patient_active = await patientModel.countDocuments({
      is_active: true,
    });
    const patient_inactive = await patientModel.countDocuments({
      is_active: false,
    });
    const patient_new = await patientModel.countDocuments({
      new_patient: true,
    });
    const patient_new_in_range = await patientModel.countDocuments({
      new_patient: true,
      active_date: DateRange,
    });
    const payment = await treatmentModel.aggregate([
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
      const treatmentStat = await treatmentModel.aggregate([
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
