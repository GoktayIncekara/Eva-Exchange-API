const { Users } = require("./src/models/userModel.js");
const { Share } = require("./src/models/shareModel.js");
const { Portfolio } = require("./src/models/portfolioModel.js");

const buy = async (req, res) => {
  const { id, symbol } = req.params;
  const amount = parseInt(req.body.amount);
  let totalAmount = 0;
  let rate;

  let noShare = false;
  let noUser = false;
  let noPortfolio = false;

  const price = await Share.findAll({
    attributes: ["rate"],
    where: {
      symbol: symbol,
    },
  })
    .then((instances) => {
      if (instances.length === 0) {
        noShare = true;
      } else {
        rate = instances[0].dataValues.rate;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const isUserExists = await Users.findAll({
    where: {
      id: id,
    },
  })
    .then((instances) => {
      if (instances.length === 0) {
        noUser = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const isPortfolioExists = await Portfolio.findAll({
    where: {
      user_id: id,
    },
  })
    .then((instances) => {
      if (instances.length === 0) {
        noPortfolio = true;
      } else {
        const currentAmount = Portfolio.findAll({
          attributes: ["amount"],
          where: {
            user_id: id,
            symbol: symbol,
          },
        })
          .then((instances) => {
            if (instances.length === 0) {
              Portfolio.create({ user_id: id, symbol: symbol, amount: amount })
                .then((createdInstance) => {
                  res
                    .status(200)
                    .send(
                      `Share with symbol ${symbol} is bought with the lates price of ${rate}.`
                    );
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              totalAmount = instances[0].dataValues.amount + amount;
              Portfolio.update(
                { amount: totalAmount },
                {
                  where: {
                    user_id: id,
                    symbol: symbol,
                  },
                }
              )
                .then((updatedInstance) => {
                  res
                    .status(200)
                    .send(
                      `Share with symbol ${symbol} is bought with the lates price of ${rate}. With the amount bought ${amount}, its current amount is ${totalAmount}`
                    );
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });

  if (noShare && noUser) {
    res
      .status(400)
      .send(
        "There is no user with that id and no existing share with that symbol. Bad request."
      );
  } else if (noUser) {
    res.status(400).send("There is no user with that id. Bad request.");
  } else if (noShare) {
    res.status(400).send("There is no share with that symbol. Bad request.");
  } else if (noPortfolio) {
    res
      .status(400)
      .send(
        "There is no portfolio for that user. (he or she didnt buy any shares before) Bad request."
      );
  }
};

const sell = async (req, res) => {
  const { id, symbol } = req.params;
  const amount = parseInt(req.body.amount);
  let newAmount;
  let rate;

  let totalAmount = 0;

  let noShare = false;
  let noPortfolio = false;
  let noShareInThePortfolio = false;
  let notEnoughAmountToSell = false;

  const price = await Share.findAll({
    attributes: ["rate"],
    where: {
      symbol: symbol,
    },
  })
    .then((instances) => {
      if (instances.length === 0) {
        noShare = true;
      } else {
        rate = instances[0].dataValues.rate;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const isPortfolioExists = await Portfolio.findAll({
    where: {
      user_id: id,
    },
  })
    .then((instances) => {
      if (instances.length === 0) {
        noPortfolio = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const currentAmount = await Portfolio.findAll({
    attributes: ["amount"],
    where: {
      user_id: id,
      symbol: symbol,
    },
  })
    .then((instances) => {
      if (instances.length === 0) {
        noShareInThePortfolio = true;
      } else {
        if (instances[0].dataValues.amount - amount > 0) {
          newAmount = instances[0].dataValues.amount - amount;

          Portfolio.update(
            { amount: newAmount },
            {
              where: {
                user_id: id,
                symbol: symbol,
              },
            }
          )
            .then((updatedInstance) => {
              res
                .status(200)
                .send(
                  `Share with symbol ${symbol} is sold with the latest price ${rate}. After selling the ${amount} amount, remaining amount is ${newAmount}`
                );
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (instances[0].dataValues.amount - amount === 0) {
          Portfolio.destroy({
            where: {
              user_id: id,
              symbol: symbol,
            },
          })
            .then((deletedInstance) => {
              res
                .status(200)
                .send(
                  `Share with symbol ${symbol} is sold with the latest price ${rate}. After selling the ${amount} amount, there is no remaining amount left.`
                );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          notEnoughAmountToSell = true;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });

  if (noShare) {
    res.status(400).send("There is no share with that symbol. Bad request.");
  } else if (noPortfolio) {
    res
      .status(400)
      .send(
        "There is no portfolio for that user. (he or she didnt buy any shares before) Bad request."
      );
  } else if (noShareInThePortfolio) {
    res
      .status(400)
      .send(
        "There is no share with that symbol in the portfolio of that user. Bad request."
      );
  } else if (notEnoughAmountToSell) {
    res
      .status(400)
      .send(
        "There is not enough amount of share in the portfolio of that user. Bad request."
      );
  }
};

module.exports = {
  buy,
  sell,
};
