import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import API from '../../../services/api';

const SkillPlan = () => {
    const { id } = useParams();

    const [skillplan, setskillplan] = useState('')
    const token = localStorage.getItem("token")

    useEffect(() => {
        const fetchskillplan = async () => {
            try {
                const res = await API.get(`/skill/get-one-plan/${id}?nocache=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setskillplan(res.data.result);
            } catch (err) {
                console.log(err);
            }
        }
        if(token) fetchskillplan()
    }, [token])

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-lg mr-4">
                <div className="">{skillplan.promt}</div>
            </div>
        </div>
    )
}

export default SkillPlan