"use client";

import Link from "next/link";
import { Router } from "next/router";
import { usePathname } from "next/navigation";

const SimpleNavMenu = ({ session }: { session: boolean }) => {
  const pathname = usePathname();

  return (
    <header className="bg-green-800">
      <nav className="flex justify-around">
        <Link href={pathname != "/" ? "/" : {}} className="">
          Dashboard
        </Link>
        <Link
          href={pathname != "/transactions" ? "/transactions" : {}}
          className=""
        >
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
