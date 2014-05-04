/**
 * Created by acomitevski on 30/04/14.
 */


var chai = require('chai'),
  sinonChai = require("sinon-chai");

global.expect = chai.expect;
global.sinon = require('sinon');
global.proxyquire = require('proxyquire');
global.root = __dirname + '/../';
chai.should();
chai.use(sinonChai);