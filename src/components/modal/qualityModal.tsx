import React, { useState } from "react";
import { X, Plus, Minus, Pencil } from "lucide-react";

interface Item {
  id: string;
  text: string;
}

const QualityOfLifeModal: React.FC = () => {
  const [decreaseItems, setDecreaseItems] = useState<Item[]>([
    { id: "1", text: "Alcohol" },
    { id: "2", text: "Smoking" },
    { id: "3", text: "Stress" },
  ]);

  const [increaseItems, setIncreaseItems] = useState<Item[]>([
    { id: "4", text: "Healthy Food" },
    { id: "5", text: "Good Sleep" },
    { id: "6", text: "Exercise" },
  ]);

  const [showDecreaseInput, setShowDecreaseInput] = useState(false);
  const [showIncreaseInput, setShowIncreaseInput] = useState(false);
  const [decreaseInput, setDecreaseInput] = useState("");
  const [increaseInput, setIncreaseInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addDecreaseItem = () => {
    if (decreaseInput.trim()) {
      setDecreaseItems([
        ...decreaseItems,
        { id: Date.now().toString(), text: decreaseInput.trim() },
      ]);
      setDecreaseInput("");
      setShowDecreaseInput(false);
    }
  };

  const addIncreaseItem = () => {
    if (increaseInput.trim()) {
      setIncreaseItems([
        ...increaseItems,
        { id: Date.now().toString(), text: increaseInput.trim() },
      ]);
      setIncreaseInput("");
      setShowIncreaseInput(false);
    }
  };

  const deleteDecreaseItem = (id: string) => {
    setDecreaseItems(decreaseItems.filter((item) => item.id !== id));
  };

  const deleteIncreaseItem = (id: string) => {
    setIncreaseItems(increaseItems.filter((item) => item.id !== id));
  };

  const handleDecreaseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addDecreaseItem();
    }
  };

  const handleIncreaseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addIncreaseItem();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center font-poppins gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        <Pencil className="h-4 w-4" />
        Quality Of Life
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-200 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-poppins md:text-2xl font-bold text-[#202020]">
                  To Increase Quality of Life
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Decrease Column */}
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-300 px-4 py-3 font-poppins font-semibold text-[#202020] text-center border-b-2 border-gray-400">
                    Decrease
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {decreaseItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <button
                          onClick={() => deleteDecreaseItem(item.id)}
                          className="mr-3 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="text-[#202020]">{item.text}</span>
                      </div>
                    ))}
                    {showDecreaseInput && (
                      <div className="px-4 py-3 border-b border-gray-200">
                        <input
                          type="text"
                          value={decreaseInput}
                          onChange={(e) => setDecreaseInput(e.target.value)}
                          onKeyPress={handleDecreaseKeyPress}
                          onBlur={addDecreaseItem}
                          placeholder="Type and press Enter"
                          className="w-full px-2 py-1 text-neutral-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDecreaseInput(true)}
                    className="w-full bg-[#202020] text-white py-2 flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={18} />
                    Add info
                  </button>
                </div>

                {/* Increase Column */}
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-300 font-poppins px-4 py-3 font-semibold text-[#202020] text-center border-b-2 border-gray-400">
                    Increase
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {increaseItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <button
                          onClick={() => deleteIncreaseItem(item.id)}
                          className="mr-3 text-gray-600 hover:text-red-600 transition-colors flex-shrink-0"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="text-[#202020]">{item.text}</span>
                      </div>
                    ))}
                    {showIncreaseInput && (
                      <div className="px-4 py-3 border-b border-gray-200">
                        <input
                          type="text"
                          value={increaseInput}
                          onChange={(e) => setIncreaseInput(e.target.value)}
                          onKeyPress={handleIncreaseKeyPress}
                          onBlur={addIncreaseItem}
                          placeholder="Type and press Enter"
                          className="w-full px-2 py-1 text-neutral-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowIncreaseInput(true)}
                    className="w-full bg-[#202020] text-white py-2 flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={18} />
                    Add info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QualityOfLifeModal;
