import React from 'react';
import useForm from '../../../hooks/useForm';
import DefaultInput from '../../../component/Form/DefaultInput';
import DefaultButton from '../../../component/Buttons/DefaultButton';

const Social = () => {
    const { values, handleChange } = useForm({
        github: "",
        linkedin: "",
        twitter: "",
        fb: "",
        website: "",
    });

    return (
        <div className="p-2 space-y-6">

            {/* IMPORTANT NOTE */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200">
                <span className="font-semibold text-emerald-600 uppercase">Important:</span>
                <span className="ml-1 text-gray-700">
                    GitHub must contain <strong>only your username</strong>.
                    This system will fetch activity using your GitHub profile.
                </span>
            </div>

            <form method="post" className="space-y-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="GitHub Username"
                        placeholder="e.g. jovinperera"
                        name="github"
                        value={values.github}
                        required
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="LinkedIn"
                        placeholder="Enter LinkedIn Profile URL"
                        name="linkedin"
                        value={values.linkedin}
                        required
                        onChange={handleChange}
                    />
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DefaultInput
                        label="Twitter / X"
                        placeholder="Enter Twitter username or URL"
                        name="twitter"
                        value={values.twitter}
                        required
                        onChange={handleChange}
                    />

                    <DefaultInput
                        label="Facebook"
                        placeholder="Enter Facebook Profile URL"
                        name="fb"
                        value={values.fb}
                        required
                        onChange={handleChange}
                    />
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1">
                    <DefaultInput
                        label="Website / Portfolio"
                        placeholder="Enter your website or portfolio URL"
                        name="website"
                        value={values.website}
                        onChange={handleChange}
                    />
                </div>

                {/* BUTTON */}
                <div>
                    <DefaultButton
                        type="submit"
                        label="Save Accounts"
                    />
                </div>

            </form>
        </div>
    );
};

export default Social;
