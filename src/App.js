import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = "https://tn27870bi3.execute-api.ap-northeast-1.amazonaws.com/dev/users";  // API Gateway のエンドポイント

const App = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  // ユーザー一覧を取得する関数
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUrl);
      // レスポンスが配列か、配列内のユーザーリストかを確認
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.users && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error("Unexpected response format, expected an array of users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  // ユーザーを追加する関数
  const addUser = async () => {
    if (!userName) {
      console.error("User name is required");
      return;
    }
    try {
      await axios.post(apiUrl, { name: userName });
      setUserName("");  // 入力欄をリセット
      fetchUsers();  // 新しいユーザーが追加された後にユーザー一覧を再取得
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  // ユーザー情報を更新する関数
  const updateUser = async () => {
    if (!userId || !userName) {
      console.error("Both user ID and name are required for updating");
      return;
    }
    try {
      await axios.put(`${apiUrl}/${userId}`, { name: userName });
      setUserName("");  // 入力欄をリセット
      setUserId("");  // 入力欄をリセット
      fetchUsers();  // 更新後にユーザー一覧を再取得
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // ユーザーを削除する関数
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchUsers();  // 削除後にユーザー一覧を再取得
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // 初回レンダリング時にユーザー一覧を取得
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
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
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.name}
              <button onClick={() => deleteUser(user.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
};

export default App;