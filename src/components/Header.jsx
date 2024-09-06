import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='bg-zinc-800 min-h-16 flex justify-between px-4 items-center'>
        <div className='text-center font-serif text-white'> LCAnalyser</div>
        <div className='block lg:hidden'>
          <button onClick={toggleMenu} className='text-white'>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
        <nav className='hidden lg:flex flex-row lg:space-x-4 text-white'>
          <a href="/" className='ml-2 no-underline hover:underline text-white'>Home</a>
          <a href="/about" className='ml-2 no-underline hover:underline text-white'>About</a>
          <a href="/contact" className='ml-2 no-underline hover:underline text-white'>Contact</a>
          <a href="/analyzer" className='ml-2 no-underline hover:underline text-white'>Analyzer</a>
        </nav>
      </div>
      {/* Side Panel for Mobile */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-zinc-900 text-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform lg:hidden`}>
        <div className='flex justify-end p-4'>
          <button onClick={toggleMenu} className='text-white'>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <nav className='flex flex-col p-4 space-y-4'>
          <a href="/" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>Home</a>
          <a href="/about" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>About</a>
          <a href="/contact" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>Contact</a>
          <a href="/analyzer" className='no-underline hover:underline text-white' onClick={() => setIsOpen(false)}>Analyzer</a>
        </nav>
      </div>
    </>
  );
}

export default Header;
