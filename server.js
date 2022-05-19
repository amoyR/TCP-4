const net = require("net")
const fs = require("fs")

const basePath ="/Users/amoyr/projects/TCP-4/dataBase"

const server = net.createServer(socket => {
  socket.setEncoding('utf8')
  socket.on("data", data => {
    console.log(data)
    
    const reqLineAry = parse(data)
    const method = reqLineAry[0]
    const path = reqLineAry[1]
    const version = reqLineAry[2]

    const statusCodeAndBodyAry = createStatusCodeAndBody(basePath, path)
    const statusCode = statusCodeAndBodyAry[0]
    const body = statusCodeAndBodyAry[1]
    //const bodySize = calcByte(basePath + path)
    const hex = calcHex(body)
    //const statusCode = "200 OK"
    //const htmlFile = fetchFile()
    //const body = htmlFile
    ////const body = "<html>\r\n<body>\r\n<h1>Hello world</h1>\r\n</body>\r\n</html>"
    //const dicimalByte = encodeURI(body).replace(/%../g, "*").length
    //const hex = dicimalByte.toString(16)

    //const response = `${version} ${statusCode}\r\nContent-Type: image/jpeg\r\nContent-Length: ${bodySize}\r\n\r\n${body}`
    const response = `${version} ${statusCode}\r\nTransfer-Encoding: chunked\r\n\r\n${hex}\r\n${body}\r\n0\r\n\r\n`

    //const response = `${version} ${statusCode}\r\nContent-Length: ${contentLen}\r\n\r\n${body}`
    //console.log(response)
    socket.write(response)
  })

    socket.on('close', () => {
        console.log('client closed connection');
    });

  
}).listen(8888)


function createStatusCodeAndBody (basePath, requestedPath) {
  
  const filePath = basePath + requestedPath

  try {

    const statusCode = "200 OK"
    const body = fs.readFileSync(filePath, 'binary')
    const statusCodeAndBodyAry = [statusCode, body]
    return statusCodeAndBodyAry

  } catch (e) {

    const statusCode = "404 Not Found"
    const body = "Not Found"
    const statusCodeAndBodyAry = [statusCode, body]
    return statusCodeAndBodyAry

  }
}
  
//function statusAndBody (body) {
//    try {
//      const resBody = body
//      const statusCode = "200 OK"
//      const statusAndBody = [statusCode, resBody]
//      return statusAndBody
//    } catch (e) {
//      const statusCode = "404 Not Found"
//      const resBody    = "Not Found"
//      const statusAndBody = [statusCode, resBody]
//      return statusAndBody
//    }
//}

function calcHex (body) {
  const dicimalByte = encodeURI(body).replace(/%../g, "*").length
  const hex = dicimalByte.toString(16)
  return hex
}

function calcByte (path) {
  const stat  = fs.statSync(path)
  const statSize = stat.size
  return statSize
}
//function GETMethod (basePath, requestedPath){
//    const filePath = basePath + requestedPath
//    const body = fs.readFileSync(filePath, "utf-8")
//    return body
//}
//
//
//function statusCode (func){
//  try {
//    func
//    const statusCode = "200 OK"
//    return statusCode
//  } else {
//    const statusCode = "404 Not Found"
//    return statusCode
//  }
//}
//
//function calcHex (body) {
//  const dicimalByte = encodeURI(body).replace(/%../g, "*").length
//  const hex = dicimalByte.toString(16)
//  return hex
//}
//
function parse (data){
  const separateInx = data.indexOf("\r\n")
  const reqLine = data.substring(0, separateInx)
  const reqLineAry = reqLine.split(" ")
  return reqLineAry
}


