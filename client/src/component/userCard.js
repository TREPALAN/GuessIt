import { useEffect, useState } from "react";
import { TrackOnlineUser } from "../socket/socket";
import api from "../interceptors/axios";

function UserCard({ id, username, profilePicture, isFriend, isRequestSent }) {
  const [online, setOnline] = useState(false);
  const [friend, setFriend] = useState(isFriend);
  const [requestSent, setRequestSent] = useState(isRequestSent);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Track if a user is online
    async function checkOnline() {
      const result = await TrackOnlineUser(username);
      setOnline(result);
    }
    checkOnline();
    const interval = setInterval(checkOnline, 5000); // 5000 with the interval time in milliseconds

    return () => {
      clearInterval(interval); // Clean up the interval when the component is unmounted
    };
  }, [username]);

  // Remove friend
  async function removeFriend(event) {
    event.preventDefault();
    const response = await api.post("request/deleteFriend", {
      username,
    });
    if (response.status === 200) {
      setFriend(!friend);
    }
  }

  // Add friend or remove friend

  async function addFriend() {
    // Check if the user is already fetching
    if (isFetching) return;
    setIsFetching(true);

    // Add send friend request
    const response = await api.post("request/sendRequest", {
      username,
    });
    if (response.status === 200) {
      setRequestSent(!requestSent);
      setIsFetching(false);
    } else {
      alert(response.data.message);
    }
  }

  return (
    <div className="card" key={id}>
      {online ? (
        <div className="online">on</div>
      ) : (
        <div className="offline">off</div>
      )}
      <div className="card-body">
        <h5 className="card-title">{username}</h5>
        <p className="card-text">{profilePicture}</p>

        {/* Friend status */}
        {friend ? (
          <>
            <div className="friend">friend</div>

            {/* if the user is the current user */}
            {username === localStorage.getItem("username") ? (
              <div>you</div>
            ) : (
              <button className="btn btn-danger" onClick={removeFriend}>
                remove friend
              </button>
            )}
          </>
        ) : // If the user is not a friend

        requestSent ? (
          // If the user is requesting or sent a friend request
          <button className="btn btn-danger" onClick={addFriend}>
            remove friend request
          </button>
        ) : (
          <button className="btn btn-success" onClick={addFriend}>
            send friend request
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
