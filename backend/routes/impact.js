const express = require('express');
const router = express.Router();

// GET /api/impact/assumptions
router.get('/assumptions', (req, res) => {
  return res.json({
    success: true,
    assumptions: {
      avg_bag_weight_grams: 8.0, // Average composite weight per plastic carry bag
      co2_per_kg_plastic: 3.5,   // CO2 equivalent (kg) emitted per kg of low-density polyethylene (LDPE)
      landfill_volume_per_1000_bags_m3: 0.15, // Approx volume displaced in landfill
      decomposition_years_min: 100,
      decomposition_years_max: 500,
      disclaimer: "Environmental estimates depend on bag material, thickness, weight, disposal pathway, and lifecycle assumptions. Conversion factors are based on standard LDPE plastic waste literature."
    }
  });
});

// POST /api/impact/calculate
router.post('/calculate', (req, res) => {
  try {
    const {
      bagsAvoided = 1000,
      bagWeightGrams = 8.0,
      studentPopulation = 3500,
      reusableAdoptionTargetPct = 40
    } = req.body;

    const bagsNum = parseFloat(bagsAvoided) || 0;
    const weightPerBagGrams = parseFloat(bagWeightGrams) || 8.0;

    // Calculations
    const wasteAvoidedKg = Math.round(((bagsNum * weightPerBagGrams) / 1000) * 10) / 10;
    const co2AvoidedKg = Math.round((wasteAvoidedKg * 3.5) * 10) / 10;
    const yearlyPotentialBags = Math.round(bagsNum * 12);
    const yearlyWasteAvoidedKg = Math.round(((yearlyPotentialBags * weightPerBagGrams) / 1000) * 10) / 10;
    const reusableBagsAdopted = Math.round((studentPopulation * (reusableAdoptionTargetPct / 100)));
    const percentageImprovement = Math.round((reusableAdoptionTargetPct / 100) * 100);

    return res.json({
      success: true,
      calculation: {
        bagsAvoided: bagsNum,
        wasteAvoidedKg,
        co2AvoidedKg,
        yearlyPotentialBags,
        yearlyWasteAvoidedKg,
        reusableBagsAdopted,
        percentageImprovement,
        assumptions: {
          bagWeightGrams: weightPerBagGrams,
          co2FactorKgPerKg: 3.5,
          studentPopulation,
          reusableAdoptionTargetPct
        }
      }
    });
  } catch (err) {
    console.error('Impact calculation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to calculate environmental impact.' });
  }
});

module.exports = router;
