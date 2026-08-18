import mongoose from 'mongoose'

const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },       // submitter's name
    email: { type: String, required: true },      // submitter's email
    title: { type: String, required: true },      // recipe title
    description: { type: String, required: true },
    videoName: { type: String, default: '' },
    status: { type: String, default: 'Pending' }, // Pending | Active | Rejected
  },
  { timestamps: true }
)

export const Recipe =
  mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema)

// Legacy Product model kept for backwards compatibility
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  uploader: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
})

export const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema)

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
})

export const Setting =
  mongoose.models.Setting || mongoose.model('Setting', SettingSchema)

