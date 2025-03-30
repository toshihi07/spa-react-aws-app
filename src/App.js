import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

const apiUrl = "https://tn27870bi3.execute-api.ap-northeast-1.amazonaws.com/dev/users";  // API Gateway のエンドポイント

function App() {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (auth.isLoading) return; // 認証の読み込み中は何もしない

    if (!auth.isAuthenticated) {
      console.log("Not authenticated, redirecting to login...");
      auth.signinRedirect(); // ログインしていない場合はログイン画面へリダイレクト
      return;
    }

    // 認証されていればユーザー情報を取得
    fetchUsers();
  }, [auth,fetchUsers ]);  // authが変わったときに再実行

  const fetchUsers = async () => {
    if (!auth.user?.access_token) {
      console.error("No access token available");
      return;
    } // 認証トークンがない場合は処理しない

      console.log("Access Token:", auth.user.access_token); // トークンをログ出力

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,  // トークンをヘッダに追加
        },
      });
      console.log("Response data:", response.data);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Expected an array, but got", response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
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
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      setUserName("");  // 入力欄をリセット
      fetchUsers();  // 新しいユーザーが追加された後にユーザー一覧を再取得
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
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      setUserName("");  // 入力欄をリセット
      setUserId("");  // 入力欄をリセット
      fetchUsers();  // 更新後にユーザー一覧を再取得
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      fetchUsers();  // 削除後にユーザー一覧を再取得
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="App">
      <h1>User Management</h1>

      {auth.isLoading ? (
        <div>Loading...</div>
      ) : auth.isAuthenticated ? (
        <>
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
        </>
      ) : (
        <div>Redirecting to login...</div>
      )}
    </div>
  );
}

export default App;