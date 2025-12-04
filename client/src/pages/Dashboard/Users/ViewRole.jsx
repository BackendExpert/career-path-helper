import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../../../services/api'
import DefaultButton from '../../../component/Buttons/DefaultButton'
import DefaultInput from '../../../component/Form/DefaultInput'
import useForm from '../../../hooks/useForm'

const ViewRole = () => {
    const { id } = useParams()
    const [onerole, setOnerole] = useState(null)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(null)
    const token = localStorage.getItem('token')

    // Fetch role by ID
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

    // Separate form states for create & delete
    const { values: createValues, handleChange: handleCreateChange } = useForm({
        perName: '',
    })

    const { values: deleteValues, handleChange: handleDeleteChange } = useForm({
        perName: '',
    })

    // Handle create permission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await API.post(`/role/create-permission/${id}`, createValues, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })

            if (res.data.success === true) {
                setToast({ success: true, message: res.data.message })
                setTimeout(() => location.reload(), 2000)
            } else {
                setToast({ success: false, message: res.data.message })
            }
        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "Something went wrong.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await API.delete(`/role/delete-permission/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                data: deleteValues, // <-- pass the permission name here
            })

            if (res.data.success === true) {
                setToast({ success: true, message: res.data.message })
                setTimeout(() => location.reload(), 2000)
            } else {
                setToast({ success: false, message: res.data.message })
            }
        } catch (err) {
            setToast({
                success: false,
                message: err.response?.data?.message || "Something went wrong.",
            })
        } finally {
            setLoading(false)
        }
    }
    if (!onerole) return <div className="p-4 text-gray-500">Loading role data...</div>

    return (
        <div className="space-y-6 py-4">
            {/* Toast */}
            {toast && (
                <div
                    className={`p-4 rounded-md text-white font-medium ${toast.success ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    {toast.message}
                </div>
            )}

            {/* Role Info Card */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <Link to={'/dashboard/admin/levels'}>
                    <div className="w-full sm:w-40 mb-3">
                        <DefaultButton type='button' label='Back to Levels' />
                    </div>
                </Link>

                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-cyan-600 break-words">
                    Role: {onerole.name}
                </h1>

                <h2 className="text-xl sm:text-2xl font-semibold mb-3">Permissions</h2>
                {onerole.permissions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {onerole.permissions.map((perm, index) => (
                            <span
                                key={index}
                                className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium break-words"
                            >
                                {perm}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 italic">No permissions assigned</p>
                )}
            </div>

            {/* Create Permission Card */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-500">Create New Permissions</h1>
                <div className="py-2 text-sm text-gray-400">
                    eg: 'enter Permissions to create, user:create'
                </div>

                <form onSubmit={handleSubmit} method="post" className="space-y-4 mt-2">
                    <DefaultInput
                        label="Add New Permissions"
                        type="text"
                        name="perName"
                        value={createValues.perName}
                        onChange={handleCreateChange}
                        placeholder="Create New Permissions"
                        required
                    />

                    <div className="w-full sm:w-1/2">
                        <DefaultButton
                            type='submit'
                            label={loading ? 'Creating...' : 'Create Permissions'}
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>

            {/* Delete Permission Card */}
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-500">Delete Permissions</h1>
                <div className="py-2 text-sm text-gray-400">
                    eg: 'enter current Permissions to delete'
                </div>

                <form onSubmit={handleDelete} method="post" className="space-y-4 mt-2">
                    <DefaultInput
                        label="Delete Permissions"
                        type="text"
                        name="perName"
                        value={deleteValues.perName}
                        onChange={handleDeleteChange}
                        placeholder="Enter Permission to Delete"
                        required
                    />

                    <div className="w-full sm:w-1/2">
                        <DefaultButton
                            type='submit'
                            label={loading ? 'Deleting...' : 'Delete Permission'}
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ViewRole
