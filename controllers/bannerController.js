const Banner = require("../models/bannerModel");
const _ = require("lodash");

exports.createBanner = async (req, res) => {
  try {
    const { bannerUrl } = req.body;
    if (!bannerUrl)
      return res.status(400).json({ error: "Upload banner image" });

    const banner = await Banner.find({});
    if (banner.length > 0) {
        const updateFild = {bannerUrl: bannerUrl}
      const updateBanner = _.extend(banner[0], updateFild );
     
      updateBanner.save((err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: err });
        }
        return res.status(201).json({
          message: "Banner Update Successfully",
        });
      });
    } else {
      const newBanner = new Banner({
        bannerUrl,
      });
      newBanner.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Something Worng. Try Again" });
        }
        return res.status(201).json({ message: "Banner uploded." });
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something Worng. Try Latter." });
  }
};

exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.find({});
    if (!banner) return res.status(400).json({ error: "Banner not uploded." });
    return res.status(200).json({ message: banner });
  } catch (e) {
    res.status(500).json({ error: "Something Worng. Try Latter." });
  }
};
