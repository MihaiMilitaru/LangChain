import { useState } from 'react';
import { Spin, UploadProps, Upload, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './uploadFile.css';
import { useCreateDocumentMutation } from '../api/modules/documents/index';

const { Dragger } = Upload;

interface Response {
  data: {
    statusCode: number;
    message: string;
    error: string;
  };
  status: string;
}

function UploadFile() {
  const [useCreate] = useCreateDocumentMutation();
  const [loading, setIsLoading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  // 0 not uploaded, 1 uploaded successfully, 2 error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSucces = () => {
    setIsLoading(false);
    setUploaded(1);
  };

  const handleError = (err: Response) => {
    setErrorMessage(err.data.message);
    setIsLoading(false);
    setUploaded(2);
  };

  const handleTransform = async (file: File) => {
    let formData = new FormData();
    formData.append('file', file, file.name);

    setIsLoading(true);
    useCreate(formData)
      .unwrap()
      .then(() => handleSucces())
      .catch((err) => handleError(err));
  };

  const props: UploadProps = {
    name: 'file',
    maxCount: 1,
    accept: '.pdf',
    showUploadList: false,
    beforeUpload(file) {
      setUploaded(0);
      setIsLoading(true);
      handleTransform(file);
      return false;
    },
  };

  return (
    <Row style={{ paddingTop: '90px' }}>
      <Col span={18} offset={3}>
        {!loading ? (
          <Dragger {...props} className="dragger">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. File must be of type pdf.
            </p>
          </Dragger>
        ) : (
          <div className="spin-div">
            <Spin size="large" />
          </div>
        )}
        {uploaded === 1 && (
          <div className="message message-success">
            <p>File has been uploaded successfully</p>
          </div>
        )}
        {uploaded === 2 && (
          <div className="message message-error">
            <p>There was an error when uploading the file</p>
            <p>{errorMessage}</p>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default UploadFile;
