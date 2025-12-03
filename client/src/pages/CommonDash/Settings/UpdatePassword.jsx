import React from 'react'
import useForm from '../../../hooks/useForm';
import DefaultButton from '../../../component/Buttons/DefaultButton';
import DefaultInput from '../../../component/Form/DefaultInput';

const UpdatePassword = () => {
    const { values, handleChange } = useForm({
        currentpass: "",
        newpass: "",
    });

    return (
        <div className="p-2 space-y-6">

            <form method="post" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="Current Password"
                        placeholder="Enter Current Password"
                        name="currentpass"
                        type="password"
                        value={values.currentpass}
                        required
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="New Password"
                        placeholder="Enter New Password"
                        name="newpass"
                        type="password"
                        value={values.newpass}
                        required
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <DefaultButton
                        type="submit"
                        label="Update Password"
                    />
                </div>
            </form>
        </div>
    )
}

export default UpdatePassword
