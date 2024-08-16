 const data = [{
    "name": "",
    "duration": "",
    "guest": "",
    "Meeting ID": "86956259290",
    "Topic": "Learnable SOTU - L23E",
    "Start Time": "01/07/2024 8:22:20 AM",
    "End Time": "01/06/2024 10:01:31 AM",
    "Meeting Duration (Minutes)": "100",
    "Participants": "743"
},
{
    "name": "hey",
    "duration": "56",
    "guest": "",
    "Meeting ID": "86956259290",
    "Topic": "Learnable SOTU - L23E",
    "Start Time": "01/07/2024 8:22:20 AM",
    "End Time": "01/06/2024 10:01:31 AM",
    "Meeting Duration (Minutes)": "100",
    "Participants": "743"
}]



const participants = data.filter(participant => {
    if(participant.name && participant.duration) {
        delete participant["Meeting ID"]
        delete participant["Topic"]
        delete participant["Start Time"]
        delete participant["End Time"]
        delete participant["Meeting Duration (Minutes)"]
        delete participant["Participants"]
        delete participant["guest"]
        return participant
    }
})

console.log(participants);