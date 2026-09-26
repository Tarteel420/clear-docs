import { redirect } from 'next/navigation';

// The site root opens the main documentation page (About Clear).
export default function HomePage() {
  redirect('/docs');
}
