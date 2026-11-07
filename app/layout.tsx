import './globals.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Parlance | French with confidence',description:'A personalized, interactive French B1 learning space with AI tutoring, DELF preparation and progress tracking.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
