import Table from 'react-bootstrap/Table';

export default function TableNotes (props) {
   const { isLoading, notes, handleEdit, deleteNote, handleView } = props;

   return (
      <Table className='note-table' striped bordered>
         <thead>
            <tr>
               <th>Note</th>
               <th>Actions</th>
            </tr>
         </thead>
         <tbody>
            {!isLoading && notes.map((note, index) => {
               return (
                  <tr key={index}>
                     <td width={'80%'}>{note.title}</td>
                     <td className='d-flex gap-2'>
                        <button onClick={() => handleView(note)}>View</button>
                        <button onClick={() => handleEdit(note)}>Edit</button>
                        <button onClick={() => deleteNote(note)}>Delete</button>
                     </td>
                  </tr>
               );
            })}
            {isLoading && <h6 className='p-3 text-secondary'>Loading...</h6>}
            {!isLoading && notes.length === 0 && <h6 className='p-3 text-secondary'>No Notes Available</h6>}
         </tbody>
      </Table>
   );
}