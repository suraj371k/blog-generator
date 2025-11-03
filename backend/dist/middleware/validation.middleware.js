import { ZodError } from "zod";
export const validateData = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json({ message: error.issues[0]?.message || "Validation error" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
