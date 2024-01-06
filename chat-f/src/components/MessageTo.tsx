import dayjs from "dayjs";

const MessageTo = ({
  text,
  reciver,
  date,
}: {
  text: string;
  reciver: string;
  date: string;
}) => {
  return (
    <div className="flex w-full justify-end">
      <div className="lg:w-[48%] w-[80%] text-cyan-600 flex flex-row-reverse gap-1 relative right-0 top-0">
        <span className="relative bottom-[-98%] text-white">{`Вы`}</span>
        <div className="w-full bg-white p-2 rounded-lg rounded-ee-none relative">
          <span>{text}</span>
          <span className="absolute bottom-0 right-1 text-[10px] text-slate-800 font-semibold">
            {dayjs(date).subtract(0, "hour").format("YYYY-MM-DD / HH:mm:ss")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageTo;
