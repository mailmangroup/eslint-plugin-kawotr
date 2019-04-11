/**
 * @fileoverview Check for valid uses of the kawo.tr translation function
 * @author Fergus Jordan
 */
'use strict';

const requireIndex = require( 'requireindex' );


// IMPORT ALL RULES IN LIB/RULES
module.exports.rules = requireIndex( __dirname + '/rules' );