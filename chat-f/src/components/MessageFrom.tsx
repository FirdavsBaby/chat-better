import dayjs from "dayjs";

const MessageFrom = ({
  text,
  reciver,
  date,
}: {
  text: string;
  reciver: string;
  date: string;
}) => {
  return (
    <div className="flex w-full justify-start">
      <div className="lg:w-[48%] w-[80%] text-white flex gap-2 relative">
        <span className="relative bottom-[-98%]">{reciver}</span>
        <div className="w-full bg-cyan-600 p-2 rounded-lg rounded-es-none relative">
          <span>{text}</span>
          <span className="absolute bottom-0 right-1 text-[10px] text-slate-800 font-semibold">
            {dayjs(date).subtract(5, "hour").format("YYYY-MM-DD / HH:mm:ss")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageFrom;
