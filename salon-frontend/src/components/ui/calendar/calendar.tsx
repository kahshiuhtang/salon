interface Task {
  date: string;
  time: string;
  description: string;
}

interface CalendarProps {
  year: number;
  month: number;
  tasks: Task[];
}

export default function Calendar({ year, month, tasks }: CalendarProps) {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
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
  const MAX_WEEKS_PER_MONTH = 5;
  const DAYS_PER_WEEK = 7;
  const gridItems = [];
  const date = new Date(year, month - 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = date.getDay();

  // Add empty cells for the days before the first of the month
  for (let i = 0; i < firstDayIndex; i++) {
    gridItems.push(<div key={`empty-${i}`} className="p-4"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = tasks.filter(
      (task) =>
        new Date(task.date).getDate() === day &&
        new Date(task.date).getMonth() + 1 === month &&
        new Date(task.date).getFullYear() === year
    );

    gridItems.push(
      <div
        key={day}
        className="bg-blue-500 p-4 text-white flex flex-col items-center justify-center w-32 h-32 relative"
      >
        <div className="absolute left-1 top-1">{day}</div>
        {dayTasks.map((task, index) => (
          <div
            key={index}
            className="text-sm bg-white text-black w-24 m-1 rounded mt-1"
          >
            <div>{task.time}</div>
            <div>{task.description}</div>
          </div>
        ))}
      </div>
    );
  }

  // Add empty cells to fill the remaining space in the grid
  const totalCells = MAX_WEEKS_PER_MONTH * DAYS_PER_WEEK;
  const emptyCells = totalCells - (firstDayIndex + daysInMonth);
  for (let i = 0; i < emptyCells; i++) {
    gridItems.push(<div key={`empty-end-${i}`} className="p-4"></div>);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-7 grid-rows-5 gap-1">{gridItems}</div>
    </div>
  );
}
