import { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../../api/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/authSlice";
import { fetchOrganization } from "../../slices/organizationSlice";

const useLoginForm = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { email: email.trim(), password };

      const response = await login(payload);

      const user = response?.user;
      const role = user?.role;

      dispatch(setCredentials({ user, role }));

      if (role === "ADMIN" || role === "EMPLOYEE") {
        dispatch(fetchOrganization());
      }

      if (role === "ADMIN") {
        navigate("/admin/admin-dashboard");
      } else if (role === "EMPLOYEE") {
        navigate("/employee/employee-dashboard");
      } else {
        navigate("/superadmin/superadmin-dashboard");
      }

      setEmail("");
      setPassword("");

      toast.success("Login successful");

    } catch (error) {
      console.error("Login failed", error);
      const message = error.response?.data?.message || "Something went wrong during login";
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return { email, password, loading, setEmail, setPassword, handleLogin, onEmailChange, onPasswordChange };
};

export default useLoginForm;
