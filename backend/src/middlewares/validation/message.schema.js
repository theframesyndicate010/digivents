const createMessageSchema = (Joi) => Joi.object({
    first_name: Joi.string().allow('', null).max(100),
    last_name: Joi.string().allow('', null).max(100),
    name: Joi.string().allow('', null).max(255),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
    }),
    subject: Joi.string().allow('', null).max(255),
    message: Joi.string().required().min(5).messages({
        'string.empty': 'Message is required',
        'string.min': 'Message must be at least 5 characters long'
    }),
    status: Joi.string().valid('new', 'read', 'archived', 'replied').default('new')
});

const updateMessageSchema = (Joi) => Joi.object({
    first_name: Joi.string().allow('', null).max(100),
    last_name: Joi.string().allow('', null).max(100),
    name: Joi.string().allow('', null).max(255),
    email: Joi.string().email(),
    subject: Joi.string().allow('', null).max(255),
    message: Joi.string().min(5),
    status: Joi.string().valid('new', 'read', 'archived', 'replied')
}).min(1); // At least one field must be provided for update

module.exports = {
    createMessageSchema,
    updateMessageSchema
};
