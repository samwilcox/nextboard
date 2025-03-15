/**
 * NextBoard - A Modern Bulletin Board System
 * "Where discussions take the next step."
 * 
 * Author: Sam Wilcox
 * Email: sam@nextboard.org
 * Website: https://www.nextboard.org
 * GitHub: https://github.com/samwilcox/nextboard
 * 
 * License: GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 * For full license details, visit: https://license.nextboard.org
 */

const GlobalsService = require('../services/globalsService');
const LocaleHelper = require('../helpers/localeHelper');
const NotFoundError = require('../errors/notFoundError');
const InvalidPermissionsError = require('../errors/invalidPermissionsError');
const RequiredFieldError = require('../errors/requiredFieldError');

/**
 * Middleware that handles all uncaught errors in NextBoard.
 * NextBoard uses thrown errors to notify the user of any errors that occur.
 * 
 * @param {Object} error - The error object instance.
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Object} next - The next middleware to execute.
 */
const errorMiddleware = async (error, req, res, next) => {
    if (process.env.ENVIRONMENT_TYPE === 'development') {
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`Stack Trace: ${error.stack}`);
    }

    const locale = req.locale;
    let statusCode = 500;
    let errorMessage = locale.errors.unexpectedErrorOccured;
    let errorTitle = locale.errorMiddleware.generalError;
    
    if (error instanceof NotFoundError) {
        statusCode = 404;
        errorMessage = error.message;
        errorTitle = locale.errorMiddleware.notFoundError;
    } else if (error instanceof InvalidPermissionsError) {
        statusCode = 403;
        errorMessage = error.message;
        errorTitle = locale.errorMiddleware.invalidPermissionsError;
    } else if (error instanceof RequiredFieldError) {
        statusCode = 400;
        errorMessage = error.message;
        errorTitle = locale.errorMiddleware.missingField;
    }
    
    const globals = await GlobalsService.get(req);
    res.render('errors/error', {
        layout: 'layout',
        errorMessage,
        statusCode: LocaleHelper.replace('errorMiddleware', 'statusCode', 'statusCode', statusCode),
        errorTitle,
        ...globals 
    });
};

module.exports = errorMiddleware;