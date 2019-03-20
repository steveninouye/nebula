const solution = require('./q/solution.js')

function getNewService() {
  return solution.getMessageService()
}

function testIntegerNegation() {
  const svc = getNewService()
  svc.enqueue('{"test": "message", "int_value": 512}')
  const returned = JSON.parse(svc.next(3))
  if (returned["int_value"] != -513)
      console.log("**FAILED** You did not negate the integer value.");
      
}
    
testIntegerNegation()
