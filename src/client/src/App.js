import React, {useCallback, useEffect, useState} from 'react'

import {Avatar, Spin, Table, Icon, Modal, Empty} from 'antd'
import './App.css'
import {getAllStudents} from "./client"
import Container from "./Container"
import Footer from "./Footer";
import AddStudentForm from "./forms/AddStudentForm";
import {errorNotification} from "./Notification";

function App() {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false)

  const openAddStudentModal = () => {
    setIsAddStudentModalVisible(true)
  }

  const closeAddStudentModal = () => {
    setIsAddStudentModalVisible(false)
  }

  const fetchStudents = useCallback(() => {
    getAllStudents()
      .then(res => res.json())
      .then(students => {
        setStudents(students)
      })
      .catch((error) => {
        errorNotification(error.error.message, error.error.error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  if (isLoading) {
    const antIcon = <Icon type='loading' style={{fontSize: 24}} />

    return (
      <Container>
        <Spin indicator={antIcon} />
      </Container>
    )
  }

  const commonElements = () => (
    <div>
      <Modal
        title='Add new student'
        visible={isAddStudentModalVisible}
        onOk={closeAddStudentModal}
        onCancel={closeAddStudentModal}
        width={1000}
      >
        <AddStudentForm
          onSuccess={() => {
            closeAddStudentModal()
            fetchStudents()
          }}
          onFailure={(error) => {
            errorNotification(error.error.message, error.error.httpStatus)
          }}
        />
      </Modal>
      <Footer
        numberOfStudents={students.length}
        handleAddStudentClickEvent={openAddStudentModal}/>
    </div>
  )

  if (!isLoading && students.length > 0) {
    const columns = [
      {
        title: '',
        key: 'avatar',
        render: (text, student) => (
          <Avatar size='large'>
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
          </Avatar>
        ),
      },
      {
        title: 'Student ID',
        dataIndex: 'studentId',
        key: 'studentId',
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
      },
    ]

    return (
      <Container>
        <Table style={{marginBottom: '100px'}} dataSource={students} columns={columns} rowKey='studentId' pagination={false} />
        {commonElements()}
      </Container>
    )
  } else {
    return (
      <Container>
        <Empty description={
          <h1>No Students Found</h1>
        } />
        {commonElements()}
      </Container>
    )
  }
}

export default App;
