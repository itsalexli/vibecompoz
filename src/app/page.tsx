import Sheet from "./sheet";
import InputButton from "./chatbot";

export default function Home() {
  return (
    <div className="flex flex-row gap-6 p-6">
      <Sheet />
      <InputButton />
    </div>
  );
}
