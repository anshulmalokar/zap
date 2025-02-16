'use client'
import Link from "next/link";
import React from "react";
import { CgMoreVerticalO } from "react-icons/cg";
import { IoMenuSharp } from "react-icons/io5";

type Props = {};

export default function NavBar({}: Props) {
  return (
    <>
      <div className="flex justify-between h-16 items-center pl-4 pr-4 bg-white border-b-2">
        <div className="flex items-center">
          <IoMenuSharp 
          size={30}/>
          <h3 className="text-2xl pl-5 font-bold">
            zaphier
          </h3>
        </div>
        <div className="flex items-center">
          <CgMoreVerticalO
          size={30}
          className="m-3 hover:bg-slate-100 hover:rounded-2xl" />
          <Link href={"/signup"}>
          <button
            type="button"
            className="p-3 bg-orange-500 rounded-full "
          >
            Signup
          </button>
          </Link>
        </div>
      </div>
    </>
  );
}
