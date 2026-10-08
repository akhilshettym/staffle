import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../../api/auth";
import { setCredentials } from "../../slices/authSlice";

const useCreateOrganizationForm = () => {

    const [dob, setDob] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleConfirmPasswordBlur = (e) => {
        const confirmPassword = e.target.value;
        const form = e.target.form;
        const password = form.password?.value;

        if (!confirmPassword || !password) return;

        if (confirmPassword !== password) {
            toast.error("Passwords do not match");
        }
    };

    const handleCreateOrganization = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const firstName = formData.get("firstName")?.trim();
            const lastName = formData.get("lastName")?.trim();
            const email = formData.get("email")?.trim().toLowerCase();
            const password = formData.get("password");
            const confirmPassword = formData.get("confirmPassword");
            const dateOfBirth = formData.get("dateOfBirth");
            const designation = formData.get("designation") || "Admin";
            const orgName = formData.get("orgName")?.trim();
            const orgDescription = formData.get("orgDescription")?.trim();
            const orgCountry = formData.get("orgCountry")?.trim() || null;
            const orgDomain = formData.get("orgDomain")?.trim() || orgName?.toLowerCase().replace(/\s+/g, "-");

            if (!firstName || !lastName || !email || !password || !confirmPassword || !dateOfBirth || !orgName || !orgDescription) {
                throw new Error("Please fill all required fields");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error("Please enter a valid email address");
            }

            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long");
            }

            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const payload = { firstName, lastName, email, password, confirmPassword, dateOfBirth, designation, orgName, orgDomain, orgDescription, orgCountry };

            const response = await createOrganization(payload);

            if (!response?.success) {
                throw new Error(response?.message || "Could not create organization");
            }

            const { token, user, message } = response;
            toast.success(message || "Organization created successfully");

            dispatch(setCredentials({ token, user }));

            // navigate("/complete-organization");
            // toast.success("Organization Registered Successfully...");
            navigate("/register-organization");

        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return { dob, setDob, loading, handleCreateOrganization, handleConfirmPasswordBlur };

};

export default useCreateOrganizationForm;