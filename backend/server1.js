const mongoose = require('mongoose');
const axios = require('axios');
const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const cve = require('./model.js');

const app = express();
app.use(cors());
app.use(express.json());

const mongoDBURI = 'mongodb+srv://shakthi040302:Sakthi22@cve.vfcb69r.mongodb.net/cve';

async function connectToDB() {
    try {
        await mongoose.connect(mongoDBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

async function storeCVEs() {
    try {
        const resultsPerPage = 2000;
        let startIndex = 0;
        const totalResults = 245364;

        await connectToDB();
        while (startIndex < totalResults) {
            const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}&resultsPerPage=${resultsPerPage}`);
            const vulnerabilities = response.data.vulnerabilities;
            for (const vulnerability of vulnerabilities) {
                const cveData = vulnerability.cve;

                const existingCVE = await cve.findOne({ id: cveData.ID });
                if (existingCVE) {
                    continue;
                }

                const { id, sourceIdentifier, published, lastModified, vulnStatus, descriptions, metrics, configurations } = cveData;

                const publishedDate = new Date(published.slice(0, 10));
                const lastModifiedDate = new Date(lastModified.slice(0, 10));

                const cveDocument = new cve({
                    id,
                    sourceIdentifier,
                    published: formatDate(publishedDate),
                    lastModified: formatDate(lastModifiedDate),
                    vulnStatus,
                    descriptions,
                    metrics,
                    configurations
                });

                await cveDocument.save();
            }
            startIndex += resultsPerPage;
        }
        console.log('All CVEs have been saved to the database');
    } catch (error) {
        console.error('Error storing CVEs:', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

storeCVEs()

function formatDate(date) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

app.listen(5000, () => {
    console.log('Server is running on Port 5000');
});

setInterval(storeCVEs, 24 * 60 * 60 * 1000); 
