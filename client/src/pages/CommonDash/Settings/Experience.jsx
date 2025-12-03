import React from 'react'
import useForm from '../../../hooks/useForm';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import DefaultInput from '../../../component/Form/DefaultInput';
import DateInput from '../../../component/Form/DateInput';


const Experience = () => {
    const { values, handleChange } = useForm({
        workplace: "",
        job: "",
        startat: "",
        endat: "",
    });
    return (
        <div>
            <form method="post" className="space-y-6">

                <div className="">
                    <DefaultInput
                        label="Work Place/Company"
                        placeholder="Enter Work Place/Company"
                        name="workplace"
                        value={values.workplace}
                        required
                        onChange={handleChange}
                    />
                </div>


                <div className="">
                    <DefaultInput
                        label="Position"
                        placeholder="Software Engineer, Tech Lead..."
                        name="job"
                        value={values.job}
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

export default Experience