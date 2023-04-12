import { Router } from "express";
import { auth } from "../../auth/index.js";
import {
  home,
  login,
  loginError,
  pass,
  register,
  registerNewUser,
  upload,
  viewLogout,
} from "../controllers/auth.controller.js";

const routerAuth = new Router();

routerAuth.get("/", home);

routerAuth.get("/login", login);

routerAuth.post("/login", pass);

routerAuth.get("/logout", auth, viewLogout);

routerAuth.get("/register", register);

routerAuth.post("/register", upload.single("avatar"), registerNewUser);

routerAuth.get("/login-error", loginError);

export { routerAuth };
