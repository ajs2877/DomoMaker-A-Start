const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);

      return res.status(400).json({
        error: 'An error occurred',
      });
    }

    return res.render('app', {
      csrfToken: req.csrfToken(),
      domos: docs,
    });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favoritecolor) {
    return res.status(400).json({
      error: 'RAWR! Both name, age, and favorite color are required',
    });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favoritecolor: req.body.favoritecolor,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({
    redirect: '/maker',
  }));

  domoPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Domo already exists.',
      });
    }

    return res.status(400).json({
      error: 'An error occurred',
    });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ domos: docs });
  });
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return Domo.DomoModel.deleteOne({ _id: req.body.domo_id }, (err2) => {
      if (err2) {
        console.log(err2);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.json({ action: 'success!' });
    });
  });
};

module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.makerPage = makerPage;
module.exports.deleteDomo = deleteDomo;
