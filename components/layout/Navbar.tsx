import { getSafeUserInfo } from "@/server/modules/user/user.action";
import Image from "next/image";
import Link from "next/link";

const Navbar = async () => {
  const user = await getSafeUserInfo();
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>
        <ul>
          <Link href="/">Home</Link>
          <Link href="/events/create">Create Event</Link>
          {user ? (
            <div>{user.username}</div>
          ) : (
            <Link href="/auth">Login/Register</Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
