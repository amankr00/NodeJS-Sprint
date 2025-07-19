const fs = require('fs');

const requestHandler = (req , res) => {
    const url = req.url
    const method = req.method
    if(url === '/'){
        res.write('<html>')
        res.write('<head><title>My First Page</title><head>')
        res.write('<body><form  action = "/message" method = "POST"><input type = "text" name = "message"><button type="submit">Send</button></form></body>')
        res.write('<html>')
        return res.end()
    }
    else if(url === '/message' && method === 'POST'){
        // To extract the data from buffer. Loops until everthing is parsed
        const body = [];
        req.on('data' , (chunk) => {
            console.log(chunk)
            body.push(chunk)
        })
        // **** 

        // When all chunk is has been read. Stored in body . End event triggered
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log(parsedBody)
            // [1] means taking the element at position 1 from -> message=givenInput so at `givenInput` is at 1
            const message = parsedBody.split('=')[1]
            fs.writeFile('message.txt' , message, (err) => {
                res.statusCode = 302
                res.setHeader('Location' , '/')
                return res.end()
            })
        })
        return 
        // ****
    }
    res.setHeader('Content-Type' , 'text/html')
    res.write('<html>')
    res.write('<head><title>This is created by me</title><head>')
    res.write('<body><p>Hey! I have started coding!!</p><body>')
    res.write('</html>')
    res.end()
}

module.exports = requestHandler;