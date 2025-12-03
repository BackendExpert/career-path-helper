import React from "react";
import useForm from "../../../hooks/useForm";
import DefaultInput from "../../../component/Form/DefaultInput";
import DefaultButton from "../../../component/Buttons/DefaultButton";

const APIConnected = () => {
    const { values, handleChange } = useForm({
        aiapi: "",
    });

    return (
        <div className="p-2 space-y-6">

            {/* IMPORTANT MESSAGE */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200">
                <span className="font-semibold text-emerald-600 uppercase">Important:</span>
                <span className="ml-1 text-gray-700">
                    Enter your <strong>ChatGPT API Key</strong> here.
                    Currently only ChatGPT API is supported — Google Gemini support will be added in future updates.
                </span>
            </div>

            {/* FORM */}
            <form method="post" className="space-y-6">

                <div className="grid grid-cols-1">
                    <DefaultInput
                        label="ChatGPT API Key"
                        placeholder="Enter your API key here"
                        name="aiapi"
                        value={values.aiapi}
                        required
                        onChange={handleChange}
                        type="password"
                    />
                </div>

                <div>
                    <DefaultButton
                        type="submit"
                        label="Save API Key"
                    />
                </div>

            </form>
        </div>
    );
};

export default APIConnected;
