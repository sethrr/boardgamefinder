import React, { useState, useEffect } from "react";

const EventCallout = () => {
  function insertLastWednesday() {
    // Get the current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Find the last day of the current month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Work backwards from the last day to find the last Wednesday
    let lastWednesday = new Date(lastDay);
    while (lastWednesday.getDay() !== 3) {
      // 3 represents Wednesday (0=Sunday, 1=Monday, etc.)
      lastWednesday.setDate(lastWednesday.getDate() - 1);
    }

    // Format the date as a readable string
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const formattedDate = lastWednesday.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  return (
    <div className="site-banner">
      <div className="site-banner-inner">
        <h6> Our next meetup is {insertLastWednesday()}. <a href="https://www.instagram.com/eavboardgames/" target="_blank">Event Details</a>↗️</h6>
      </div>
    </div>
  );
};

export default EventCallout;
