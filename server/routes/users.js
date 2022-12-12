const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// router.post("/upload", upload.single("image"), async (req, res) => {
//   console.log("req", req.file)
//   const saveImage = Image({
//     userId: req.body.userId,
//     img: {
//       data: fs.readFileSync("images/" + req.file.filename),
//       contentType: "image/png"
//     }
//   })
//   const img = await saveImage.save().then(console.log("Img is saved")).catch((err) => {
//     console.log(err, "error has occured")
//   })
//   res.status(200).json(img)
// })

router.put("/change-img/:id", upload.single("image"), async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only change your own profile picture" });
  }

  const updates = {
    img: {
      data: fs.readFileSync("images/" + req.file.filename),
      contentType: "image/png",
    },
  };

  User.findByIdAndUpdate(
    req.body.userId,
    updates,
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

router.put("/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only update your own account" });
  }

  const updates = {
    fullname: req.body.fullname,
    username: req.body.username,
  };

  User.findByIdAndUpdate(
    req.body.userId,
    updates,
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res.status(200).json(result);
      }
    }
  );
});

router.get("/main", async (req, res) => {
  try {
    const user = await User.findById("63893e3bfc3d34d25d9ae0cd");

    let profilePicture;
    if (user.img.data) {
      const buffer = Buffer.from(user.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }

    const mainUser = {
      ...user.toJSON(),
      img: profilePicture
    }

    res.status(200).json(mainUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
