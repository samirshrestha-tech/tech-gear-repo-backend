import express from "express";
import { responder } from "../middlewares/response.js";
// import {
//   deleteAcategory,
//   getCategories,
//   insertCategory,
//   updateCategory,
// } from "../models/category/CategoryModel.js";
const router = express.Router();
import slugify from "slugify";
import { newProductValidation } from "../middlewares/joiValidation.js";
import { getProducts, insertProduct } from "../models/Product/ProductModel.js";
import multer from "multer";
// import { func } from "joi";

// multer config for attaching images

const imgFolderPath = "/public/img/product";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let error = null;

    // all sort of validation tests

    cb(error, imgFolderPath);
  },
  filename: function (req, file, cb) {
    let error = "";

    const fullFileName = Date.now() + "-" + file.originalname;

    // construct the unique file name
    console.log(file, "fn");

    cb(error, fullFileName);
  },
});

// end multer config

const upload = multer({ storage });

//create new category
router.post(
  "/",
  upload.array("images", 5),
  newProductValidation,
  async (req, res, next) => {
    try {
      // get server side validation
      // get the data
      //create slug

      req.body.slug = slugify(req.body.name, {
        lower: true,
        trim: true,
      });

      // get the file path where it was uploaded and store in the db

      if (req.files?.length) {
        const newImgs = req.files.map((item) => item.path);

        req.body.images = newImgs;
      }
      // insert into db

      const files = req.files;

      const product = await insertProduct(req.body);

      product?._id
        ? responder.SUCCESS({
            res,
            message: "New product Has been added successfully",
          })
        : responder.ERROR({
            res,
            message: "Unabale to add product",
          });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection")) {
        error.message =
          "Slug already exist,, try chaning the title and try again.";
        error.errorCode = 200;
      }
      next(error);
    }
  }
);

// get product
router.get("/", async (req, res, next) => {
  try {
    const product = await getProducts();
    responder.SUCCESS({
      res,
      message: "TO do get",
      product,
    });
  } catch (error) {
    next(error);
  }
});

//update category
// router.put("/", async (req, res, next) => {
//   try {
//     const { _id, title, status } = req.body;
//     if (_id && title && status) {
//       const cat = await updateCategory({ _id }, { title, status });

//       if (cat?._id) {
//         return responder.SUCCESS({
//           res,
//           message: "The Category has been updated",
//         });
//       }
//     }

//     responder.ERROR({
//       res,
//       message: "Invalid data",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

//delete category
// router.delete("/:_id", async (req, res, next) => {
//   try {
//     const { _id } = req.params;
//     const cat = await deleteAcategory(_id);

//     cat?._id
//       ? responder.SUCCESS({
//           res,
//           message: "The category has been deleted",
//         })
//       : responder.ERROR({
//           res,
//           message: "Error deleting Category, try again later",
//         });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
