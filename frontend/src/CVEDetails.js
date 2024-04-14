import React from 'react';
import './CVEDetails.css'; // Import the CSS file

const CVEDetails = ({ cve }) => {
  return (
    <div className="cve-details-container">
      <h1>{cve.id}</h1>
      <h3>Description:</h3>
      <h5>{cve.descriptions[0].value}</h5>
      <h3>CVSS V2 Metrics</h3>
      <h5>Severity: {cve.metrics.cvssMetricV2[0].baseSeverity}</h5>
      <h5>Vector String: {cve.metrics.cvssMetricV2[0].cvssData.vectorString}</h5>
      <table className="cve-details-table">
        <thead>
          <tr>
            <th>Access Vector</th>
            <th>Access Complexity</th>
            <th>Authentication</th>
            <th>Confidentiality Impact</th>
            <th>Integrity Impact</th>
            <th>Availability Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.accessVector}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.accessComplexity}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.authentication}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.confidentialityImpact}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.integrityImpact}</td>
            <td>{cve.metrics.cvssMetricV2[0].cvssData.availabilityImpact}</td>
          </tr>
        </tbody>
      </table>
      <h3>Scores:</h3>
      <h5>Exploitability Score: {cve.metrics.cvssMetricV2[0].exploitabilityScore}</h5>
      <h5>Impact Score: {cve.metrics.cvssMetricV2[0].impactScore}</h5>
      <h3>CPE:</h3>
      <table className="cve-details-table">
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Match Criteria ID</th>
            <th>Vulnerability</th>
          </tr>
        </thead>
        <tbody>
          {cve.configurations[0].nodes[0].cpeMatch.map((cpe, index) => (
            <tr key={index}>
              <td>{cpe.criteria}</td>
              <td>{cpe.matchCriteriaId}</td>
              <td>{cpe.vulnerable.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CVEDetails;



