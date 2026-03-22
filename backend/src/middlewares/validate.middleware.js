const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        // Evaluate the schema using the injected Joi instance
        const resolvedSchema = typeof schema === 'function' ? schema(Joi) : schema;
        
        const { error, value } = resolvedSchema.validate(req.body, { 
            abortEarly: false, 
            stripUnknown: true // Removes any attributes not explicitly defined in the schema
        });

        if (error) {
            
            // Return 400 Bad Request directly
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                data: error.details.map(err => ({
                    field: err.context.key,
                    message: err.message
                }))
            });
        }

        // Replace req.body with the sanitized version
        req.body = value;
        next();
    };
};

module.exports = validate;