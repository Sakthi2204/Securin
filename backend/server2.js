const express = require('express');
const mongoose = require('mongoose');
const cveModel = require('./model.js'); 
const cors=require('cors')

const app = express();
app.use(express.json());
app.use(cors())

const mongoDBURI = 'mongodb+srv://shakthi040302:Sakthi22@cve.vfcb69r.mongodb.net/cve';

mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  });

app.get('/api/get-cves', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const cves = await cveModel.paginate({}, options);
    console.log(cves)
    res.json(cves);
  } catch (error) {
    console.error('Error fetching CVEs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server 2 is running on port ${port}`);
});
