import bodyParser = require('body-parser');
import * as express from 'express';
import mongoose from 'mongoose';
import { getEnvironmentVariable } from './environment/environment';
import UserRouter from './routers/UserRouter';
import * as cors from 'cors';
import AdminRouter from './routers/AdminRouter';
import DemoRouter from './routers/DemoRouter';


export class Server {
    public app : express.Application = express();
    corsOptions: cors.CorsOptions = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: '*',
        preflightContinue: false
    };
    constructor() {
        this.setConfiguration();
        this.setRoutes();
    }

    setConfiguration(){
        this.connectMongodb();
    }

    connectMongodb(){
        const databaseUrl = getEnvironmentVariable().db_url;
        mongoose.connect(databaseUrl).then(() => {
            console.log('connected to database');
        });
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use('*', cors(this.corsOptions));
    }

    setRoutes(){
        this.app.use('/api/user',UserRouter)
        this.app.use('/api/admin', AdminRouter)
        this.app.use('/api/demo', DemoRouter)

    }
    error404Handler(){
        this.app.use((req,res)=>{
            res.status(404).json({
                message: "not found",
                status_code : "404"
            })
        })
    }
    handleErrors(){
        this.app.use((error,req,res,next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'something went wrong',
                status_code : errorStatus
            })
        }) 
    }

    
}