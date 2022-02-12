const express = require('express');
const uuid = require('uuid');
const json2csv = require ('json2csv');
const fs = require('fs');
const router = express.Router();
const runs = require('../../Runs');

// Gets all runs
router.get('/', (req, res) => { 
    //res.json(runs)); 
    //res.format({
    //    'text/plain': function () {
    //        res.send(json2csv.parse(runs))
    //    }
    //  })
    //});
    try {
        const jsonString = fs.readFileSync ('./Runs.json', 'utf-8');
        runs2 = JSON.parse(jsonString);
    }   catch (err) {
        console.log(err);
    } 
    res.format({
        'text/plain': function () {
            res.send(json2csv.parse(runs2))
            }
        })
    });

// Get single run
router.get('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
    res.json(runs.filter(run => run.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

// Create Run
router.post('/', (req, res) => {
    const newRun = {
        id: uuid.v4(),
        team_name: req.body.team_name,
        team_number: req.body.team_number,
        points: '0',
        detect: req.body.detect,
        alliance_park_auto: req.body.alliance_park_auto,
        warehouse_park_auto: req.body.warehouse_park_auto,
        spin_carousel: req.body.spin_carousel,
        pick_up: req.body.pick_up,
        deliver_alliance: req.body.deliver_alliance,
        deliver_shared: req.body.deliver_shared,
        barrier: req.body.barrier,
        stuck_on_barrier: req.body.barrier_stuck,
        ducks: req.body.ducks,
        alliance_park_end: req.body.alliance_park_end,
        warehouse_park_end: req.body.warehouse_park_end,
        tse: req.body.tse,
        tse_other_team: req.body.tse_other_team,
        notes: req.body.notes
    }

    if(!newRun.team_name || !newRun.team_number) {
        return res.status(400).json({ msg: 'Please fill out the entire form before submitting.' });
    }
    try {
        const jsonString = fs.readFileSync ('./Runs.json', 'utf-8');
        runs2 = JSON.parse(jsonString);
    }   catch (err) {
        console.log(err);
    }
    runs2.push(newRun)

    fs.writeFile('./Runs.json', JSON.stringify(runs2, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('File successfully written');
        }
    })
    res.redirect('/api/runs');
});

// Update Run
router.put('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
        const updRun = req.body;
        runs.forEach(run => {
            if(run.id === parseInt(req.params.id)) {
            run.team_name = updRun.team_name ? updRun.team_name : run.team_name;
            run.team_number = updRun.team_number ? updRun.team_number : run.team_number;

            res.json({ msg: 'Run updated', run });
            }
        });
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

// Delete Run
router.delete('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
    res.json({ msg: 'Run deleted', runs: runs.filter(run => run.id !== parseInt(req.params.id))});
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

module.exports = router;