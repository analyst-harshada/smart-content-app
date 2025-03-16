import React from 'react';
import { Button } from '@progress/kendo-react-buttons';

function App() {
  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <h1 className="text-3xl font-bold mb-4 border-b-4 border-yellow-400 pb-2">
        Hello KendoReact + Vite + Tailwind!
      </h1>
      
      <p className="mb-6 text-lg text-gray-200">
        If this text is styled correctly, Tailwind CSS is working!
      </p>

      <div className="flex gap-4">
        <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Click me!
        </Button>

        <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Danger!
        </Button>
      </div>
    </div>
  );
}

export default App;
