import mongoose, {model, models} from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    properties: [{ // Array of objects to store property name and possible values
        name: { type: String, required: true },
        values: [{ type: String }]
    }]
});

export const Category = models.Category || model('Category', CategorySchema);
