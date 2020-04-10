import React from 'react'
import {Formik} from 'formik'
import {Button, Input, Tag} from "antd"
import { addNewStudent } from '../client'

const inputBottomMargin = {marginBottom: '5px'}
const tagStyle = {backgroundColor: '#f50', color: '#fff', ...inputBottomMargin}

const AddStudentForm = ({onSuccess, onFailure}) => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', gender: '' }}
      validate={values => {
        let errors = {}

        if (!values.firstName) {
          errors.firstName = 'First name required'
        }

        if (!values.lastName) {
          errors.lastName = 'Last name required'
        }

        if (!values.email) {
          errors.email = 'Email required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
          errors.email = 'Invalid email'
        }

        if (!values.gender) {
          errors.gender = 'Gender required'
        } else if (!['MALE', 'male', 'FEMALE', 'female'].includes(values.gender)) {
          errors.gender = 'Gender must be: MALE, male, FEMALE, female'
        }

        return errors
      }}
      onSubmit={async (student, {setSubmitting}) => {
        try {
          await addNewStudent(student)
          onSuccess()
        } catch (e) {
          onFailure(e)
        }
        setSubmitting(false)
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
          submitForm,
          isValid
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <Input
              style={inputBottomMargin}
              name="firstName"
              placeholder="First name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.firstName && touched.firstName && <Tag style={tagStyle}>{errors.firstName}</Tag>}
            <Input
              style={inputBottomMargin}
              name="lastName"
              placeholder="Last name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lastName && touched.lastName && <Tag style={tagStyle}>{errors.lastName}</Tag>}
            <Input
              style={inputBottomMargin}
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && <Tag style={tagStyle}>{errors.email}</Tag>}
            <Input
              style={inputBottomMargin}
              name="gender"
              placeholder="Gender"
              value={values.gender}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.gender && touched.gender && <Tag style={tagStyle}>{errors.gender}</Tag>}
            <Button onClick={() => submitForm()} type="submit" disabled={isSubmitting || (touched && !isValid)}>
              Submit
            </Button>
          </form>
        );
      }}
    </Formik>
  )
}

export default AddStudentForm
