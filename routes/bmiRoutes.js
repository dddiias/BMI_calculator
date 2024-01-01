const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

// BMI calculation history
let bmiHistory = [];

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/history', (req, res) => {
    res.render('history', { bmiHistory });
});

router.route('/bmicalculator')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../views/index.html'));
    })
    .post((req, res) => {
        const height = parseFloat(req.body.height);
        const weight = parseFloat(req.body.weight);
        const age = parseInt(req.body.age);
        const gender = req.body.gender;
        const units = req.body.units;

        const bmiResult = calculateBMI(height, weight, units);

        // Save BMI calculation to history
        const timestamp = new Date().toLocaleString();
        const entry = {
            timestamp,
            height,
            weight,
            age,
            gender,
            units,
            bmiResult
        };
        bmiHistory.push(entry);

        const interpretation = getInterpretation(bmiResult);
        res.render('results', { bmiResult, interpretation });
    });


function calculateBMI(height, weight, units) {
    let bmi;

    if (units === 'metric') {
        // Metric units: height in meters, weight in kilograms
        bmi = weight / Math.pow(height, 2);
    } else if (units === 'imperial') {
        // Imperial units: height in inches, weight in pounds
        bmi = (weight / Math.pow(height, 2)) * 703;
    } else {
        return 'Invalid units';
    }

    return bmi.toFixed(2);
}

function getInterpretation(bmi) {
    let interpretation;

    if (bmi < 18.5) {
        interpretation = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        interpretation = 'Normal weight';
    } else if (bmi >= 25 && bmi < 29.9) {
        interpretation = 'Overweight';
    } else {
        interpretation = 'Obese';
    }

    return `BMI Category: ${interpretation}`;
}

module.exports = router;
