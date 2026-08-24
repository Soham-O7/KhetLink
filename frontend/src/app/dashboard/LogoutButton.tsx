'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: '0.5rem',
        padding: '0.5rem 1.5rem',
        background: '#15803d',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontFamily: 'sans-serif',
      }}
    >
      Logout
    </button>
  );
}
