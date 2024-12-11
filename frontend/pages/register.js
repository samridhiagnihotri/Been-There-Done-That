import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loading from "../components/Loading";
import Router from "next/router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cf_password, setCf_password] = useState("");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    user: { user },
  } = useSelector((state) => state);

  useEffect(() => {
    if (user) {
      Router.push("/");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`,
        {
          name,
          email,
          password,
          cf_password,
        }
      );

      if (response.data.success) {
        setName("");
        setEmail("");
        setPassword("");
        setCf_password("");
        enqueueSnackbar("Registration successful!", {
          variant: "success",
          autoHideDuration: 3000,
        });
        Router.push("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-6xl mx-auto min-h-[85vh] grid md:grid-cols-2">
          <div className="h-full flex justify-center items-center flex-col">
            <h1 className="text-3xl tracking-wider font-bold text-pink-100 mb-5">
              REGISTER
            </h1>
            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-pink-400"
                type="text"
                placeholder="Your name"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-pink-400"
                type="email"
                placeholder="Your Email address"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-pink-400"
                type="password"
                placeholder="New password"
              />
              <input
                value={cf_password}
                onChange={(e) => setCf_password(e.target.value)}
                className="p-3 font-semibold outline-none rounded-lg bg-transparent w-64 text-center placeholder:text-sm border-2 border-pink-400"
                type="password"
                placeholder="Confirm password"
              />
              <input
                className="bg-pink-400 text-white hover:bg-pink-100 hover:text-pink-600 tracking-widest transition duration-300 ease-in-out font-bold p-3 rounded-lg cursor-pointer"
                type="submit"
                value="Register"
              />
            </form>
            <p className="mt-3">
              Already have an account?
              <Link href="/login">
                <span className="text-pink-500 font-semibold ml-2 cursor-pointer">Login Now</span>
              </Link>
            </p>
          </div>
          <div className="hidden md:flex h-full justify-center items-center">
            <img
              src="/coffee4.png"
              className="h-[400px]"
              alt="Register"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
