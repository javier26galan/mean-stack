const express = require("express");

const postController = require("../controllers/post");
const checAuthor = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();





router.post("", checAuthor, extractFile, postController.createPost);

router.put("/:id", checAuthor, extractFile, postController.updatePost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.delete("/:id", checAuthor, postController.deletePost);

module.exports = router;
