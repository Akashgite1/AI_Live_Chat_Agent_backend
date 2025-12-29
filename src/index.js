import dotenv from 'dotenv';
import connectDb from './db/index.js'
import app from './app.js'

// configure dotenv
dotenv.config({
    path: './.env'
})

// use functional chaining to start the server only after successful database connection
// use connectDb to connect to the database 
connectDb()  
    .then(() => {

        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port :" ${process.env.PORT}`);
        });

    })
    .catch((error) => {
        console.log("Failed to connect to the database", error);
        // exit the process with failure process.exit(1) prevents zombie servers
        process.exit(1);
    });