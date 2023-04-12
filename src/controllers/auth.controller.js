import bcrypt from "bcrypt";
import multer from "multer";
import { createTransport } from "nodemailer";
import passport from "passport";
import { Strategy } from "passport-local";
import { config } from "../config/config.js";
import { logger } from "../config/configLogger.js";
import { userDao as userApi } from "../service/index.js";

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.server.TEST_EMAIL,
    pass: config.server.PASS_EMAIL,
  },
});

async function generateHashPassword(password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

async function verifyPass(user, password) {
  const match = await bcrypt.compare(password, user.password);
  return match;
}

const LocalStrategy = Strategy;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const userExists = await userApi.getById(username);
    if (!userExists) {
      return done(null, false);
    } else {
      const match = await verifyPass(userExists, password);
      if (!match) {
        return done(null, false);
      }
      return done(null, userExists);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (email, done) => {
  const userExists = await userApi.getById(email);
  done(null, userExists);
});

export const pass = passport.authenticate("local", {
  successRedirect: "/api/",
  failureRedirect: "/api/login-error",
});

export function home(req, res) {
  const { url, method } = req;
  logger.info(`Route ${method} ${url}`);
  res.redirect("/api/home");
}

export function login(req, res) {
  const { url, method } = req;
  logger.info(`Route ${method} ${url}`);
  res.render("viewLogin");
}

export function viewLogout(req, res) {
  const { url, method } = req;
  const name = req.user.username;
  logger.info(`Route ${method} ${url}`);
  req.logOut((err) => {
    res.render("viewLogout", { name });
  });
}

export function register(req, res) {
  const { url, method } = req;
  logger.info(`Route ${method} ${url}`);
  res.render("viewRegister");
}

export async function registerNewUser(req, res) {
  try {
    const validationRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { name, lastname, adress, dateOfBirth, phone, username, password } =
      req.body;
    const avatar = req.file.filename;
    const newUser = await userApi.getById(username);
    if (validationRegex.test(username) && !newUser) {
      const newUser = {
        name,
        lastname,
        adress,
        dateOfBirth,
        phone,
        avatar,
        username,
        password: await generateHashPassword(password),
      };
      await userApi.add(newUser);
      const mailOptions = {
        from: "Servidor Node.js",
        to: config.server.TEST_EMAIL,
        subject: "New register",
        html: `<h1>${name}</h1><h5>Email: ${username}</h5><h5>Birthdate: ${dateOfBirth}</h5><h5>Adress: ${adress}</h5><h5>Phone: ${phone}</h5>`,
      };
      const info = await transporter.sendMail(mailOptions);
      logger.info(info);
      res.redirect("/api/login");
    } else {
      res.render("viewRegisterFailed", { username });
    }
  } catch (error) {
    logger.error(error);
  }
}

export function loginError(req, res) {
  const { url, method } = req;
  logger.info(`Route ${method} ${url}`);
  res.render("viewLoginFailed");
}
