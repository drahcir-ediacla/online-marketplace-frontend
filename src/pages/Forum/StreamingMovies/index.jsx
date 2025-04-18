import { useEffect } from 'react'
import Header from '../../../layouts/Forum/Header'

const StreamingMovies = () => {

    useEffect(() => {
        // Hide the scrollbar when the component mounts
        document.body.style.overflow = 'hidden';

        // Cleanup: Restore the scrollbar when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <>
            <Header />
            <iframe style={{ border: '0', width: '100%', height: '100vh' }} sandbox="allow-scripts allow-same-origin" src="https://cytv126.com"></iframe>
        </>
    )
}

export default StreamingMovies
