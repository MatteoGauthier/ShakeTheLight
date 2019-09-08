const Yeelight = require("yeelight2")
var app = require("express")()
var server = require("http").Server(app)
var io = require("socket.io")(server)
chromecastjs = require("chromecast-js")

var browser = new chromecastjs.Browser()

browser.on("deviceOn", function(device) {
    device.connect()
    device.on("connected", function() {
        device.play("SONIC SHIT.mp3", 60, function() {
            console.log("Playing in your chromecast!")
        })
        device.seek(-30, function() {
            console.log("seeking backwards!")
        })

        
    })
})


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html")

})
app.get("/style.css", function(req, res) {

    res.sendFile(__dirname + "/public/style.css")
})

Yeelight.discover(function(light) {
    // light.toggle()
    io.on("connection", socket => {
        // console.log(socket)
        console.log(light.power)

        socket.on("shaked", data => {
            console.log("Got shaked:", data)
            light.toggle()
            socket.emit("shaked-ok", { message: "light toggled" })
        })

        socket.on("power-on", data => {
            console.log("Recevied power-on")
            
            light.set_power("on")
        })
        socket.on("power-off", data => {
            console.log("Recevied power-off")
            light.set_power("off")
        })
        socket.on("toggle", data => {
            console.log("Recevied toggle")
            light.toggle()
        })
    })
})
server.listen(8080)
