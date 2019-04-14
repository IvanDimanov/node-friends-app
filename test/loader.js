const chai = require('chai');
const chaiString = require('chai-string');

chai.use(chaiString);

global.expect = chai.expect;
global.should = chai.should;
