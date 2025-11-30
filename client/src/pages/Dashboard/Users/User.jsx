import React from 'react'
import { FaUser, FaUsers } from 'react-icons/fa'

const User = () => {
    const userdata = [
        { id: 1, name: 'Total Users', value: 50, icon: FaUsers },
        { id: 2, name: 'Total Admins', value: 5, icon: FaUser },
        { id: 3, name: 'Total Interns/Undergraduate', value: 30, icon: FaUsers },
        { id: 4, name: 'Total SE/SSE', value: 15, icon: FaUsers }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {userdata.map((data) => {
                const Icon = data.icon

                return (
                    <div
                        key={data.id}
                        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                                <Icon className="w-8 h-8 text-white" />
                            </div>

                            <div>
                                <p className="text-gray-600 text-sm">{data.name}</p>

                                <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-3xl font-bold">
                                    {data.value}
                                </p>
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default User
