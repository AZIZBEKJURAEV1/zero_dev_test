const { json } = require("express");
const model = require("../models/model");

async function create_Categories(req, res) {
  try {
    const createCategories = new model.Categories({
      type: "Доход",
      color: "rgb(54, 162, 235)",
    });

    await createCategories.save();
    return res.json(createCategories);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error while creating categories ${err.message}` });
  }
}

async function get_Categories(req, res) {
  try {
    let data = await model.Categories.find({});
    return res.json(data);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error while fetching categories ${err.message}` });
  }
}

async function create_Transaction(req, res) {
  try {
    const { name, type, amount } = req.body;
    const createTransaction = new model.Transaction({
      name: name,
      type: type,
      amount: amount,
      date: new Date(),
    });

    await createTransaction.save();
    return res.json(createTransaction);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error while creating transaction ${err.message}` });
  }
}

async function get_Transaction(req, res) {
  try {
    let data = await model.Transaction.find({});
    return res.json(data);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error while fetching transaction ${err.message}` });
  }
}

async function delete_Transaction(req, res) {
  try {
    await model.Transaction.deleteOne(req.body);
    res.json("Record deleted");
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Error while deleting transaction ${err.message}` });
  }
}

async function get_Labels(req, res) {
  model.Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      let data = result.map((v) =>
        Object.assign(
          {},
          {
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info["color"],
          }
        )
      );
      res.json(data);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: `Lookup collection error! ${err.message}` });
    });
}

module.exports = {
  create_Categories,
  get_Categories,

  create_Transaction,
  get_Transaction,
  delete_Transaction,

  get_Labels,
};
