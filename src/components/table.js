import Table from 'react-bootstrap/Table';
import editor from "../assets/editor.png";
import trash from "../assets/trash.png";
import viewer from "../assets/viewer.png";

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
                     <td width={'90%'}>{note.title}</td>
                     <td className='d-flex gap-2'>
                        <button onClick={() => handleView(note)}><img style={{ height: 25}} src={viewer} alt='view'/></button>
                        <button onClick={() => handleEdit(note)}><img style={{ height: 25}} src={editor} alt='edit'/></button>
                        <button onClick={() => deleteNote(note)}><img style={{ height: 25}} src={trash} alt='delete'/></button>
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