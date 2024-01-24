import ProductSchema from "./ProductSchema.js";

//insert new product
export const insertProduct = (productObj) => {
  return ProductSchema(productObj).save();
};
export const updateProduct = (filter, update) => {
  return ProductSchema.findOneAndUpdate(filter, update, { new: true });
};

//get product by filter
export const getProducts = () => {
  return ProductSchema.find();
};

//get product by filter
export const getAProduct = (filter) => {
  return ProductSchema.findOne(filter);
};

// by slug get product
export const getAProductBySlug = (slug) => {
  return ProductSchema.findOne({ slug });
};

export const deleteAproduct = (_id) => {
  return ProductSchema.findByIdAndDelete(_id);
};
