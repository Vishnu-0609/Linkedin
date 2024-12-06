import { useState } from 'react';
import { Image, Paperclip, Smile } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            alt="Sarah Wilson"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 className="font-semibold text-gray-900">Sarah Wilson</h2>
            <p className="text-sm text-gray-500">Product Designer at Design Co</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-end">
          <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-xs">
            Hi Sarah! Thanks for connecting.
          </div>
        </div>
        <div className="flex">
          <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-xs">
            Thanks for reaching out! I had love to discuss potential collaboration opportunities.
          </div>
        </div>
      </div>

      <form onSubmit={handleSend} className="border-t-2 border-gray-200">
        <div className="flex flex-col items-center">
          <div className='w-full px-2 py-4'>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="w-full border border-gray-300 rounded-lg px-1 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className='flex justify-between w-full items-center border-t border-gray-200 p-2'>
            <div className='flex items-center gap-2'>
              <button type="button" className="text-gray-500 hover:text-gray-600">
                <Image className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-500 hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
              </button>
              <button type="button" className="text-gray-500 hover:text-gray-600">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-full px-3 hover:bg-blue-700"
            >
              send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;