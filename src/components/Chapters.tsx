import {
  Col,
  Form,
  Input,
  Row,
  Table,
  ColorPicker,
  Button,
  Select,
} from 'antd';
const { Option } = Select;
import { useForm } from 'antd/es/form/Form';
import { Chapter } from '../types/Types';
import ChaptersColumns from './ChaptersColumns';
import {
  useCreateChapterMutation,
  useGetChaptersQuery,
  useUpdateChapterMutation,
} from '../api/modules/chapters';
import { useGetPermissionsQuery } from '../api/modules/roles';
import './chapters.css';

export default function Chapters() {
  const [createChapter] = useCreateChapterMutation();
  const [updateChapter] = useUpdateChapterMutation();
  const [form] = useForm();
  const { data: chapters } = useGetChaptersQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: permissions } = useGetPermissionsQuery({
    refetchOnMountOrArgChange: true,
  });

  const dataSource = chapters?.map((chap, index) => ({
    ...chap,
    key: index,
  }));

  const handleEdit = (chapter: Chapter) => {
    const fields = form.getFieldsValue();
    fields.id = chapter.id;
    fields.tag = chapter.tag;
    fields.name = chapter.name;
    fields.description = chapter.description;
    fields.color = chapter.color;
    fields.permissionSubject = chapter.permissionSubject;
    form.setFieldsValue(fields);
  };

  const columns = ChaptersColumns(handleEdit);

  const initial = {
    tag: '',
    name: '',
    description: '',
    color: '#083866',
  };

  const option = permissions?.data
    .filter((x) => x.subject[0].match(/Chapter .+/))
    .map((permission) => (
      <Option value={permission.subject[0]} key={permission.id}>
        {permission.subject[0]}
      </Option>
    ));

  const resetForm = () => {
    form.setFieldsValue(form.resetFields);
  };

  return (
    <Row style={{ paddingTop: '90px' }}>
      <Col span={18} offset={3}>
        <Form
          autoComplete="off"
          initialValues={initial}
          onFinish={(values) => {
            let c;
            if (typeof values.color !== 'string') {
              c = values.color.metaColor.toHexString().toUpperCase();
            } else {
              c = values.color;
            }
            const newChapter = {
              tag: values.tag,
              name: values.name,
              description: values.description,
              color: c,
              permissionSubject: values.permissionSubject,
            };
            if (values.id === undefined) {
              createChapter(newChapter);
            } else {
              Object.assign(newChapter, { id: values.id });
              updateChapter(newChapter);
            }
            form.resetFields();
          }}
          form={form}
        >
          <Form.Item name="id" hidden>
            <Input name="id" />
          </Form.Item>
          <Form.Item
            name="tag"
            rules={[
              {
                required: true,
                message: 'Please enter an tag',
              },
              { whitespace: true },
              { min: 2, max: 6 },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter tag" name="tag" />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter a name',
              },
              { whitespace: true },
              { min: 3, max: 20 },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter name" name="name" />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: 'Please enter a description',
              },
              { whitespace: true },
              { min: 3, max: 100 },
            ]}
            hasFeedback
          >
            <Input placeholder="Enter description" name="description" />
          </Form.Item>
          <Form.Item
            name="permissionSubject"
            className="left-block"
            rules={[
              {
                required: true,
                message: 'Please enter a category',
              },
            ]}
            hasFeedback
          >
            <Select style={{ width: 200 }}>{option}</Select>
          </Form.Item>
          <Form.Item name="color" label="Specify color" className="right-block">
            <ColorPicker />
          </Form.Item>
          <div>
            <Button className="left-block" onClick={() => resetForm()}>
              Reset
            </Button>
            <Button
              htmlType="submit"
              className="right-block"
              style={{ marginBottom: '50px' }}
            >
              Submit
            </Button>
          </div>
        </Form>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ hideOnSinglePage: true, pageSize: 4 }}
          style={{ overflowX: 'auto' }}
        />
      </Col>
    </Row>
  );
}
