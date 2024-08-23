import Image from "next/image";
import Link from "next/link";

import { MdMenu } from "react-icons/md";

const Navbar = () => {
    return (
        <section className='fixed top-0 left-0 w-full flex justify-between items-center p-6 shadow-md text-white z-[99]'>
            <div>
                <Image src='/images/NavLogo.svg' alt='LOGO' width={0} height={0} className="w-[70px] h-[50px]" />
            </div>
            <div>
                <ul className="hidden md:flex gap-8">
                    <li><Link href='#'>Home</Link></li>
                    <li><Link href='#cards'>Cards</Link></li>

                </ul>
            </div>
            <div className="">
                <MdMenu size={24} />
            </div>
        </section>
    );
}

export default Navbar;