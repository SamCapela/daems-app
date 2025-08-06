'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Accueil' },
        { href: '/clips', label: 'Clips' },
    ];

    return (
        <nav className="flex gap-4 mb-8 justify-center bg-gray-900 p-4 rounded-lg shadow-lg">
            {links.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${pathname === link.href
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
