import TryCatch from "../middlewares/TryCatch.js";
import { Category } from "../models/category.model.js";

export const createCategory = TryCatch(async (req, res) => {
    const { name, slug, isActive } = req.body;
    
    const category = Category.create({
        name, slug, isActive
    });

    res.status(201).json({
        message: "Category created successfully!",
        data: category,
    });
});

export const getCategories = TryCatch(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .select("name slug")
        .sort({ name: 1 })
        .lean();

    res.status(200).json({
        success: true,
        data: categories,
    });
});