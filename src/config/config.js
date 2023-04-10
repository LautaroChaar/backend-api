import dotenv from 'dotenv';
dotenv.config();

export const config = {
    
    isAdmin: process.env.IS_ADMIN,

    atlas: {
        strConn: process.env.ATLAS_STRINCONN
    },

    server: {
        PERS: process.env.PERS,
        SECRET_KEY: process.env.SECRET_KEY,
        MONGO_URL: process.env.MONGO_URL,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        SESSION_TIME: process.env.SESSION_TIME,
        TEST_EMAIL: process.env.TEST_EMAIL,
        PASS_EMAIL: process.env.PASS_EMAIL
    },

}