import React from "react";
import VolunteerCard from "@/components/VolunteerCard"; // Adjust path if necessary
import volunteeringData from "@/data/volunteering"; // Adjust path if necessary

const VolunteerSearch = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Volunteer Opportunities</h1>
      <div className="volunteer-grid">
        {volunteeringData.map((volunteer, index) => (
          <VolunteerCard key={index} resource={volunteer} />
        ))}
      </div>

      <style jsx>{`
        .volunteer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          justify-items: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default VolunteerSearch;
