import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SignupInput, signinInput } from "@ar-ease/medium-common";

import { useState } from "react";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../config";
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const sendRequest = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs,
      );
      const jwt = response.data;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      alert("error while signing up");
    }
  };
  return (
    <div className=" h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold "> Create An account</div>
            <div className="text-slate-500  pl-4">
              already have an account?
              <Link className="underline" to={"/signin"}>
                login
              </Link>
            </div>
          </div>{" "}
          <div className="pt-5">
            {type === "signup" && (
              <LabeledInput
                label="Name"
                placeholder="name"
                onChange={(e) => {
                  setPostInputs({
                    ...postInputs,
                    name: e.target.value,
                  });
                }}
              />
            )}
            <LabeledInput
              label="Email"
              placeholder="email"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  email: e.target.value,
                });
              }}
            />
            <LabeledInput
              label="Password"
              type={"password"}
              placeholder="password"
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value,
                });
              }}
            />
            <div className="pt-8">
              <button
                onClick={sendRequest}
                type="button"
                className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                <Link to={type === "signup" ? "/signin" : "/signup"}>
                  {type === "signup" ? "Sign up" : "Sign in"}
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabeledInputProps {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

export const LabeledInput = ({
  label,
  placeholder,
  onChange,
  type,
}: LabeledInputProps) => {
  return (
    <>
      {" "}
      <div>
        <label className="block mb-2 text-sm  text-gray-900 font-semibold ">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type || "text"}
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder={placeholder}
          required
        />
      </div>
    </>
  );
};
