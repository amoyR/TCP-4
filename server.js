const net = require("net")

const server = net.createServer(socket => {
  socket.setEncoding('utf8')
  socket.on("data", data => {
    console.log(data)
    const separateInx = data.indexOf("\r\n")
    const reqLine = data.substring(0, separateInx)
    const reqLineAry = reqLine.split(" ")
    const method = reqLineAry[0]
    const path = reqLineAry[1]

    const version = reqLineAry[2]
    const statusCode = "200 OK"
    const body = "Hello World"
    const contentLen = body.length
    const dicimalByte = encodeURI(body).replace(/%../g, "*").length
    console.log(dicimalByte)
    const hex = dicimalByte.toString(16)


    const response = `${version} ${statusCode}\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked\r\n\r\n${hex}\r\n${body}\r\n0\r\n\r\n`
    //const response = `${version} ${statusCode}\r\nContent-Length: ${contentLen}\r\n\r\n${body}`
    console.log(response)
    socket.write(response)
  })
}).listen(8888)
