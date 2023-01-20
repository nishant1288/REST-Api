const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const bodyParser = require("body-parser");

const port = 4000;
const server = express();


mongoose.connect("mongodb://localhost:27017/emploeedatabase").then(()=>
{
    console.log("Mongodb Connected");
} )
.catch((err) =>
{
    console.log(err);
} )

server.use(bodyParser.urlencoded({extended:false}));
server.use(express.json())





const employeeSchema = new mongoose.Schema({
    name : String,
    salary : Number
})

const employeeModel = new mongoose.model('employee', employeeSchema)

server.post('/api/v1/employee/new', async (req,res)=>  //to create or add new employee
{
    const employee = await employeeModel.create(req.body);

    res.status(201).json({
        success : true,
        employee
    })
}) //till here


server.get('/api/v1/employee', async (req,res) => { // to read about employee
    const getEmployees = await employeeModel.find();

    res.status(200).json({
        success : true,
        getEmployees
    })
} )

server.listen(port, ()=> {
    console.log(`server started at http://localhost:${port}`)
}) //till here

server.put('/api/v1/employee/:id', async(req,res) => { // to update the employee
    let employeeid = await employeeModel.findById(req.params.id);

    employeeid = await employeeModel.findByIdAndUpdate(req.params.id,req.body,{new:true, useFindAndModify:true, runValidators:true})

    res.status(200).json({
        success : true,
       employeeid
    })
}) // till here

server.delete('/api/v1/employee/:id', async(req,res) => {
    const delEmployee = await employeeModel.findById(req.params.id);

    if(!delEmployee) {
        return res.status(500).json({
            success : false,
            message : "product not found"
        })
    }

    await delEmployee.remove();

    res.status(200).json({
        success: true,
        message : "deleted"
    })
} )