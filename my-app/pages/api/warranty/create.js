import connectMongo from "../../../utils/connectMongo";
import Warranty from "../../../models/Warranty";

const createProduct = async (req, res) => {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("CREATING DOCUMENT");
    let newproduct = req.body;
    console.log(newproduct);

    const product = await Warranty.create(newproduct);
    console.log("CREATED DOCUMENT");

    res.json({ product });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export default createProduct;
