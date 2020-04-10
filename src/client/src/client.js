import fetch from 'unfetch'

const checkStatus = res => {
    if (res.ok) {
        return res
    } else {
        let error = new Error(res.statusText)
        error.response = res
        res.json().then(err => {
            error.error = err
        })
        return Promise.reject(error)
    }
}

export const getAllStudents = () => {
    return fetch('api/students').then(checkStatus)
}

export const addNewStudent = (student) => {
    return fetch('api/students', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(student)
    })
      .then(checkStatus)
}