import passport from 'koa-passport';
import {app} from '../../server.js';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { logger } from '../config/configLogger.js';
import { usuariosDao as apiUsuarios } from '../service/index.js';
import multer from 'multer';
import { createTransport } from 'nodemailer';

// const TEST_MAIL = 'baby.tillman@ethereal.email';

// const transporter = createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: TEST_MAIL,
//         pass: 'BfmWpGTqfPeBGrNqSY'
//     }
// });

const generateHashPassword = async (password) => {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

const verifyPass = async (usuario, password) => {
    const match = await bcrypt.compare(password, usuario.password);
    return match;
}

const LocalStrategy = Strategy;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/backend/desafio/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`);
    }
})

export const upload = multer({ storage: storage });

passport.use(new LocalStrategy(
    async (username, password, done) => {
        const existeUsuario = await apiUsuarios.getById(username);
        if (!existeUsuario) {
            return done(null, false);
        } else {
            const match = await verifyPass(existeUsuario, password);
            if(!match){
                return done(null, false);
            }
            return done(null, existeUsuario);
        }
    }
));

passport.serializeUser((usuario, done)=>{
    done(null, usuario.username);
});

passport.deserializeUser (async (email, done) => {
    const existeUsuario = await apiUsuarios.getById(email);
    done(null, existeUsuario);
});

export const pass = async (ctx) => {
    return passport.authenticate('local', { session: false }, (err, user) => {
        if(!user){
            return ctx.redirect('/api/login-error');
        }
        return ctx.redirect('/api/');
    })(ctx);
}

// = passport.authenticate('local', {successRedirect: '/api/', failureRedirect: '/api/login-error'});

export function home (ctx) {
    const {url, method } = ctx.req;
    logger.info(`Ruta ${method} ${url}`);
    ctx.redirect('/api/home/');
};

export const login =  async (body) => {
    const {url, method } = body.req;
    logger.info(`Ruta ${method} ${url}`);
    await body.render('viewLogin')
}

export function viewLogout (ctx) {
    const {url, method } = ctx.req;
    const nombre = req.user.username;
    logger.info(`Ruta ${method} ${url}`);
    req.logOut(err => {
        ctx.render('viewLogout', { nombre });
    });
};

export const register = async (body) => {
    const {url, method } = body.req;
    logger.info(`Ruta ${method} ${url}`);
    await body.render('viewRegistro');
};

export async function registerNewUser(ctx) {
    try {
        const validationRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { name, lastname, adress, dateOfBirth, phone, username, password } = req.body;
        const avatar = req.file.filename;
        const nuevoUsuario = await apiUsuarios.getById(username);
        if (validationRegex.test(username) && (!nuevoUsuario)) {
            const newUser = { name, lastname, adress, dateOfBirth, phone, avatar, username, password: await generateHashPassword(password)};
            await apiUsuarios.add(newUser);
            // const mailOptions = {
            //     from: 'Servidor Node.js',
            //     to: TEST_MAIL,
            //     subject: 'Nuevo Registro',
            //     html: `<h1>${name}</h1><h5>Email: ${username}</h5><h5>Edad: ${dateOfBirth}</h5><h5>Dirección: ${adress}</h5><h5>Teléfono: ${phone}</h5>`
            // }
            // const info = await transporter.sendMail(mailOptions);
            // logger.info(info);
            ctx.redirect('/api/login');
        } else {
            ctx.render('viewRegistroFallido', {username})
        }
    } catch (error) {
        logger.error(error);
    }
};

export const loginError = async body => {
    const {url, method } = body.req;
    logger.info(`Ruta ${method} ${url}`);
    await body.render('viewLoginFallido');
};






