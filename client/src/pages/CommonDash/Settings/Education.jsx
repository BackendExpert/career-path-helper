import React from 'react'
import useForm from '../../../hooks/useForm';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import DefaultInput from '../../../component/Form/DefaultInput';
import DateInput from '../../../component/Form/DateInput';


const Education = () => {
    const { values, handleChange } = useForm({
        school: "",
        course: "",
        startat: "",
        endat: "",
    });
    return (
        <div>
            <form method="post" className="space-y-6">

                <div className="">
                    <DefaultInput
                        label="School/University"
                        placeholder="Enter University/School"
                        name="school"
                        value={values.school}
                        required
                        onChange={handleChange}
                    />
                </div>


                <div className="">
                    <DefaultInput
                        label="Course"
                        placeholder="BSc, MSc..."
                        name="course"
                        value={values.course}
                        required
                        onChange={handleChange}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DateInput
                        label="Start Date"
                        name="startat"
                        value={values.startat}
                        required
                        onChange={handleChange}
                    />

                    <DateInput
                        label="End Date"
                        name="endat"
                        value={values.endat}
                        required
                        onChange={handleChange}
                    />
                </div>


                <div>
                    <DefaultButton
                        type="submit"
                        label="Save Educations"
                    />
                </div>

            </form>
        </div>
    )
}

export default Education