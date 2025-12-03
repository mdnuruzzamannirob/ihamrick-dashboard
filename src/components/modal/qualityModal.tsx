import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Pencil } from "lucide-react";
import {
  useCreateLifeSuggestionMutation,
  useGetLifeSuggestionsQuery,
  useDeleteLifeSuggestionMutation,
} from "../../../services/allApi";

interface Item {
  id: string;
  text: string;
}

interface LifeSuggestion {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateLifeSuggestionRequest {
  type: "decrease" | "increase";
  content: string;
}

const QualityOfLifeModal: React.FC = () => {
  const [decreaseItems, setDecreaseItems] = useState<Item[]>([]);
  const [increaseItems, setIncreaseItems] = useState<Item[]>([]);
  const [showDecreaseInput, setShowDecreaseInput] = useState(false);
  const [showIncreaseInput, setShowIncreaseInput] = useState(false);
  const [decreaseInput, setDecreaseInput] = useState("");
  const [increaseInput, setIncreaseInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useGetLifeSuggestionsQuery();
  const [createLifeSuggestion, { isLoading: isCreating }] = useCreateLifeSuggestionMutation();
  const [deleteLifeSuggestion] = useDeleteLifeSuggestionMutation();

  useEffect(() => {
    if (data) {
      const decreaseItemsMapped = data.data.decrease.map((item: LifeSuggestion) => ({
        id: item._id,
        text: item.content,
      }));
      const increaseItemsMapped = data.data.increase.map((item: LifeSuggestion) => ({
        id: item._id,
        text: item.content,
      }));

      setDecreaseItems(decreaseItemsMapped);
      setIncreaseItems(increaseItemsMapped);
    }
  }, [data]);

  // Add Decrease Item with Optimistic Update
  const addDecreaseItem = async () => {
    if (decreaseInput.trim()) {
      const newItem: CreateLifeSuggestionRequest = {
        type: "decrease",
        content: decreaseInput.trim(),
      };

      // Optimistically update the UI
      const newItemData = { id: Date.now().toString(), text: decreaseInput.trim() };  // Temporary ID for optimistic update
      setDecreaseItems((prevItems) => [...prevItems, newItemData]);

      try {
        const result = await createLifeSuggestion(newItem);
        if (result?.data) {
          // Replace the optimistic ID with the real one after API call success
          setDecreaseItems((prevItems) =>
            prevItems.map((item) =>
              item.id === newItemData.id ? { ...item, id: result.data._id } : item
            )
          );
        }
      } catch (error) {
        console.error("Error adding life suggestion:", error);
        // Optionally, revert the optimistic update if the API fails
        setDecreaseItems((prevItems) => prevItems.filter((item) => item.id !== newItemData.id));
      }
      
      setDecreaseInput(""); // Clear input after submission
      setShowDecreaseInput(false); // Hide input field
    }
  };

  // Add Increase Item with Optimistic Update
  const addIncreaseItem = async () => {
    if (increaseInput.trim()) {
      const newItem: CreateLifeSuggestionRequest = {
        type: "increase",
        content: increaseInput.trim(),
      };

      // Optimistically update the UI
      const newItemData = { id: Date.now().toString(), text: increaseInput.trim() };  // Temporary ID for optimistic update
      setIncreaseItems((prevItems) => [...prevItems, newItemData]);

      try {
        const result = await createLifeSuggestion(newItem);
        if (result?.data) {
          // Replace the optimistic ID with the real one after API call success
          setIncreaseItems((prevItems) =>
            prevItems.map((item) =>
              item.id === newItemData.id ? { ...item, id: result.data._id } : item
            )
          );
        }
      } catch (error) {
        console.error("Error adding life suggestion:", error);
        // Optionally, revert the optimistic update if the API fails
        setIncreaseItems((prevItems) => prevItems.filter((item) => item.id !== newItemData.id));
      }

      setIncreaseInput(""); // Clear input after submission
      setShowIncreaseInput(false); // Hide input field
    }
  };

  // Delete Decrease Item
  const deleteDecreaseItem = async (id: string) => {
    try {
      const response = await deleteLifeSuggestion(id).unwrap();
      console.log("Delete Success Response:", response);

      // Dynamically update state after deletion
      setDecreaseItems((prevItems) => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting life suggestion:", error);
    }
  };

  // Delete Increase Item
  const deleteIncreaseItem = async (id: string) => {
    try {
      const response = await deleteLifeSuggestion(id).unwrap();
      console.log("Delete Success Response:", response);

      // Dynamically update state after deletion
      setIncreaseItems((prevItems) => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting life suggestion:", error);
    }
  };

  // Handle key press for Decrease Item input
  const handleDecreaseKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addDecreaseItem();
    }
  };

  // Handle key press for Increase Item input
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
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : error ? (
                      <div>Error fetching suggestions</div>
                    ) : (
                      decreaseItems.map((item) => (
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
                      ))
                    )}
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
                    disabled={isCreating} // Disable button during API call
                  >
                    <Plus size={18} />
                    {isCreating ? "Adding..." : "Add info"}
                  </button>
                </div>

                {/* Increase Column */}
                <div className="bg-white rounded-lg overflow-hidden shadow">
                  <div className="bg-gray-300 font-poppins px-4 py-3 font-semibold text-[#202020] text-center border-b-2 border-gray-400">
                    Increase
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : error ? (
                      <div>Error fetching suggestions</div>
                    ) : (
                      increaseItems.map((item) => (
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
                      ))
                    )}
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
                    disabled={isCreating} // Disable button during API call
                  >
                    <Plus size={18} />
                    {isCreating ? "Adding..." : "Add info"}
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
