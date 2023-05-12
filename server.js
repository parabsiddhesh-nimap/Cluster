const express = require('express');
const cluster = require("cluster");
const process = require("process");
const os = require("os");

const totalCpus = os.cpus().length;
console.log("totalCpus: " + totalCpus);

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    for (let i=0;i<totalCpus;i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
      });
}else {
    const app = express();
    const Port = 3001;

    app.get("/", (req, res) => { 
        setTimeout (() =>  {  
        return res.json({
            message:`Hello, Your ProcessID IS ${process.pid}  `
        });
    },10000);
    }).listen(Port);

    console.log(`worker started on ${process.pid}`);
}