const mongoose = require('mongoose');
const { Schema } = mongoose;


const ChecklistAnswerSchema = new Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChecklistQuestion',
        required: true,
    },

    Remarks: {
        type: String,
    },

    EvidenceDoc: {
        type: String,
    },

    YesNoAnswer: {
        type: String
    },

    GradingSystemAnswer: {
        type: Number
    },

    GoodFairPoorAnswer: {
        type: String
    },

    SafeAtRiskAnswer: {
        type: String
    },

    PassFailAnswer: {
        type: String
    },

    CompliantNonCompliantAnswer: {
        type: String
    },

    ConformObservationAnswer: {
        type: String
    }
})

const ChecklistAnswerModel = mongoose.model('ChecklistAnswer', ChecklistAnswerSchema);

// * Creation of ConductAudits Schema
const ConductAuditsSchema = new mongoose.Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    Checklist: {
        type: Schema.Types.ObjectId,
        ref: 'Checklist'
    },
    Answers: [{

        type : Schema.Types.ObjectId,
        ref : 'ChecklistAnswer',
    }],

    AuditBy: {
        type: String
    },

    AuditDate: {
        type: Date
    },
    TargetDate: {
        type: Date,
        required: true
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// * Creation of model
const ConductAudits = mongoose.model('ConductAudits', ConductAuditsSchema);
module.exports = {ConductAudits, ChecklistAnswerModel};