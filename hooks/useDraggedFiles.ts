import { useEffect, useState } from 'react';

/**
 * Hook to handle files dragged from homepage tool cards
 * Checks sessionStorage for dragged files and returns them
 */
export function useDraggedFiles() {
    const [draggedFiles, setDraggedFiles] = useState<File[]>([]);

    useEffect(() => {
        // Check if files were dragged from homepage
        const fileDataStr = sessionStorage.getItem('draggedFiles');
        const filesPending = sessionStorage.getItem('draggedFilesObjects');

        if (fileDataStr && filesPending === 'pending') {
            try {
                const fileData = JSON.parse(fileDataStr);
                // Note: We can't actually reconstruct File objects from sessionStorage
                // This is just metadata. The actual files need to be handled differently.
                // For now, we'll just clear the session storage
                sessionStorage.removeItem('draggedFiles');
                sessionStorage.removeItem('draggedFilesObjects');
            } catch (error) {
                console.error('Error parsing dragged files:', error);
                sessionStorage.removeItem('draggedFiles');
                sessionStorage.removeItem('draggedFilesObjects');
            }
        }
    }, []);

    return draggedFiles;
}
