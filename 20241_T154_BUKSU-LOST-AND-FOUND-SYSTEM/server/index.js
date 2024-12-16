//mongodb+srv://casiega11:<db_password>@cluster0.qcpro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require ('express')
const connectDB = require('./db')

const app = express()

connectDB()

app.listen(3000, () => {
    console.log("app is running");
})