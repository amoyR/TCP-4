const net = require("net")
const fs  = require("fs")

const now  = new Date()
const date = now.toGMTString()

const input  = process.argv
let basePath = process.argv[2]
let portNum  = process.argv[3]
if (basePath === undefined || portNum === undefined) {
  const config = require('config');
  basePath     = config.server.base
  portNum      = config.server.port
}


const server = net.createServer(socket => {
  socket.setEncoding('utf8')
  socket.on("data", data => {

    const reqLineAry = parse(data)
    const method     = reqLineAry[0]
    const path       = reqLineAry[1]
    const version    = reqLineAry[2]

    const resComponent = createResMsg(path)
    const statusCode   = resComponent[0]
    const body         = resComponent[1]
    const bodySize     = resComponent[2]
    const contentType  = resComponent[3]


    const sender        = socket.remoteAddress
    const senderPortNum = socket.remotePort
    const accessLog     = `[${date}] "${method} ${path}" "from ${sender} ${senderPortNum}"` 
    console.log(accessLog)


    const response = `${version} ${statusCode}\r\nConnection: keep-alive\r\nKeep-Alive: timeout=5\r\nContent-Type: ${contentType}\r\nContent-Length: ${bodySize}\r\n\r\n`
    socket.write(response)
    socket.write(body)

    //const hex = calcHex(body)
    //const response = `${version} ${statusCode}\r\nConnection: keep-alive\r\nKeep-Alive: timeout=5\r\nTransfer-Encoding: chunked\r\n\r\n${hex}\r\n${body}\r\n0\r\n\r\n`
    
  })

}).listen(portNum)


function createResMsg (path) {
  path = "/../output.txt"
  const filePath = basePath + path
  const extension  = identifyExtension(path)
  try {
    const statusCode  = "200 OK"
    const body        = fs.readFileSync(filePath)
    const fileStat    = fs.statSync(filePath)
    const bodySize    = fileStat.size
    const contentType = setContentType(extension)
    return [statusCode, body, bodySize, contentType]
  } catch(e) {
    const statusCode  = "404 Not Found"
    const body        = "Not Found"
    const bodySize    = Buffer.byteLength(body)
    const contentType = setContentType(extension)
    return [statusCode, body, bodySize, contentType]
  }
}


function identifyExtension (path) {
  const separatedPath = path.split(".")
  const extension     = separatedPath[1]
  return extension
}

function setContentType (extension) {
  let contentType
  switch (extension){
    case "html":
      contentType = "text/html";
      break;
    case "css":
      contentType = "text/css";
      break;
    case "js":
      contentType = "application/javascript";
      break;
    case "jpeg":
      contentType = "image/jpeg";
      break;
    case "png":
      contentType = "image/png";
      break;
    case "bmp":
      contentType = "image/bmp";
      break;
    default:
      contentType = "text/plain";
  }
  return contentType
}

function parse (data){
  const separateInx = data.indexOf("\r\n")
  const reqLine     = data.substring(0, separateInx)
  const reqLineAry  = reqLine.split(" ")
  return reqLineAry
}


function calcHex (body) {
  const dicimalByte = encodeURI(body).replace(/%../g, "*").length
  const hex         = dicimalByte.toString(16)
  return hex
}


function calcByte (path, body) {
    const stat     = fs.statSync(path)
    const statSize = stat.size
    return statSize
}

