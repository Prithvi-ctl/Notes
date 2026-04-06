export const deleteNote = (noteId) => {
    if(!noteId || typeof noteId !== "string"){
        throw new Error('Invalid note ID');
    }

    return {
        id:noteId,
        deletedAt: new Date()
    };
};