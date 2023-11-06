import { Col, Form, Input, Row, Button, message, Checkbox, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from '../api/modules/roles';
import { useState } from 'react';
import { Chapter } from '../types/Types';
import { CheckboxValueType } from 'antd/es/checkbox/Group';

export default function CreateRole() {
  const [form] = useForm();
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const [selectedPermissions, setSelectedPermissions] = useState<
    CheckboxValueType[]
  >([]);

  const { data: roles } = useGetRolesQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: permissions } = useGetPermissionsQuery({
    refetchOnMountOrArgChange: true,
  });

  const CheckBoxGroup = Checkbox.Group;
  const checkBoxOptions =
    permissions !== undefined && permissions.data.length !== 0
      ? permissions?.data
          .filter((x) => x.subject[0].match(/Chapter .+/))
          .map((x) => x.subject[0])
      : [];

  const dataSource = roles?.data.slice(3).map((doc, index) => ({
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
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      render: (perms: any) => {
        if (perms !== undefined) {
          return perms.map((x) => (
            <p key={x.id} style={{ margin: '2px' }}>
              {x.subject[0]}
            </p>
          ));
        }
      },
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
  ];

  const handleFormChange = (list: CheckboxValueType[]) => {
    setSelectedPermissions(list);
  };

  const handleEdit = (role: any) => {
    const fields = form.getFieldsValue();
    fields.id = role.id;
    fields.name = role.name;
    setSelectedPermissions(role.permissions.map((perm) => perm.subject[0]));
    form.setFieldsValue(fields);
  };

  const resetForm = () => {
    form.setFieldsValue(form.resetFields);
    setSelectedPermissions([]);
  };

  return (
    <Row style={{ paddingTop: '90px' }}>
      <Col span={18} offset={3}>
        <h3 style={{ marginTop: '0px' }}>Create a new role</h3>
        <Form
          autoComplete="off"
          onFinish={(values) => {
            message.config({
              top: 75,
            });

            const newRole = {
              name: values.name,
              permissions: selectedPermissions.map((x) =>
                permissions.data.find((perm) => perm.subject[0] === x)
              ),
            };

            if (!values.id) {
              createRole(newRole)
                .unwrap()
                .then(() => message.success('Role added successfully!'))
                .catch(() => message.error('Role is already registered!'));
              form.resetFields();
            } else {
              Object.assign(newRole, { id: values.id });
              updateRole(newRole);
            }

            form.resetFields();
            setSelectedPermissions([]);
          }}
          form={form}
        >
          <Form.Item name="id" hidden>
            <Input name="id" />
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
          <h4>Select permissions</h4>
          <CheckBoxGroup
            options={checkBoxOptions}
            value={selectedPermissions}
            onChange={handleFormChange}
            className="div-content-center"
          />
          <Button
            onClick={() => resetForm()}
            style={{
              float: 'left',
              display: 'inline-block',
              marginTop: '15px',
            }}
          >
            Reset
          </Button>
          <Button
            htmlType="submit"
            style={{
              float: 'right',
              display: 'inline-block',
              marginTop: '15px',
            }}
          >
            Submit
          </Button>
        </Form>
      </Col>
      <Col span={18} offset={3} style={{ marginTop: 50 }}>
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
