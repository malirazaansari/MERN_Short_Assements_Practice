import Product from "../models/product.js";



// export const getProducts = async (req, res) => {
//     try {
//         const products = await Product.find({}).populate("price","category", "name");

//         res.json(products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }



export const getProducts = async (req, res) => {
    try {
      const { search, category, minPrice, maxPrice } = req.query;

      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" }; // case-insensitive
      }

      if (category) {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const products = await Product.find(query).sort({ createdAt: -1 });

      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
