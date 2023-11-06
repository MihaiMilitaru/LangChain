import { Table, Row, Col, Select, Form, Button, Modal, message } from 'antd';
const { Option } = Select;
import { useGetUsersQuery, usePatchUserMutation } from '../api/modules/users';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { useGetRolesQuery } from '../api/modules/roles';

export default function DisplayUsers() {
  const [usePatch] = usePatchUserMutation();
  const [roleState, setRoleState] = useState('User');

  const { data: users } = useGetUsersQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: roles } = useGetRolesQuery({
    refetchOnMountOrArgChange: true,
  });

  const option = roles?.data.slice(1).map((role) => (
    <Option value={role.id} key={role.id}>
      {role.name}
    </Option>
  ));

  const dataSource = users?.data.slice(1).map(({ id, name, role, email }) => ({
    name,
    email,
    Role: role.name,
    key: id,
  }));

  const { confirm } = Modal;

  const showUpdateConfirm = (user) => {
    const body: any = {
      id: user.key,
      data: {
        name: user.name,
        email: user.email,
        password: null,
        isActive: true,
        roleId: roleState,
      },
    };

    confirm({
      title: 'Are you sure you want to update the role ?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        usePatch(body);
        message.config({
          top: 100,
        });
        message.success('Role updated succesfully!', 2);
      },
    });
  };

  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      render: (text) => (
        <Form>
          <Select
            defaultValue={text}
            style={{ width: 200 }}
            onChange={(opt) => {
              setRoleState(opt);
            }}
          >
            {option}
          </Select>
        </Form>
      ),
    },
    {
      title: 'Update',
      key: 'update',
      dataIndex: 'update',
      render: (_: object, record) => (
        <Button
          onClick={() => {
            showUpdateConfirm(record);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  return (
    <div
      className="usersWrapper"
      style={{ alignSelf: 'center', paddingTop: '90px' }}
    >
      <Row>
        <Col span={18} offset={3}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ hideOnSinglePage: true, pageSize: 4 }}
            style={{ overflowX: 'auto' }}
          />
        </Col>
      </Row>
    </div>
  );
}
