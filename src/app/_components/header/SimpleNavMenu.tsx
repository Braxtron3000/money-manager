"use client";

import Link from "next/link";

const SimpleNavMenu = ({ session }: { session: boolean }) => {
  return (
    <header className="bg-green-800">
      <nav className="flex justify-around">
        <Link href={"/"} className="">
          Dashboard
        </Link>
        <Link href={"/transactions"} className="">
          Transactions
        </Link>
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "sign out" : "sign in"}
        </Link>
      </nav>
    </header>
  );
};

export default SimpleNavMenu;
