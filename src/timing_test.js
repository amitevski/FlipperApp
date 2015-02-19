/**
 * Created by acomitevski on 15/02/15.
 */

'use strict';

(function benchEventLoop(last) {
  console.log(process.hrtime(last));
  var current = process.hrtime();
  setImmediate(function () { benchEventLoop(current) });
})(process.hrtime());