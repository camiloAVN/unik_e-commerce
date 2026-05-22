'use client';
import { changeUserRole } from '@/actions';
import { User } from '@/interfaces';
import React from 'react'

interface Props{
    users: User[];
}

export const UsersTable = ({users}:Props) => {
    return (
        <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{user.id}</span>
                        </td>
                        <td className="px-6 py-4">
                            <div>
                                <div className="text-sm text-gray-500">{user.name}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <select 
                                value={user.role}
                                onChange={e => changeUserRole(user.id, e.target.value)}
                                className='text-sm text-gray-900'>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>

                            </select>
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
