import React from 'react'
import useForm from '../../../hooks/useForm';
import DefaultInput from '../../../component/Form/DefaultInput';
import DateInput from '../../../component/Form/DateInput';
import DefaultButton from '../../../component/Buttons/DefaultButton';

const ArticalsSearch = () => {
    const { values, handleChange } = useForm({
        title: '',
        language: '',
        startdate: '',
        enddate: '',
    });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <form className="">
                <div className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
                    <div className="flex-1">
                        <DefaultInput
                            label="Search by Title"
                            name="title"
                            value={values.title}
                            required
                            placeholder="Enter Article Title"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex-1">
                        <DefaultInput
                            label="Search by Language"
                            name="language"
                            value={values.language}
                            placeholder="Enter Language (en)"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex-1">
                        <DateInput
                            label="Start Date"
                            name="startdate"
                            value={values.startdate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex-1">
                        <DateInput
                            label="End Date"
                            name="enddate"
                            value={values.enddate}
                            onChange={handleChange}
                        />
                    </div>

                </div>
                <div className="md:w-1/6">
                    <DefaultButton
                        type="submit"
                        label="Search Articles"
                        className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white"
                    />
                </div>
            </form>
        </div>
    )
}

export default ArticalsSearch
