const TimeParser = (() => ({
  getDateFromMessageData: (data) => new Date(Date.parse(
    data.editAt ? data.editAt : data.createdAt,
  )),
  parseDateToDateString: (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  },
  parseDateToTimeString: (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  },
})
)();

export default TimeParser;
