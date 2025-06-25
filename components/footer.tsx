import React from 'react'
import Github from '@/public/github-mark.svg'
import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <div className="w-full flex flex-col items-center gap-4 py-8 bg-gray-50 border-t">
            {/* Social Icons Row */}
            <div className="flex items-center justify-center gap-4">
                <a href="https://github.com/suio03/zip-game" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Image src={Github} alt="Github" className="w-6 h-6" />
                </a>
            </div>
            
            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
                <Link href="/privacy" className="hover:text-gray-800 transition-colors">
                    Privacy Policy
                </Link>
                <span className="text-gray-400">•</span>
                <Link href="/tos" className="hover:text-gray-800 transition-colors">
                    Terms of Service
                </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-500">
                <div>© {currentYear} Zip Game. All rights reserved.</div>
            </div>
        </div>
    )
}

export default Footer