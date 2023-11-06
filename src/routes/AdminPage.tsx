import DocumentList from '../components/DocumentList';
import Navbar from '../components/Navbar';
import UploadFile from '../components/UploadFile';

export default function AdminPage() {
  return (
    <div>
      <Navbar />
      <UploadFile />
      <DocumentList />
    </div>
  );
}
