import React from "react";
interface CalendarProps {}
export default function Calendar() {
  var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const gridItems = [];
  const MAX_WEEKS_PER_MONTH = 5;
  const DAYS_PER_WEEK = 7;
  for (let i = 1; i <= MAX_WEEKS_PER_MONTH * DAYS_PER_WEEK; i++) {
    gridItems.push(
      <div
        key={i}
        className="border rounded border-black bg-blue-500 p-4 text-white flex items-center justify-center w-32 h-32"
      >
        {i}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-7 grid-rows-5">{gridItems}</div>
      </div>
    </>
  );
}
