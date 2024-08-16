const express = require('express')
const axios = require('axios')
const multer = require('multer')
const path = require('path')
const csvtojson = require('csvtojson')
const jsonata = require('jsonata');
const { log } = require('console')
const app = express() 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
})

function checkFileType(file, cb) {
    const filetypes = /csv | jpg/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Error: Csv only!");
    }
}

 
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

app.post('/upload', [upload.single('file')], async (req, res) => {
    try{
        const data = await csvtojson().fromFile(req.file.path)
        for(const item of data) {
            for(let key in item) {
                if(key === "Duration (Minutes)") {
                    item["meeting_duration"] = item[key]
                    delete item[key]
                }

                if(key === "Meeting ID") {
                    item["id"] = item[key]
                    delete item[key]
                }

                if(key === "duration") {
                    item[key] = item[key]
                }

                if(key === "Topic") {
                    item["topic"] = item[key]
                    delete item[key]
                }

                if(key === "Start Time") {
                    item["start_time"] = item[key]
                    delete item[key]
                }

                if(key === "End Time") {
                    item["end_time"] = item[key]
                    delete item[key]
                }

                if(key === "Participants") {
                    delete item[key]
                }
            }
        }
        const meeting = { ...data.find(meeting => typeof parseFloat(meeting["meeting_duration"]) === 'number' && typeof parseFloat(meeting["participants"]) === 'number') }
        // console.log(meeting);
        meeting["end_time"] = new Date(meeting["end_time"])
        meeting["start_time"] = new Date(meeting["start_time"])
        meeting["meeting_duration"] = parseFloat(meeting["meeting_duration"])
        meeting["id"] = parseFloat(meeting["id"])

        delete meeting["name"] 
        delete meeting["duration"]
        delete meeting["guest"]
            
        const participants = [ ...data.filter(participant => {
            console.log(participant);
            if(typeof parseFloat(participant.start_time) === 'number' && participant.end_time === 'Yes') {
                participant["name"] = participant["id"]
                participant["duration"] = parseFloat(participant["start_time"])
                participant["guest"] = participant["end_time"]
                delete participant["id"]
                delete participant["topic"]
                delete participant["start_time"]
                delete participant["end_time"]
                delete participant["meeting_duration"]
                delete participant["participants"]
                return participant
            }
        }) ]

        meeting["participants"] = participants.length

        if(!meeting.topic) {
            
        }

        return res.status(200).json({
            meeting,
            participants
        })
} catch(e) {
    console.log(e);
    return res.status(500).json(e)
}
})

app.listen(3000, ()=> {
    console.log('yeaaaah');
})