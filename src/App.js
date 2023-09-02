import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
// https://i.pravatar.cc/48?u=933372

function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [addFriendWinOpen, setAddFriendWinOpen] = useState(false);

  function addItems(item) {
    setFriendList((friendList) => [...friendList, item]);
  }
  function handleSelect(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
  }
  function handleSplit(value) {
    setFriendList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendList={friendList}
          onSelectFriend={handleSelect}
          selectedFriend={selectedFriend}
        />
        <AddFriend
          name={name}
          onName={setName}
          image={image}
          onImage={setImage}
          onAddItems={addItems}
          addFriendWinOpen={addFriendWinOpen}
        />
        <Button
          onAddFriendWinOpen={setAddFriendWinOpen}
          addFriendWinOpen={addFriendWinOpen}
        >
          {addFriendWinOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend ? (
        <SplitBillWindow
          selectedFriend={selectedFriend}
          onSplit={handleSplit}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function FriendsList({ friendList, onSelectFriend, selectedFriend }) {
  return (
    <div>
      <ul>
        {friendList.map((friend) => (
          <FriendItem
            friend={friend}
            onSelectFriend={onSelectFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}
function FriendItem({ friend, selectedFriend, onSelectFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <div className="friend-list">
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={`${friend.name}'s profile`}></img>
        <h2>{friend.name}</h2>
        {friend.balance < 0 ? (
          <p style={{ color: "red" }}>
            you owe {friend.name} {`${-1 * friend.balance}`}rs
          </p>
        ) : friend.balance > 0 ? (
          <p
            style={{ color: "green" }}
          >{`${friend.name} owe's you ${friend.balance}rs`}</p>
        ) : (
          <p>You and {friend.name} are even</p>
        )}

        <button className="button" onClick={() => onSelectFriend(friend)}>
          {isSelected ? "Close" : "Select"}
        </button>
      </li>
    </div>
  );
}
function AddFriend({
  name,
  onName,
  image,
  onImage,
  onAddItems,
  addFriendWinOpen,
}) {
  function handleAdd(e) {
    e.preventDefault();
    if (!name) return;
    const newItem = {
      name: name,
      image: image,
      id: Date.now(),
      balance: 0,
    };
    onAddItems(newItem);
  }
  return addFriendWinOpen === false ? (
    ""
  ) : (
    <div>
      <form className="form-add-friend" onSubmit={handleAdd}>
        <label for="friend-name">Friend name</label>
        <input
          type="text"
          id="friend-name"
          value={name}
          onChange={(e) => onName(e.target.value)}
        ></input>
        <label for="image-url">Image URL</label>
        <input
          type="text"
          id="image-url"
          placeholder="https://i.pravatar.cc/48?u=499476"
          value={image}
          onChange={(e) => onImage(e.target.value)}
        ></input>
        <button className="button">Add</button>
      </form>
    </div>
  );
}
function SplitBillWindow({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState();
  let friendExpense = bill ? bill - yourExpense : "";
  const [billPayer, setBillPayer] = useState("you");
  function handleSubmit(e) {
    e.preventDefault();
    onSplit(billPayer === "you" ? friendExpense : -yourExpense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        id="bill-value"
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>Your expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > bill ? yourExpense : Number(e.target.value)
          )
        }
      ></input>
      <label>{selectedFriend.name}'s expense</label>
      <input type="number" disabled value={friendExpense}></input>
      <label>Who is paying the bill</label>
      <select value={billPayer} onChange={(e) => setBillPayer(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}

function Button({ children, onAddFriendWinOpen, addFriendWinOpen }) {
  return (
    <button
      className="button"
      onClick={() => onAddFriendWinOpen(!addFriendWinOpen)}
    >
      {children}
    </button>
  );
}

export default App;
