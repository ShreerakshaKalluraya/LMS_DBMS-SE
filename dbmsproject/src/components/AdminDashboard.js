import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUserInfo, setNewUserInfo] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setMessage('Error fetching users: ' + error.message);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user.user_id);
        setNewUserInfo({
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role
        });
    };

    const handleUpdate = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUserInfo)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            setEditingUser(null);
            fetchUsers();
            setMessage('User updated successfully');
        } catch (error) {
            setMessage('Error updating user: ' + error.message);
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            fetchUsers();
            setMessage('User deleted successfully');
        } catch (error) {
            setMessage('Error deleting user: ' + error.message);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {message && <p>{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>
                                {editingUser === user.user_id ? (
                                    <input
                                        value={newUserInfo.username}
                                        onChange={(e) => setNewUserInfo({ ...newUserInfo, username: e.target.value })}
                                    />
                                ) : (
                                    user.username
                                )}
                            </td>
                            <td>
                                {editingUser === user.user_id ? (
                                    <input
                                        value={newUserInfo.email}
                                        onChange={(e) => setNewUserInfo({ ...newUserInfo, email: e.target.value })}
                                    />
                                ) : (
                                    user.email
                                )}
                            </td>
                            <td>
                                {editingUser === user.user_id ? (
                                    <input
                                        value={newUserInfo.role}
                                        onChange={(e) => setNewUserInfo({ ...newUserInfo, role: e.target.value })}
                                    />
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td>
                                {editingUser === user.user_id ? (
                                    <>
                                        <button onClick={() => handleUpdate(user.user_id)}>Save</button>
                                        <button onClick={() => setEditingUser(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(user)}>Edit</button>
                                        <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;