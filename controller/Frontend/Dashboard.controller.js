import Help from "../../model/Help.model.js";

export const globalSearch = async (req, res) => {
  try {
    const [Helpresult] = await Promise.all([
      searchHelper(req, Help),
    ]);

    const formattedResults = [{ data: [...Helpresult], type: "help" }];

    return res.status(200).json({
      msg: "Successfully Retrieved Data",
      data: formattedResults,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error Getting Data", error });
  }
};

const searchHelper = async (req, modal) => {
  try {
    const { search } = req.query;
    let updateQuery = { delete_at: null };

    if (search) {
      updateQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { pincode: { $regex: search, $options: "i" } },
      ];
    }

    const data = await modal.find(updateQuery).lean().exec();
    return data;
  } catch (error) {
    console.error("Error searching entry:", error);
    throw new Error("Error searching entry");
  }
};
