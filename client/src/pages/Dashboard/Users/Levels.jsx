import React, { useEffect, useState } from 'react'
import { FaEdit, FaUserTag } from 'react-icons/fa'
import API from '../../../services/api'
import { Link } from 'react-router-dom'

const Levels = () => {
    const [roledata, setroledata] = useState([])
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchAllRoles = async () => {
            try {
                const res = await API.get(`/role/get-roles?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setroledata(Array.isArray(res.data.result) ? res.data.result : []);
            }
            catch (err) {
                console.log(err)
            }
        }

        if (token) fetchAllRoles()
    }, [token])


    const roledatastats = [
        {
            id: 1,
            name: "Total Roles",
            icon: FaUserTag,
            value: roledata.length
        }
    ]

    return (
        <div className='p-4'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {roledatastats.map((data) => {
                    const Icon = data.icon;
                    return (
                        <div
                            key={data.id}
                            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md">
                                    <Icon className="text-white text-2xl" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{data.name}</p>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                                        {data.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6">
                <div className="bg-white shadow-xl rounded-3xl p-4">
                    <table className="min-w-full text-left text-gray-700">
                        <thead className="hidden sm:table-header-group">
                            <tr className="text-gray-500 text-sm border-b border-gray-200">
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Permissions</th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                roledata.map((role, index) => {
                                    return (
                                        <tr className="hover:bg-gray-50 transition rounded-xl sm:table-row flex flex-col sm:flex-row mb-4 sm:mb-0 p-4 sm:p-0">
                                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                                                {index + 1}
                                            </td>
                                            <td className="py-2 px-2 sm:py-4 sm:px-4">
                                                {role?.name}
                                            </td>
                                            <td className="py-3 px-4 flex flex-wrap gap-2">
                                                {role.permissions.length > 0 ? (
                                                    role.permissions.map((perm, i) => (
                                                        <span
                                                            key={i}
                                                            className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium"
                                                        >
                                                            {perm}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">No permissions</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-2 sm:py-4 sm:px-4 text-gray-400">
                                                <Link to={`/dashboard/admin/levels/view/${role?._id}`}>
                                                    <FaEdit />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Levels