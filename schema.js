const Joi = require('joi');

module.exports.patientSchema = Joi.object({
    listing: Joi.object({
        doctor: Joi.string().required(),
        reason: Joi.string().required(),
        Date: Joi.string().required(),
        Name: Joi.string().required(),
        Slot:Joi.string().required(),
        Phone_no: Joi.string().required(),
        
     }
    ).required()
});
module.exports.emailSchema = Joi.object({
    email: Joi.object({
        email: Joi.string().required(),
    }).required(),
});