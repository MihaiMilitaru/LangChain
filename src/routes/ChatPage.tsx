import { useSelector } from 'react-redux';
import Chat from '../components/Chat';
import Navbar from '../components/Navbar';
import { selectMessages } from '../store/slices/message';

export default function ChatPage() {
  const messages = useSelector(selectMessages);

  return (
    <div className="chatPage">
      <Navbar />
      <Chat messages={messages} />
    </div>
  );
}
