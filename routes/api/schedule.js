const express = require('express');
const uuid = require('uuid');
const json2csv = require ('json2csv');
const fs = require('fs');
const router = express.Router();
const schedule = require('../../Schedule');

// Gets all matches
router.get('/', (req, res) => { 
    //res.json(runs)); 
    //res.format({
    //    'text/plain': function () {
    //        res.send(json2csv.parse(schedule))
    //    }
    //  })
    //});
    res.send(fs.readFileSync('./Schedule.json', 'utf-8'));
    try {
        const jsonString = fs.readFileSync('./Schedule.json', 'utf-8');
        schedule2 = JSON.parse(jsonString);
    } catch (err) {
        console.log(err);
    } 
    // res.format({
    //     'text/plain': function () {
    //         res.send(json2csv.parse(schedule2))
    //     }
    // })
    res.send(schedule2);
});

// Get single match
router.get('/:match', (req, res) => {
    const found = schedule.some(event => event.match === parseInt(req.params.match));

    if (found) {
    res.json(schedule.filter(event => event.match === parseInt(req.params.match)));
    } else {
        res.status(400).json({ msg: `No match found with the id of ${req.params.match}` });
    }
});

// Create Match
router.post('/', (req, res) => {
    console.log(req.body);
    console.log(eval(`req.body.blue1_name${1}`));
    console.log("numMatches " + req.body.numMatches);
    var matchSchedule = [];
    console.log("numMatches " + req.body.numMatches);
    for(let i=0; i < Number.parseInt(req.body.numMatches); i++){
        console.log("numMatches " + req.body.numMatches);
        matchSchedule[i] = {
            match: i+1,
            blue_1: {
                name: eval(`req.body.blue1_name${i+1}`),
                number: eval(`req.body.blue1_number${i+1}`)
            },
            blue_2: {
                name: eval(`req.body.blue2_name${i+1}`),
                number: eval(`req.body.blue2_number${i+1}`)
            },
            red_1: {
                name: eval(`req.body.red1_name${i+1}`),
                number: eval(`req.body.red1_number${i+1}`)
            },
            red_2: {
                name: eval(`req.body.red2_name${i+1}`),
                number: eval(`req.body.red2_number${i+1}`)
            }
        };
    }
    console.log(req.body);
    console.log(matchSchedule);

    fs.writeFileSync('./Schedule.json', JSON.stringify(matchSchedule, null, 3), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('File successfully written');
        }
    })
    res.redirect('/api/schedule');
});

// Update Match
router.put('/:match', (req, res) => {
    const found = schedule.some(event => event.match === parseInt(req.params.match));

    if (found) {
        const updMatch = req.body;
        schedule.forEach(event => {
            if(event.match === parseInt(req.params.match)) {
            event.match = updMatch.match ? updMatch.match : event.match;

            res.json({ msg: 'Match updated', event });
            }
        });
    } else {
        res.status(400).json({ msg: `No match found with the id of ${req.params.match}` });
    }
});

// Delete Match
router.delete('/:match', (req, res) => {
    const found = schedule.some(event => event.match === parseInt(req.params.match));

    if (found) {
    res.json({ msg: 'Match deleted', event: schedule.filter(event => event.match !== parseInt(req.params.match))});
    } else {
        res.status(400).json({ msg: `No match found with the id of ${req.params.match}` });
    }
});

module.exports = router;