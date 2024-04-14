const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cveSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sourceIdentifier: { type: String, required: true },
  published: { type: String, required: true },
  lastModified: { type: String, required: true },
  vulnStatus: { type: String, required: true },
  descriptions: [{
    lang: { type: String, required: true },
    value: { type: String, required: true }
  }],
  metrics: {
    cvssMetricV2: [{
      source: { type: String, required: true },
      type: { type: String, required: true },
      cvssData: {
        version: { type: String, required: true },
        vectorString: { type: String, required: true },
        accessVector: { type: String, required: true },
        accessComplexity: { type: String, required: true },
        authentication: { type: String, required: true },
        confidentialityImpact: { type: String, required: true },
        integrityImpact: { type: String, required: true },
        availabilityImpact: { type: String, required: true },
        baseScore: { type: Number, required: true }
      },
      baseSeverity: { type: String, required: true },
      exploitabilityScore: { type: Number, required: true },
      impactScore: { type: Number, required: true },
      acInsufInfo: { type: Boolean, required: true },
      obtainAllPrivilege: { type: Boolean, required: true },
      obtainUserPrivilege: { type: Boolean, required: true },
      obtainOtherPrivilege: { type: Boolean, required: true },
      userInteractionRequired: { type: Boolean, required: true }
    }]
  },
  configurations: [{
    nodes: [{
      operator: { type: String, required: true },
      negate: { type: Boolean, required: true },
      cpeMatch: [{
        vulnerable: { type: Boolean, required: true },
        criteria: { type: String, required: true },
        matchCriteriaId: { type: String, required: true }
      }]
    }]
  }]
});

cveSchema.plugin(mongoosePaginate);


const CVE = mongoose.model('CVE', cveSchema);

module.exports = CVE;
