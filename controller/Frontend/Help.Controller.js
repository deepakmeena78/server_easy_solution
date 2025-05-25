import mongoose from "mongoose";
import path from "path";
import HelpModule from "../../model/Help.model.js";
import fs from "fs";
import { fileURLToPath } from "url";  // Import fileURLToPath
import { validationResult } from "express-validator";

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const CreateHelp = async (req, res) => {                               // Create Help 
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, help_seeker, category, location, pincode, status, help_date } = req.body;
        const gallery = req.files.map(file => file.path);
        const result = await HelpModule.create({ title, description, help_seeker, category, location, pincode, gallery, status, help_date });

        if (result) {
            return res.status(200).json({ msg: "Help Created Successfully", result });
        }
        return res.status(400).json({ msg: "Invalid Data. Help creation failed." });
    } catch (error) {
        console.error("CREATE HELP ERROR:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }// ====================== Help Create ==============================
};


export const FindHelpById = async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Help ID" });
        }
        const result = await HelpModule.findById(id)
            .populate("category");
        if (!result) {
            return res.status(404).json({ msg: "Help not Found" });
        }
        return res.status(200).json({ msg: "Help Data Successfully Fetched", result });
    } catch (error) {
        console.error("Error fetching help:", error);
        return res.status(500).json({ msg: "ERROR FIND HELP", error });
    }
};



export const UpdateHelp = async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        let { title, description, category, location, pincode, help_date, oldImages, status } = req.body;

        console.log("Received oldImages:", status);

        // ✅ **Convert oldImages from string to array & Fix Path Slashes**
        if (typeof oldImages === "string") {
            try {
                oldImages = JSON.parse(oldImages); // Convert to array
            } catch (err) {
                oldImages = [oldImages]; // If JSON parsing fails, store as array
            }
        }
        oldImages = oldImages.map(img => img.replace(/\\/g, "/")); // ✅ Convert `\` to `/`
        oldImages = oldImages || [];

        // ✅ **New images array**
        const newImages = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];

        // 🔹 **Check if the provided ID is valid**
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        // 🔹 **Fetch the existing help item**
        let helpItem = await HelpModule.findById(id);
        if (!helpItem) {
            return res.status(404).json({ error: "Data not found" });
        }

        // 🔥 **Step 1: Delete Old Images from Uploads Folder**
        const deleteImage = (imagePath) => {
            const filePath = path.resolve(__dirname, "..", imagePath);
            console.log("Attempting to delete:", filePath);

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", filePath, err);
                    } else {
                        console.log("Deleted:", filePath);
                    }
                });
            } else {
                console.log("File not found, skipping:", filePath);
            }
        };

        helpItem.gallery.forEach(img => {
            if (!oldImages.includes(img)) {
                deleteImage(img);
            }
        });

        // 🔥 **Step 2: Update Database with New Images**
        helpItem.set({
            status,
            title,
            description,
            category,
            location,
            pincode,
            help_date,
            gallery: newImages // Store only new images
        });

        await helpItem.save();
        return res.status(200).json({ msg: "Updated Successfully", helpItem });

    } catch (error) {
        console.error("ERROR:", error);
        return res.status(500).json({ msg: "ERROR Updating Help", error });
    }
};



// export const GetHelps = async (req, res) => {
//     try {
//         const query = {
//             deletedAt: null,
//         }
//         const categories = req?.query?.categories;
//         const userId = req?.query?.userId;
//         const pincode = req?.query?.pincode;
//         if (userId) {
//             query.help_seeker = { $ne: userId };  //  !=
//         }

//         if (categories) {
//             const categoriesArray = categories.split(',').map(id => new mongoose.Types.ObjectId(id));
//             query.category = { $in: categoriesArray };
//         }
//         if (pincode) {
//             query.pincode = pincode; // Match exact pincode
//         }

//         const result = await HelpModule.find(query)
//             .populate("category")
//         if (!result) {
//             return res.status(404).json({ Err: "Data Is Not available" });
//         }
//         return res.status(200).json({ msg: "Data Get Successfully : ", result });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ msg: "Error Get Data ", error });
//     }
// }
export const GetHelps = async (req, res) => {
    try {
        const query = { deletedAt: null };
        const categories = req?.query?.categories;
        const userId = req?.query?.userId;
        const pincode = req?.query?.pincode;
        let page = parseInt(req?.query?.page) || 1;  // Default to page 1
        let limit = parseInt(req?.query?.perpage) || 10; // Default limit is 10

        if (userId) {
            query.help_seeker = { $ne: userId };
        }

        if (categories) {
            const categoriesArray = categories.split(',').map(id => new mongoose.Types.ObjectId(id));
            query.category = { $in: categoriesArray };
        }

        if (pincode) {
            query.pincode = pincode;
        }

        const totalCount = await HelpModule.countDocuments(query); // Get total count

        const result = await HelpModule.find(query)
            .populate("category")
            .skip((page - 1) * limit)  // Skip previous pages
            .limit(limit);  // Limit the number of results

        if (!result) {
            return res.status(404).json({ error: "No data available" });
        }
        return res.status(200).json({
            msg: "Data retrieved successfully",
            page,
            perpage: limit,
            totalPages: Math.ceil(totalCount / limit),
            totalResults: totalCount,
            results: result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error retrieving data", error });
    }
};



export const GetHelpBySeekerID = async (req, res) => {
    try {
        const help_seeker = req.params.seekerId;

        const result = await HelpModule.find({ help_seeker })
            .populate("category") // Populate category field
            .exec(); // Execute the query

        if (result.length === 0) {
            return res.status(404).json({ error: "No help requests found" });
        }

        return res.status(200).json({ message: "Data fetched successfully", result });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Error fetching data", error });
    }
};



export const DeleteHelp = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await HelpModule.findByIdAndDelete(id, { new: true });
        console.log(result);

        if (!result) {
            return res.status(404).json({ msg: "Invalid Id" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Delete Help ERROR" });
    }
}

