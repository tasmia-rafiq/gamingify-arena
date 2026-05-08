import { format, formatDistanceStrict, differenceInHours, parseISO } from 'date-fns';

const DisplayDate = ({ createdAt }) => {
  const date = typeof createdAt === 'string' ? parseISO(createdAt) : createdAt;
  const now = new Date();
  const hoursAgo = differenceInHours(now, date);

  let formattedDate;
  if (hoursAgo < 24) {
    formattedDate = formatDistanceStrict(date, now, { addSuffix: true });
  } else if (hoursAgo < 48) {
    formattedDate = "1 day ago";
  } else {
    formattedDate = format(date, 'MMM d, yyyy . KK:mm aaa');
  }

  return <span>{formattedDate}</span>;
};

export default DisplayDate;