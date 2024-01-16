import express from 'express';
import { auth, verifiedEmailRequired } from './../../middlewares';
import { createNewDiary, deleteDiaryWithId, getAllDiariesOfUser, getDiaryByDate, getDiaryById, updateDiaryWithId } from './../../controllers';
import { catchAsync } from './../../utils';

const router = express.Router();

router.use(auth);
router.use(verifiedEmailRequired);

router.get("/", catchAsync(getAllDiariesOfUser));  // add the range selector and pagination.
router.post("/", catchAsync(createNewDiary)); 
// router.get("/date/:date", catchAsync(getDiaryByDate));
router.get("/:id", catchAsync(getDiaryById));
router.delete("/:id", catchAsync(deleteDiaryWithId));
router.patch("/:id", catchAsync(updateDiaryWithId));


export default router; 