import { Button, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Chapter } from '../types/Types';
import { useDeleteChapterMutation } from '../api/modules/chapters';

export default function ChaptersColumns(handleEdit: (record: Chapter) => void) {
  const [useDelete] = useDeleteChapterMutation();
  const { confirm } = Modal;

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this chapter?',
      icon: <ExclamationCircleFilled />,
      content: 'Deleted chapters cannot be recovered',
      onOk() {
        useDelete(id);
      },
    });
  };

  return [
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Color',
      key: 'color',
      render: (_: object, record: Chapter) => (
        <b style={{ color: `${record.color}` }}>{record.color}</b>
      ),
    },
    {
      title: 'Permission',
      dataIndex: 'permissionSubject',
      key: 'permissionSubject',
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (_: object, record: Chapter) => (
        <Button
          onClick={() => {
            handleEdit(record);
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_: object, record: Chapter) => (
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
}
