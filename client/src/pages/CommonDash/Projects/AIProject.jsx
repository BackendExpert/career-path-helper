import React, { useEffect, useState } from 'react'
import useForm from '../../../hooks/useForm'
import API from '../../../services/api'
import DefaultButton from '../../../component/Buttons/DefaultButton'

const AIProject = () => {
    const token = localStorage.getItem('token')
    const [loading, setLoading] = useState(null)


    return (
        <div>
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="mb-4 text-gray-500 ">
                    Using you Current Skills Genarate a Project
                </div>
                <form action="" method="post">
                    <div className="md:w-1/6">
                        <DefaultButton
                            type='submit'
                            label={loading ? 'Genarating Projects' : 'Genarate a Project'}
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AIProject