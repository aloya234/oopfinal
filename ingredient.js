const { app, BrowserWindow } = require('electron');
const fs = require('fs')
const path = require('path')

var btnCreate = document.getElementById('btnCreate')
var btnRead = document.getElementById('btnRead')
var btnDelete = document.getElementById('btnDelete')
var btnUpdate=document.getElementById('btnUpdate')
var fileName = document.getElementById('fileName')
var fileContents = document.getElementById('fileContents')

let pathName = path.join(__dirname, 'Files')

btnCreate.addEventListener('click', function(){
    let file = path.join(pathName, fileName.value)
    let contents = fileContents.value
    fs.writeFile(file, contents, function(err){
        if(err){
            return console.log(err)
        }
        var txtfile = document.getElementById("fileName").value
        alert(txtfile + " text file was created ")
        console.log("The file was created")
        fileName.value=""
        fileContents.value=""
    })
})
btnRead.addEventListener('click',function(){
    let file=path.join(pathName,fileName.value)
    fs.readFile(file,function(err,data){
        if(err){
            return console.log(err)
        }
        fileContents.value=data
        console.log("The file was read!")
    }) 
}) 
btnDelete.addEventListener('click',function(){
    let file=path.join(pathName,fileName.value)
    fs.unlink(file,function(err){
        if(err){
            return console.log(err)
        }
        fileName.value=""
        fileContents.value=""
        console.log("The file was deleted!")
    })
})
btnUpdate.addEventListener('click', function(){
    let file = path.join(pathName, fileName.value)
    let contents = fileContents.value
    fs.writeFile(file, contents, function(err){
        if(err){
            return console.log(err)
        }
        var txtfile = document.getElementById("fileName").value
        alert(txtfile + " text file was update ")
        fileName.value=""
        fileContents.value=""
        console.log("The file was update")
    })
})