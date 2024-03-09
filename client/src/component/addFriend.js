import { useState } from "react";
import api from "../interceptors/axios";
import UserCard from "./userCard";
function AddFriend() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  async function HandleSubmit(event) {
    event.preventDefault();
    if (search === "") {
      setMessage("Please enter a username");
      return;
    }
    const response = await api.get("home/SearchFriend", {
      params: { username: search },
    });
    if (response.status === 200) {
      console.log(response.data);
      setUsers(response.data);
      setMessage("");
    } else {
      setMessage(response.data.message);
      setUsers([]);
    }
  }
  return (
    <>
      <h1>Add Friend</h1>
      <form onSubmit={HandleSubmit}>
        <div className="form-group">
          <input
            required
            placeholder="username"
            type="search"
            className="form-control"
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-lg">
            Large button
          </button>
          {message && <p>{message}</p>}
          {users &&
            users.map(({ _id, username, profilePicture }) => (
              <UserCard
                key={_id}
                id={_id}
                username={username}
                profilePicture={profilePicture}
              />
            ))}
        </div>
      </form>
    </>
  );
}

export default AddFriend;
