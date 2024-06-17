const cron = require("node-cron");
const fetch = require("node-fetch");

const scheduleReminders = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Sending post request");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/sendReminders`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      console.log("Reminders sent:", data);
    } catch (error) {
      console.error("Error scheduling reminders:", error);
    }
  });
};

module.exports = scheduleReminders;
