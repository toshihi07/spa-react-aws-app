import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";

const apiUrl = "https://tn27870bi3.execute-api.ap-northeast-1.amazonaws.com/dev/users";  // API Gateway のエンドポイント

const App = () => {
  const { auth } = useAuth(); // Cognito認証情報を取得
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  const fetchUsers = async () => {
    if (!auth.isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`  // トークンをAPIヘッダに追加
        }
      });
      const data = response.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid data format", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const addUser = async () => {
    if (!userName) {
      console.error("User name is required");
      return;
    }
    try {
      await axios.post(apiUrl, { name: userName }, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`  // トークンをAPIヘッダに追加
        }
      });
      setUserName("");  
      fetchUsers();  
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const updateUser = async () => {
    if (!userId || !userName) {
      console.error("User ID and name are required");
      return;
    }
    try {
      await axios.put(`${apiUrl}/${userId}`, { name: userName }, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`  // トークンをAPIヘッダに追加
        }
      });
      setUserName("");  
      setUserId("");  
      fetchUsers();  
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`  // トークンをAPIヘッダに追加
        }
      });
      fetchUsers();  
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [auth.isAuthenticated]);  // ユーザー認証状態が変わったときに再取得

  const signOutRedirect = () => {
    const clientId = "k8ue7kehtuh4o4no4o9hsoct2";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>

        <h1>User Management</h1>

        <div>
          <h2>Add User</h2>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
          />
          <button onClick={addUser}>Add User</button>
        </div>

        <div>
          <h2>Update User</h2>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID to update"
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter new user name"
          />
          <button onClick={updateUser}>Update User</button>
        </div>

        <h2>Users List</h2>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.userId}>
                {user.name} (ID: {user.userId})
                <button onClick={() => deleteUser(user.userId)}>Delete</button>
              </li>
            ))
          ) : (
            <li>No users found</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
};

export default App;