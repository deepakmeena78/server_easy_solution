import Contact from "../../model/Contact.model.js";

export const createContact = async (req, res) => {
  try {
    console.log("Received Contact Request:", req.body);

    const result = await Contact.create(req.body);

    if (result) {
      return res.status(201).json({ msg: "Message sent successfully", result });
    }

    return res.status(400).json({ msg: "Failed to create contact" });
  } catch (error) {
    console.error("CREATE CONTACT ERROR:", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};
