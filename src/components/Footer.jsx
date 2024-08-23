import React from 'react'

function Footer() {
  return (
    <div className="w-screen bg-slate-300">
    <div className="py-3 my-4">
      <ul className="nav justify-center border-b-2 pb-3 mb-3">
        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted text-white">Home</a></li>
        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted text-white">Features</a></li>
        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted text-white">Pricing</a></li>
        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted text-white">FAQs</a></li>
        <li className="nav-item"><a href="/" className="nav-link px-2 text-muted text-white">About</a></li>
      </ul>
      <p className="text-center text-muted">© 2021 Company, Inc</p>
    </div>
  </div>
  )
}

export default Footer