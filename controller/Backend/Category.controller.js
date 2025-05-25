import { validationResult } from "express-validator";
import CategoryModule from "../../model/Category.model.js";


export const CategoryGet = async (req, res) => {
    try {
        const result = await CategoryModule.find();
        console.log(result);
        if (!result) {
            return res.status(404).json({ msg: "No Categories Found" });
        }

        return res.status(200).json({ msg: "Get Category", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Category Error", error });
    }
};


export const Category = async (req, res) => {
    try {
        const { category } = req.body;
        const gallery = req.file ? req.file.path : null;
        const newCategory = new CategoryModule({ category, gallery });
        await newCategory.save();
        return res.status(201).json({ msg: "Add Category SauccessFully" });
    } catch (error) {
        return res.status(500).json({ msg: "ERROR Category Controller" });
    }
}


export const Update = async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { category } = req.body;
        const id = req.params.id;

        const result = await CategoryModule.findById(id);

        if (!result) {
            return res.status(404).json({ msg: "Category Not Fond || Id Is Wrong" });
        }

        result.category = category;
        await result.save();
        return res.status(201).json({ msg: "Succesfully Update", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Category Update ERROR", error });
    }
}


export const Delete = async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({ msg: "Category ID is required" });
        }
        const result = await CategoryModule.findByIdAndDelete(id);
        return res.status(201).json({ msg: "Succesfully Delete" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "ERROR Category Delete" });
    }
}