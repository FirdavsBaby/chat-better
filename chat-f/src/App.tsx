import { IoIosSend } from "react-icons/io";
import MessageFrom from "./components/MessageFrom";
import MessageTo from "./components/MessageTo";
import { io } from "socket.io-client";
import { FormEvent, useEffect, useRef, useState } from "react";
import UserIMG from "./assets/user.png";
import { IUser } from "./types/User";
import { IMessage } from "./types/Message";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState<string>("");
  const [me, setMe] = useState<null | IUser>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  function handleOnChange(e: FormEvent<HTMLInputElement>) {
    setMessage(e.currentTarget.value);
  }

  async function handleSumbit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const msg = { text: message, user_id: me?._id };
    socket.emit("newMessage", msg);
    setMessage("");
  }

  const changeWindowRef = useRef<boolean>(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        "Вы уверены, что хотите перезагрузить/покинуть страницу?. Все введенные вами данные могут стереться.";
      localStorage.setItem("user", "");
      setMe(null);
      if (!changeWindowRef.current) {
        event.returnValue = message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const getMe = localStorage.getItem("user");
    if (!getMe) {
      socket.on("me", (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setMe(user);
      });
    } else {
      const me = JSON.parse(getMe);
      setMe(me);
    }
    socket.on("getMessages", (messages: IMessage[]) => {
      setMessages(messages);
    });
    socket.on("error", (err) => {
      alert(err.message);
    });
  }, []);

  function handleChangeUser() {
    const verify = confirm(
      "Вы уверены что хотите изменить пользователя. Если вы измените пользователя то вы больше не можете вернуться к этому пользователю!!!"
    );

    if (verify) {
      changeWindowRef.current = true;
      window.location.reload();
    }
  }

  return (
    <main className="h-screen overflow-hidden w-full">
      <section
        className="overflow-y-scroll rounded-3xl h-screen relative rounded-ss-none rounded-se-none lg:left-[30%] lg:w-[40%] w-[70%] left-[15%] shadow-2xl shadow-cyan-600 p-5 pb-[60px] flex flex-col gap-5"
        id="messages"
      >
        <nav className="w-full flex justify-between items-start gap-2 z-10 text-white p-2 py-3 sticky top-0 right-0">
          <span className="font-semibold text-red-600 p-1 bg-white rounded-md lg:w-[90%] w-[70%]">
            Просим не перезагружать страницу или все ваши данные изменятся!!!
          </span>
          <div className="flex flex-col gap-2 items-center lg:w-[12%] w-[15%]">
            <div className="flex gap-2 items-center">
              <h3>{me?.name}</h3>
              <img src={UserIMG} className="w-[50%]" alt="" />
            </div>
            <button
              className="w-full p-2 bg-red-600 rounded-md hover:bg-red-800"
              type="button"
              onClick={() => handleChangeUser()}
            >
              Именить
            </button>
          </div>
        </nav>
        {messages.map((msg: IMessage) => {
          return msg.user_id._id !== me?._id ? (
            <MessageFrom
              key={msg._id}
              reciver={msg.user_id?.name}
              text={msg.text}
              date={msg.updated_at}
            />
          ) : (
            <MessageTo
              key={msg._id}
              reciver={msg.user_id?.name}
              text={msg.text}
              date={msg.updated_at}
            />
          );
        })}
      </section>
      <form
        onSubmit={handleSumbit}
        className="fixed lg:left-[30%] flex justify-between lg:w-[40%] w-[70%] left-[15%] bg-white bottom-0 rounded"
      >
        <input
          type="text"
          name="text"
          id="text"
          className="p-2 border border-cyan-600 rounded rounded-e-none w-full outline-none"
          placeholder="Enter text..."
          onChange={handleOnChange}
          value={message}
        />
        <button className="bg-cyan-600 p-2 text-white hover:bg-cyan-800 rounded rounded-s-none">
          <IoIosSend />
        </button>
      </form>
    </main>
  );
}

export default App;
