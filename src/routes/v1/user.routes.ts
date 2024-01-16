import express from "express";

// Custom imports 
import { getAllUsers, getUserWithId, getUserWithToken, setOrUpdateAvatar, updateEmail, updateUserDetails } from "./../../controllers";
import { catchAsync } from "./../../utils";
import { auth, verifiedEmailRequired } from "./../../middlewares";
import { requiredRole } from "./../../middlewares";
import multer from 'multer';

import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(path.join(__dirname + '/../../public'))) {
            fs.mkdirSync(path.join(__dirname + '/../../public'));
        }
        if (!fs.existsSync(path.join(__dirname + '/../../public/avatars'))) {
            fs.mkdirSync(path.join(__dirname + '/../../public/avatars'));
        }
        cb(null, path.join(__dirname + '/../../public/avatars'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `avatar-${Date.now() + Math.floor(Math.random() * 9999)}`;
        cb(null, uniqueSuffix + path.extname(file?.originalname));
    }
})

const upload = multer({ storage: storage })

const router = express.Router();

router.use(auth);
router.use(verifiedEmailRequired);

router.get("/", catchAsync(getAllUsers)); // for now it can be available for users.
router.get("/currentUser", catchAsync(getUserWithToken));
router.put("/", catchAsync(updateUserDetails))
router.patch("/email", catchAsync(updateEmail));
router.post("/avatar", upload.single('avatar'), catchAsync(setOrUpdateAvatar));
router.get("/:id", catchAsync(getUserWithId));

export default router;  