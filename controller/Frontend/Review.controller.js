import { body, validationResult } from "express-validator";
import ReviewModule from "../../model/Review.model.js";


export const ReviewGive = async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { rating, review, customer, givenTo } = req.body;
        const result = await ReviewModule.create({ rating, review, customer, givenTo });

        if (!result) {
            return res.status(404).json({ msg: "Wrong Input" });
        }

        return res.status(201).json({ msg: "Successfully Give Review", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "ERROR Review Give", error });
    }
}



export const Delete = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await ReviewModule.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ msg: "Invalid Id" });
        }
        return res.status(201).json({ msg: "Delete Review Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Delete ERROR", error });
    }
}



