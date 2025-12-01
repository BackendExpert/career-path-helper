import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../../../services/api'
import DefaultButton from '../../../component/Buttons/DefaultButton'

const ViewRole = () => {
    const { id } = useParams()
    const [onerole, setOnerole] = useState(null)
    const token = localStorage.getItem('token')

    useEffect(() => {
        const fetchRoleById = async () => {
            try {
                const res = await API.get(`/role/get-roles?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                if (Array.isArray(res.data.result)) {
                    const role = res.data.result.find((r) => r._id === id)
                    setOnerole(role || null)
                }
            } catch (err) {
                console.log(err)
            }
        }

        if (token) fetchRoleById()
    }, [token, id])

    if (!onerole) return <div className="p-6 text-gray-500">Loading role data...</div>

    return (
        <div className="">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <Link to={'/dashboard/admin/levels'}>
                    <div className="w-50 mb-2">
                        <DefaultButton type='button' label='Back to Levels' />
                    </div>
                </Link>

                <h1 className="text-3xl font-bold mb-6 text-cyan-600">Role: {onerole.name}</h1>

                <h2 className="text-2xl font-semibold mb-3">Permissions</h2>
                {onerole.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {onerole.permissions.map((perm, index) => (
                            <span
                                key={index}
                                className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium"
                            >
                                {perm}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">No permissions assigned</p>
                )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md mt-2">
                
            </div>
        </div>
    )
}

export default ViewRole
