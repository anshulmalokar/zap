"use client";
import React, { useRef } from "react";
import axios from "axios";
type Props = {};

export default function Page({}: Props) {
  return (
    <>
      <div className="h-[calc(100vh-4rem)] w-full flex justify-center items-center">
        <div className="flex w-full h-full">
          <div className="flex-1 flex justify-center items-center">
            <LeftComponent />
          </div>
          <div className="flex-1 flex justify-center items-center">
            <RightComponent/>
          </div>
        </div>
      </div>
    </>
  );
}

function LeftComponent({}: Props) {
  return (
    <div className="flex flex-col justify-center items-start w-96">
      <h1 className="text-3xl mb-6 font-bold">
        Join millions worldwide who automate their work using Zapier.
      </h1>
      <h1 className="text-xl mb-2">Easy setup, no coding required</h1>
      <h1 className="text-xl mb-2">Free forever for core features</h1>
      <h1 className="text-xl">14-day trial of premium features & apps</h1>
    </div>
  );
}

function RightComponent({}: Props) {
  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const handleClickSignUp = async() => {
    const body ={
      username,
      email,
      password
    }
    const response = await axios.post(`${process.env.BACKEND_URL}/signup`,body);
    if(response.status === 200){
      const token = response.data.token;
      localStorage.setItem("Authorization", `Bearer ${token}`);
    }else{
      alert("Error doing signup");
    }
  }
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
      <form
        action="#"
        onSubmit={e => e.preventDefault()}
        className="w-96 max-w-md p-6 z-10 bg-white shadow-md rounded-lg border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            ref={username}
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            ref={email}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            ref={password}
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleClickSignUp}
          type="submit"
          className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
}