import React from "react";

interface Task {
  startTime: string; // Format: "HH:MM AM/PM"
  endTime: string; // Format: "HH:MM AM/PM"
  description: string;
  assignedEmployee: number;
}

interface DayScheduleProps {
  tasks: Task[];
}

const DaySchedule: React.FC<DayScheduleProps> = ({ tasks }) => {
  const times: string[] = [];
  const intervalHeight = 32; // Height of each time slot, adjust as needed

  // Generate 30-minute intervals from 8 AM to 8 PM
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date(0, 0, 0, hour, minute);
      const timeString = time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      times.push(timeString);
    }
  }

  const formatTime = (timeString: string): string => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM" && hours !== "12")
      hours = (parseInt(hours, 10) + 12).toString();
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  const getTaskIndex = (taskTime: string): number => {
    const [hours, minutes] = taskTime.split(":").map(Number);
    return (hours - 8) * 2 + Math.floor(minutes / 15);
  };

  const taskElements = tasks.map((task, index) => {
    const taskStart = formatTime(task.startTime);
    const taskEnd = formatTime(task.endTime);
    const startIndex = getTaskIndex(taskStart);
    const endIndex = getTaskIndex(taskEnd);
    const taskHeight = (endIndex - startIndex) * intervalHeight; // Calculate task height
    const taskMarginLeft = (task.assignedEmployee - 1) * 32; // Indent overlapping tasks
    return (
      <div
        key={index}
        className="absolute border-black border-2 left-16 p-1 bg-blue-500 text-white rounded text-xs "
        style={{
          top: `${startIndex * intervalHeight + (1 + startIndex)}px`, // Position based on start time
          right: `0px`,
          height: `${taskHeight}px`, // Height of the task block
          marginLeft: `${taskMarginLeft}px`, // Indent for overlapping tasks
        }}
      >
        {`${task.description} ${task.startTime}-${task.endTime}`}
      </div>
    );
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="grid grid-cols-1 w-1/2 relative flex">
        {times.map((time, index) => (
          <div
            key={time[0] + index}
            className="flex relative border-t border-gray-300"
          >
            <div
              className="w-16 p-1 text-xs border-r border-gray-300 text-right"
              style={{ height: `${intervalHeight}px` }}
            >
              {time}
            </div>
            <div
              className="flex-grow p-1 text-xs border-gray-300 bg-white relative"
              style={{ height: `${intervalHeight}px` }}
            />
          </div>
        ))}
        {taskElements}
      </div>
    </div>
  );
};

export default DaySchedule;
