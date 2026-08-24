import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token?.value) {
    redirect('/');
  }

  // Real server-side verify — catches expired / tampered tokens
  const res = await fetch('http://localhost:4000/api/auth/me', {
    headers: { Cookie: `token=${token.value}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    redirect('/');
  }

  const { user } = await res.json();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f0fdf4',
      fontFamily: 'sans-serif',
      gap: '1rem',
    }}>
      <h1 style={{ color: '#15803d', fontSize: '2rem', margin: 0 }}>
        🌾 Dashboard
      </h1>
      <p style={{ color: '#374151', margin: 0 }}>
        Welcome, <strong>{user.username}</strong>! ({user.email})
      </p>
      <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>
        Coming soon — your KhetLink workspace.
      </p>
      <LogoutButton />
    </div>
  );
}
