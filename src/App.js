import { useState } from "react";

const dummyData = [
  { id: 1, quantity: 4, description: "socks", packed: false },
  { id: 2, quantity: 6, description: "passport", packed: false },
  { id: 3, quantity: 2, description: "bags", packed: false },
];

export default function App() {
  const [items, setItems] = useState(dummyData);

  // function to add item in list items
  const handleAddItem = (newData) => {
    setItems((currItems) => [...currItems, newData]);
  };

  // toggle function for packed property
  const handleTogglePacked = (id) => {
    setItems((currItems) =>
      currItems.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  // remove item from list function
  const handleRemoveItem = (id) => {
    setItems((currItems) => currItems.filter((item) => item.id !== id));
  };

  const handleClearList = () => {
    setItems([]);
  };

  return (
    <div className="App">
      <div className="travel-app">
        <Header />
        <Form onAddItem={handleAddItem} />
        <TravelList
          items={items}
          onRemoveItem={handleRemoveItem}
          onTogglePacked={handleTogglePacked}
          onClearList={handleClearList}
        />
        <Stats items={items} />
      </div>
    </div>
  );
}

function Header() {
  return <h1>Travel list App</h1>;
}

function Form({ onAddItem }) {
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");

  function handleOnAddSubmit(e) {
    e.preventDefault();
    //guard clause
    if (description === "") return;

    // new item object
    const newItem = {
      id: crypto.randomUUID(),
      description,
      quantity,
      packed: false,
    };
    // adding new item
    onAddItem(newItem);
    // reseting the input and select in form
    setQuantity("");
    setDescription("");
  }

  return (
    <form className="add-form" onSubmit={handleOnAddSubmit}>
      <select onChange={(e) => setQuantity(e.target.value)} value={quantity}>
        {/* creating arry using Array.form method */}
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={`${num}`}>
            {num}
          </option>
        ))}
      </select>

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="Add item.."
      />
      <button>Add</button>
    </form>
  );
}

function TravelList({ items, onTogglePacked, onRemoveItem, onClearList }) {
  const [selection, setSelection] = useState("default");
  let sortedItems;
  if (selection === "default") sortedItems = items;
  if (selection === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => (a.description > b.description ? 1 : -1));

  if (selection === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div
      className="travel-list"
      style={sortedItems.length === 0 ? { minHeight: "100px" } : {}}
    >
      <ul style={sortedItems.length === 0 ? { textAlign: "center" } : {}}>
        {sortedItems.length === 0
          ? "No items yet"
          : sortedItems.map((item) => (
              <List
                key={item.id}
                item={item}
                onRemoveItem={onRemoveItem}
                onTogglePacked={onTogglePacked}
              />
            ))}
      </ul>
      {sortedItems.length === 0 ? null : (
        <SortButtons
          onClearList={onClearList}
          selection={selection}
          setSelection={setSelection}
        />
      )}
    </div>
  );
}

function SortButtons({ selection, setSelection, onClearList }) {
  return (
    <div className="sort-buttons">
      <span>Sort By</span>
      <select onChange={(e) => setSelection(e.target.value)} value={selection}>
        <option value="default">Default</option>
        <option value="description">Description</option>
        <option value="packed">Packed</option>
      </select>
      <button onClick={onClearList}>Clear</button>
    </div>
  );
}

function List({ item, onTogglePacked, onRemoveItem }) {
  return (
    <li
      style={
        item.packed === true
          ? { textDecoration: "darkred line-through 2px" }
          : {}
      }
    >
      <input type="checkbox" onClick={() => onTogglePacked(item.id)} />
      <span>{item.quantity}</span> <p>{item.description}</p>
      <button onClick={() => onRemoveItem(item.id)} className="remove-btn">
        ❌
      </button>
    </li>
  );
}

function Stats({ items }) {
  const itemLength = items.length;
  const itemsPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((itemsPacked / itemLength) * 100);

  return (
    <div className="stats">
      <p>
        {itemLength === 0
          ? "Prepare your list for travel ✈"
          : percentage === 100
          ? "You are ready for travel ✈✈"
          : `You have ${itemLength} items in your list. You have packed ${itemsPacked} items. (${percentage})%`}
      </p>
    </div>
  );
}
