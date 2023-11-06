import { useState } from 'react';
import { Table, Row, Col, Modal, Form, Checkbox, Button, Tag } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { EditDocumentDTO, Document, Chapter } from '../types/Types';
import {
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
  useUpdateDocumentMutation,
} from '../api/modules/documents/index';
import { useGetChaptersQuery } from '../api/modules/chapters';

function DocumentList() {
  const [useDelete] = useDeleteDocumentMutation();
  const [useUpdate] = useUpdateDocumentMutation();
  const [selectedDocument, setSelectedDocument] = useState('');
  const [selectedChapters, setSelectedChapters] = useState<CheckboxValueType[]>(
    []
  );

  const { data: documents } = useGetDocumentsQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: chapters } = useGetChaptersQuery({
    refetchOnMountOrArgChange: true,
  });

  const { confirm } = Modal;
  const CheckBoxGroup = Checkbox.Group;
  const checkBoxOptions =
    chapters !== undefined && chapters.length !== 0
      ? chapters?.map((x) => x.tag)
      : [];

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this document ?',
      icon: <ExclamationCircleFilled />,
      content: 'Deleted files cannot be recovered',
      onOk() {
        useDelete(id);
      },
    });
  };

  const handleEdit = (id: string, chaptersParam: string[]) => {
    setSelectedDocument(id);
    setSelectedChapters(chaptersParam);
  };

  const dataSource = documents?.map((doc, index) => ({
    ...doc,
    key: index,
  }));

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Upload date',
      dataIndex: 'uploadDate',
      key: 'date',
    },
    {
      title: 'Chapters',
      dataIndex: 'chapters',
      render: (chs: Chapter[] | undefined) => {
        if (chs !== undefined) {
          return (
            <span>
              {chs.map((chapter) => {
                const ch2 = chapters?.find((obj) => obj.id === chapter.id);
                if (ch2 !== undefined) {
                  return (
                    <Tag key={ch2.id} color={ch2.color}>
                      {ch2.tag.toUpperCase()}
                    </Tag>
                  );
                }
              })}
            </span>
          );
        }
      },
    },
    {
      title: 'Add chapter',
      key: 'addChapter',
      render: (_: object, record: Document) => (
        <Button
          onClick={() => {
            let chapterTags = [];
            if (record.chapters !== undefined) {
              for (const chapter of record.chapters) {
                chapterTags.push(chapter.tag);
              }
            }
            handleEdit(record.id, chapterTags);
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_: object, record: Document) => (
        <Button
          danger
          onClick={() => {
            showDeleteConfirm(record.id);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleFormChange = (list: CheckboxValueType[]) => {
    setSelectedChapters(list);
  };

  const handleFormSubmit = () => {
    const cats: Chapter[] = [];
    for (const x of selectedChapters) {
      let a = chapters.find((obj) => obj.tag === x);
      if (a !== undefined) {
        cats.push(a);
      }
    }

    const doc: EditDocumentDTO = {
      id: selectedDocument,
      chapters: cats,
    };

    useUpdate(doc);
    handleEdit('', []);
  };

  return (
    <Row style={{ marginTop: '10px' }}>
      <Col span={18} offset={3}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ hideOnSinglePage: true, pageSize: 4 }}
          style={{ overflowX: 'auto' }}
        />
      </Col>
      <Modal
        open={selectedDocument !== ''}
        onCancel={() => handleEdit('', [])}
        onOk={handleFormSubmit}
        title="Select the wanted chapters"
      >
        <Form style={{ paddingTop: '10px' }}>
          <CheckBoxGroup
            options={checkBoxOptions}
            value={selectedChapters}
            onChange={handleFormChange}
            className="div-content-center"
          />
        </Form>
      </Modal>
    </Row>
  );
}

export default DocumentList;
