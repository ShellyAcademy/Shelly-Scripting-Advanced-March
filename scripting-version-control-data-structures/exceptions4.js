function myException(name, statusCode) {
  return { name: name, statusCode: statusCode };
}

function test2() {
  throw myException("My exception", 3);
}

function test() {
  throw { message: "My custom error", errorCode: 2 };
}

try {
  test();
} catch (error) {
  console.log(error);
}
